/**
 * 欢迎使用 Cloudflare Workers！这是一个标准的 Worker 应用程序。
 *
 * - 在终端中运行 `npm run dev` 启动开发服务器
 * - 在浏览器中打开 http://localhost:8787/ 查看你的 Worker 运行情况
 * - 运行 `npm run deploy` 发布你的应用程序
 *
 * 在 `wrangler.jsonc` 中绑定资源到你的 worker。添加绑定后，可以使用 `npm run cf-typegen`
 * 重新生成 `Env` 对象的类型定义。
 *
 * 了解更多信息请访问 https://developers.cloudflare.com/workers
 */

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
		// 简单的问候响应
		const greeting = 'Hello, World!';

		return new Response(greeting, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
