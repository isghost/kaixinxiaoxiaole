"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSImporter = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
const parseCode_1 = require("../common/parseCode");
class JSImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'script';
    }
    beforeImport(projectRoot, sourceFsPath) {
        const _super = Object.create(null, {
            beforeImport: { get: () => super.beforeImport }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const skip = utlis_1.SKIPS_SCRIPT.find(value => {
                return sourceFsPath.endsWith(value);
            });
            if (skip) {
                return false;
            }
            return yield _super.beforeImport.call(this, projectRoot, sourceFsPath);
        });
    }
    import(main) {
        return __awaiter(this, void 0, void 0, function* () {
            this._3dMeta.ver = '4.0.21';
            this._3dMeta.importer = 'javascript';
            let name = this.pathInfo.name;
            // 类名只保留字母
            name = utlis_1.scriptName.getValidClassName(name);
            const baseCode = this.readFileSync();
            if (baseCode) {
                let needParse = false;
                let commentCode = '';
                baseCode.trim().split('\n').forEach((line) => {
                    commentCode += '// ' + line + `\n`;
                    if (line.includes('cc.Class(')) {
                        needParse = true;
                    }
                });
                let code = '';
                if (this._2dMeta && this._2dMeta.isPlugin) {
                    this._3dMeta.userData = {
                        isPlugin: this._2dMeta.isPlugin,
                        loadPluginInWeb: this._2dMeta.loadPluginInWeb,
                        loadPluginInNative: this._2dMeta.loadPluginInNative,
                        loadPluginInEditor: this._2dMeta.loadPluginInEditor,
                        importAsPlugin: this._2dMeta.isPlugin,
                    };
                }
                else {
                    if (needParse) {
                        const data = yield (0, parseCode_1.parseJSCode)(this.sourceFsPath, name);
                        code += data.topNote;
                        if (baseCode.includes('cc.Class(')) {
                            const classInfo = yield this.queryCCClass(main.$.engine2D, {
                                type: 'js',
                                path: this.destFsPath,
                                name: name,
                                code: baseCode,
                                classCount: 1,
                                ccKeys: data.ccKeys,
                                importCodeMap: data.importCodeMap,
                                otherCodeMap: data.otherCodeMap,
                                classCodeMap: data.classCodeMap,
                                endCodeMap: data.endCodeMap,
                                replaceScriptList: utlis_1.replaceScriptList,
                            });
                            if (classInfo) {
                                if (name !== classInfo.name) {
                                    console.warn(Editor.I18n.t('plugin-import-2x.script_rename_tips', {
                                        old: name,
                                        new: classInfo.name
                                    }));
                                }
                                (0, utlis_1.updateReplaceScriptList)(classInfo.replaceScriptList);
                                code += classInfo.classCode;
                            }
                        }
                        else {
                            console.warn(Editor.I18n.t('plugin-import-2x.skip_script_warn', {
                                name: this.pathInfo.name,
                            }));
                        }
                        code += `/**\n`;
                        code += ` * ${Editor.I18n.t('plugin-import-2x.plugin_js_tips')}\n`;
                        code += ` */\n`;
                        code += commentCode;
                        this._2dTo3dSource = code;
                    }
                    else {
                        this._2dTo3dSource = baseCode;
                    }
                    utlis_1.scriptList.set(this.pathInfo.name, this.destFsPath);
                }
            }
            return true;
        });
    }
}
exports.JSImporter = JSImporter;
