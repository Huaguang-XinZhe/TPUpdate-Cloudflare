/**
 * 判断一个路径是不是 png、jpg、jpeg 的图片请求
 * @param path 路径
 * @returns 是否是图片请求
 */
export const isImageRequest = (path: string): boolean => {
	return path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg');
};

/**
 * 从 snippet_lang 中移除主题段（最后一段）
 * @returns result: 移除主题段后的 snippet_lang；isRemoved: 是否真正移除
 */
export const removeThemeFromSnippetLang = (snippet_lang: string): { result: string; isRemoved: boolean } => {
	let result = snippet_lang;
	let isRemoved = false;

	const parts = snippet_lang.split('-');
	if (parts.length === 3) {
		const theme = parts.pop();
		result = snippet_lang.replace(`-${theme}`, '');
		isRemoved = true;
	}

	return { result, isRemoved };
};
