import { type LanguageRequestBody } from './types';
import { parse } from 'cookie';
import { isImageRequest, removeThemeFromSnippetLang } from './utils';

// 静态资源目录名
const staticDirectoryName = 'static';
// 路由 json 目录名
const routesDirectoryName = 'routes';
// zip 资源目录名
const downloadsDirectoryName = 'downloads';

// 判断是否在禁止列表中
const isForbidden = (path: string) => {
	// 禁止列表
	const forbiddenList = ['/cdn-cgi/', '/.well-known/'];
	return forbiddenList.some((prefix) => path.startsWith(prefix));
};

/**
 * 通用查找资源逻辑：尝试多个路径，返回第一个非 404 的响应
 */
async function tryFetchStaticAsset(routePaths: string[], origin: string, assets: Fetcher): Promise<Response | null> {
	for (const routePath of routePaths) {
		const routeUrl = new URL(routePath, origin);
		const res = await assets.fetch(routeUrl);
		if (res.status !== 404) {
			return res;
		}
	}
	return null;
}

/**
 * 处理根路径请求
 */
function handleRootPath(url: URL, assets: Fetcher): Promise<Response> {
	const indexUrl = new URL(`/${staticDirectoryName}/plus/index.html`, url.origin);
	return assets.fetch(indexUrl);
}

/**
 * 处理下载请求
 */
async function handleDownload(path: string, url: URL, assets: Fetcher, env: Env): Promise<Response> {
	const filename = `${path.split('/').at(-2)}.zip`;
	console.log('filename:', filename);
	const downloadUrl = new URL(`/${downloadsDirectoryName}/${filename}`, url.origin);
	const response = await assets.fetch(downloadUrl);

	// 如果静态资源中有文件，直接返回并设置正确的响应头
	if (response.status === 200) {
		const newHeaders = new Headers(response.headers);
		newHeaders.set('Content-Type', 'application/zip');
		newHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: newHeaders,
		});
	}

	// 如果静态资源中没有，直接重定向到源站，让客户端自己去下载
	// 源站会处理下载，利用 Cloudflare 的 CDN 缓存
	console.log('📦 静态资源未找到，重定向到源站:', filename);
	return Response.redirect(`${env.ORIGIN_URL}${path}`, 302);
}

/**
 * 处理语言切换请求
 */
async function handleLanguageSwitch(request: Request, url: URL): Promise<{ response: Response; cookieValue: string | null }> {
	const bodyJson = (await request.json()) as LanguageRequestBody;
	console.log('bodyJson:', bodyJson);
	const referer = request.headers.get('referer');
	console.log('referer:', referer);

	let response: Response;
	let cookieValue: string | null = null;

	if (referer) {
		const refererPath = new URL(referer).pathname;
		console.log('refererPath:', refererPath);
		const snippet_lang = bodyJson.snippet_lang;
		// 303 重定向到 /routes${refererPath}/${snippet_lang}
		const redirectUrl = new URL(`/${routesDirectoryName}${refererPath}/${snippet_lang}`, url.origin);
		console.log('redirectUrl:', redirectUrl.toString());
		response = Response.redirect(redirectUrl.toString(), 303);
		cookieValue = snippet_lang;
	} else {
		response = new Response('Bad Request', { status: 400 });
	}

	return { response, cookieValue };
}

/**
 * 处理直接路由请求
 */
function handleDirectRoute(path: string, url: URL, assets: Fetcher): Promise<Response> {
	console.log('handleDirectRoute:', path);
	return assets.fetch(new URL(`${path}.json`, url.origin));
}

/**
 * 处理 Level 4 路径的路由请求（带语言选择）
 */
async function handleLevel4Route(path: string, request: Request, url: URL, assets: Fetcher): Promise<Response | null> {
	const parsedCookie = parse(request.headers.get('Cookie') || '');
	console.log('parsedCookie:', parsedCookie);
	const snippet_lang = parsedCookie.snippet_lang || 'react-v4-system';
	console.log('snippet_lang:', snippet_lang);

	const { result: snippet_lang_without_theme, isRemoved } = removeThemeFromSnippetLang(snippet_lang);
	console.log('snippet_lang_without_theme:', snippet_lang_without_theme);

	const snippet_lang_path = `/${routesDirectoryName}${path}/${snippet_lang}.json`;
	const snippet_lang_without_theme_path = `/${routesDirectoryName}${path}/${snippet_lang_without_theme}.json`;
	const snippet_lang_system_path = `/${routesDirectoryName}${path}/${snippet_lang}-system.json`;

	const routePaths = isRemoved ? [snippet_lang_path, snippet_lang_without_theme_path] : [snippet_lang_path, snippet_lang_system_path]; // 必须考虑后边这种情况，因为 cookie 有可能是不包括主题的那种
	console.log('routePaths:', routePaths);

	return tryFetchStaticAsset(routePaths, url.origin, assets);
}

/**
 * 处理普通路由请求
 */
async function handleNormalRoute(path: string, url: URL, assets: Fetcher): Promise<Response | null> {
	const routePaths = [`/${routesDirectoryName}${path}.json`, `/${routesDirectoryName}${path}/index.json`];
	return tryFetchStaticAsset(routePaths, url.origin, assets);
}

/**
 * 处理 Inertia 请求
 */
async function handleInertiaRequest(path: string, request: Request, url: URL, assets: Fetcher): Promise<Response> {
	console.log('handleInertiaRequest:', path);

	const startTime = performance.now();

	let response: Response | null = null;
	let cookieValue: string | null = null;

	// 语言切换请求
	if (path.endsWith('/language')) {
		const result = await handleLanguageSwitch(request, url);
		response = result.response;
		cookieValue = result.cookieValue;
	}
	// 直接路由请求
	else if (path.startsWith(`/${routesDirectoryName}`)) {
		response = await handleDirectRoute(path, url, assets);
	}
	// 普通路由请求
	else {
		const pathWithoutPlus = path.replace('/plus/', '');
		console.log('pathWithoutPlus:', pathWithoutPlus);
		const pathLevel = pathWithoutPlus.split('/').length;
		console.log('pathLevel:', pathLevel);

		if (pathLevel === 4) {
			response = await handleLevel4Route(path, request, url, assets);
		} else {
			response = await handleNormalRoute(path, url, assets);
		}
		console.log('response:', response?.status);
	}

	const endTime = performance.now();
	console.log('Find route times(ms): ', endTime - startTime);

	// 添加 X-Inertia 响应头和 Cookie
	const newHeaders = new Headers(response!.headers);
	newHeaders.set('X-Inertia', 'true');
	if (cookieValue) {
		newHeaders.set('Set-Cookie', `snippet_lang=${cookieValue}`);
		console.log('Set-Cookie:', `snippet_lang=${cookieValue}`);
	}

	return new Response(response!.body, {
		status: response!.status,
		statusText: response!.statusText,
		headers: newHeaders,
	});
}

/**
 * 回源获取资源，并使用 Cloudflare 边缘缓存
 */
async function fetchFromOrigin(path: string, url: URL, env: Env): Promise<Response> {
	console.log('🔄 开始回源:', path);
	const startTime = performance.now();

	const originUrl = new URL(`${url.pathname}${url.search}`, env.ORIGIN_URL);
	const response = await fetch(originUrl, {
		cf: {
			cacheTtl: 2678400, // 缓存 31 天
			cacheEverything: true,
		},
	});

	const endTime = performance.now();
	console.log('⏱️  回源完成:', path, '耗时:', `${endTime - startTime}ms`, '状态:', response.status);

	const cacheStatus = response.headers.get('cf-cache-status');
	if (cacheStatus) {
		console.log('  📦 Cloudflare 缓存状态:', cacheStatus);
	}

	return response;
}

/**
 * 处理普通静态资源请求
 */
async function handleStaticRequest(path: string, url: URL, assets: Fetcher, env: Env): Promise<Response> {
	// 图片请求特殊处理
	if (isImageRequest(path)) {
		const imageUrl = new URL(`/${staticDirectoryName}${path}.avif`, url.origin);
		const imageResponse = await assets.fetch(imageUrl);
		if (imageResponse.status === 200) {
			return imageResponse;
		}
	}

	// 先尝试从静态资源读取
	const resUrl = new URL(`/${staticDirectoryName}${path}`, url.origin);
	let response = await assets.fetch(resUrl);

	// 静态资源中没有，回源并利用 Cloudflare 边缘缓存
	if (response.status === 404) {
		response = await fetchFromOrigin(path, url, env);
	}

	return response;
}

export default {
	/**
	 * 这是 Cloudflare Worker 的标准 fetch 处理程序
	 *
	 * @param request - 客户端提交给 Worker 的请求
	 * @param env - 引用在 wrangler.jsonc 中声明的绑定的接口
	 * @param ctx - Worker 的执行上下文
	 * @returns 要发送回客户端的响应
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		// 特殊路径，提前禁止
		if (isForbidden(path)) {
			return new Response('Not Found', { status: 404 });
		}

		try {
			// 处理根路径
			if (path === '/' || path === '') {
				return handleRootPath(url, env.ASSETS);
			}

			// 处理下载请求
			if (path.endsWith('/download')) {
				return handleDownload(path, url, env.ASSETS, env);
			}

			// 检查是否是 Inertia 请求
			const inertiaHeader = request.headers.get('X-Inertia');

			if (inertiaHeader === 'true') {
				return handleInertiaRequest(path, request, url, env.ASSETS);
			} else {
				return handleStaticRequest(path, url, env.ASSETS, env);
			}
		} catch (error) {
			console.error(error);
			return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
