declare module 'cc/env'{
	/**
	 * Running in Web platform
	 */
	export const HTML5: boolean;

	/**
	 * Running in native platform (mobile app, desktop app, or simulator).
	 */
	export const NATIVE: boolean;

	/**
	 * Running in ANDROID platform
	 */
	export const ANDROID: boolean;

	/**
	 * Running in IOS platform
	 */
	export const IOS: boolean;

	/**
	 * Running in MAC platform
	 */
	export const MAC: boolean;

	/**
	 * Running in WINDOWS platform
	 */
	export const WINDOWS: boolean;

	/**
	 * Running in LINUX platform
	 */
	export const LINUX: boolean;

	/**
	 * Running in OHOS platform
	 */
	export const OHOS: boolean;

	/**
	 * Running in OPEN_HARMONY platform
	 */
	export const OPEN_HARMONY: boolean;

	/**
	 * Running in the Wechat's mini game.
	 */
	export const WECHAT: boolean;

	/**
	 * Running in the Wechat's mini program.
	 */
	export const WECHAT_MINI_PROGRAM: boolean;

	/**
	 * Running in the xiaomi's quick game.
	 */
	export const XIAOMI: boolean;

	/**
	 * Running in the alipay's mini game.
	 */
	export const ALIPAY: boolean;

	/**
	 * Running in the taobao creative app.
	 */
	export const TAOBAO: boolean;

	/**
	 * Running in the taobao mini game.
	 */
	export const TAOBAO_MINIGAME: boolean;

	/**
	 * Running in the ByteDance's mini game.
	 */
	export const BYTEDANCE: boolean;

	/**
	 * Running in the oppo's quick game.
	 */
	export const OPPO: boolean;

	/**
	 * Running in the vivo's quick game.
	 */
	export const VIVO: boolean;

	/**
	 * Running in the huawei's quick game.
	 */
	export const HUAWEI: boolean;

	/**
	 * Running in the migu's quick game.
	 */
	export const MIGU: boolean;

	/**
	 * Running in the honor's quick game.
	 */
	export const HONOR: boolean;

	/**
	 * Running in the cocos runtime.
	 */
	export const COCOS_RUNTIME: boolean;

	/**
	 * Running in the editor.
	 */
	export const EDITOR: boolean;

	/**
	 * Run in editor but not in editor preview.
	 */
	export const EDITOR_NOT_IN_PREVIEW: boolean;

	/**
	 * Preview in browser or simulator.
	 */
	export const PREVIEW: boolean;

	/**
	 * Running in published project.
	 */
	export const BUILD: boolean;

	/**
	 * Running in the engine's unit test.
	 */
	export const TEST: boolean;

	/**
	 * Running debug mode.
	 */
	export const DEBUG: boolean;

	/**
	 * Running in the editor or preview.
	 */
	export const DEV: boolean;

	/**
	 * Running in mini game.
	 */
	export const MINIGAME: boolean;

	/**
	 * Running in runtime based environment.
	 */
	export const RUNTIME_BASED: boolean;

	/**
	 * Support JIT.
	 */
	export const SUPPORT_JIT: boolean;

	/**
	 * Running in environment where using JSB as the JavaScript interface binding scheme.
	 */
	export const JSB: boolean;

	/**
	 * The network access mode.
	 * - 0 Client
	 * - 1 ListenServer
	 * - 2 HostServer
	 */
	export const NET_MODE: number;

}
