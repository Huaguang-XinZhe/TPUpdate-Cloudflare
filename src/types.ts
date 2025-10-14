// snippet_lang 枚举类型
export enum SnippetLang {
	// React
	ReactV4System = 'react-v4-system',
	ReactV4Light = 'react-v4-light',
	ReactV4Null = 'react-v4-null',
	ReactV3System = 'react-v3-system',
	ReactV3Light = 'react-v3-light',
	ReactV3Null = 'react-v3-null',
	// Vue
	VueV4System = 'vue-v4-system',
	VueV4Light = 'vue-v4-light',
	VueV4Null = 'vue-v4-null',
	VueV3System = 'vue-v3-system',
	VueV3Light = 'vue-v3-light',
	VueV3Null = 'vue-v3-null',
	// HTML
	HtmlV4System = 'html-v4-system',
	HtmlV4Light = 'html-v4-light',
	HtmlV4Null = 'html-v4-null',
	HtmlV3System = 'html-v3-system',
	HtmlV3Light = 'html-v3-light',
	HtmlV3Null = 'html-v3-null',
}

// language 切换请求的请求体类型
export interface LanguageRequestBody {
	snippet_lang: SnippetLang;
	uuid: string;
}
