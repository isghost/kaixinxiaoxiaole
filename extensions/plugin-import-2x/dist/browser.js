'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
* 插件定义的方法
* Methods defined by extension
* 可以在 package.json 里的 contributions 里定义 messages 触发这里的方法
* And of course, messages can be defined in the contributions section in package.JSON to trigger the method here
*/
exports.methods = {
    importCreatorProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Editor.Dialog.select({
                title: Editor.I18n.t('plugin-import-2x.select_dialog.title'),
                path: (yield Editor.Profile.getConfig('plugin-import-2x', 'import-path')) || Editor.Project.path,
                type: 'directory',
            });
            if (!result.filePaths || !result.filePaths[0]) {
                return;
            }
            Editor.Profile.setConfig('plugin-import-2x', 'import-path', result.filePaths[0]);
            Editor.Panel.open('plugin-import-2x.creator');
        });
    },
};
/**
 * 启动的时候执行的初始化方法
 * Initialization method performed at startup
 */
exports.load = function () { };
/**
 * 插件被关闭的时候执行的卸载方法
 * Uninstall method performed when the extension is closed
 */
exports.unload = function () { };
