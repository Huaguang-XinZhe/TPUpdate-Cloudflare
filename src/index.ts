import { DurableObject } from 'cloudflare:workers';

/**
 * 欢迎使用 Cloudflare Workers！这是你的第一个 Durable Objects 应用程序。
 *
 * - 在终端中运行 `npm run dev` 启动开发服务器
 * - 在浏览器中打开 http://localhost:8787/ 查看你的 Durable Object 运行情况
 * - 运行 `npm run deploy` 发布你的应用程序
 *
 * 在 `wrangler.jsonc` 中绑定资源到你的 worker。添加绑定后，可以使用 `npm run cf-typegen`
 * 重新生成 `Env` 对象的类型定义。
 *
 * 了解更多信息请访问 https://developers.cloudflare.com/durable-objects
 */

/** Durable Object 的行为在导出的 Javascript 类中定义 */
export class MyDurableObject extends DurableObject {
	/**
	 * 构造函数在创建 Durable Object 时调用一次，即对给定标识符首次调用
	 * 	`DurableObjectStub::get` 时（无操作构造函数可以省略）
	 *
	 * @param ctx - 与 Durable Object 状态交互的接口
	 * @param env - 引用在 wrangler.jsonc 中声明的绑定的接口
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * Durable Object 暴露一个 RPC 方法 sayHello，当 Durable Object 实例
	 * 通过 stub 上的相同方法调用从 Worker 接收请求时将被调用
	 *
	 * @param name - 从 Worker 提供给 Durable Object 实例的名称
	 * @returns 要发送回 Worker 的问候语
	 */
	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
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
	async fetch(request, env, ctx): Promise<Response> {
		// 创建一个 stub 来打开与名为 "foo" 的 Durable Object 实例的通信通道。
		//
		// 所有 Worker 对名为 "foo" 的 Durable Object 实例的请求
		// 都将发送到单个远程 Durable Object 实例。
		const stub = env.MY_DURABLE_OBJECT.getByName('foo');

		// 在 stub 上调用 `sayHello()` RPC 方法来调用
		// 远程 Durable Object 实例上的方法。
		const greeting = await stub.sayHello('world');

		return new Response(greeting);
	},
} satisfies ExportedHandler<Env>;
