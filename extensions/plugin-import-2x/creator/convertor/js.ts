import { ImporterBase } from '../common/base';
import { scriptList, replaceScriptList, updateReplaceScriptList, SKIPS_SCRIPT, scriptName } from "../common/utlis";
import { parseJSCode } from "../common/parseCode";

export class JSImporter extends ImporterBase {
    type: string = 'script';

    async beforeImport(projectRoot: string, sourceFsPath: string): Promise<boolean> {
        const skip = SKIPS_SCRIPT.find(value => {
            return sourceFsPath.endsWith(value);
        });
        if (skip) {
            return false;
        }
        return await super.beforeImport(projectRoot, sourceFsPath);
    }

    async import(main: any): Promise<boolean> {
        this._3dMeta.ver = '4.0.21';
        this._3dMeta.importer = 'javascript';
        let name = this.pathInfo!.name;

        // 类名只保留字母
        name = scriptName.getValidClassName(name);
        const baseCode = this.readFileSync();
        if (baseCode) {
            let needParse = false;
            let commentCode = '';
            baseCode.trim().split('\n').forEach((line: string) => {
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
                }
            } else {
                if (needParse) {
                    const data = await parseJSCode(this.sourceFsPath, name);
                    code += data.topNote;
                    if (baseCode.includes('cc.Class(')) {
                        const classInfo: any = await this.queryCCClass(main.$.engine2D, {
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
                            replaceScriptList: replaceScriptList,
                        });

                        if (classInfo) {
                            if (name !== classInfo.name) {
                                console.warn(Editor.I18n.t('plugin-import-2x.script_rename_tips', {
                                    old: name,
                                    new: classInfo.name
                                }));
                            }
                            updateReplaceScriptList(classInfo.replaceScriptList);
                            code += classInfo.classCode;
                        }
                    } else {
                        console.warn(Editor.I18n.t('plugin-import-2x.skip_script_warn', {
                            name: this.pathInfo!.name,
                        }));
                    }
                    code += `/**\n`;
                    code += ` * ${Editor.I18n.t('plugin-import-2x.plugin_js_tips')}\n`;
                    code += ` */\n`;
                    code += commentCode;
                    this._2dTo3dSource = code;
                } else {
                    this._2dTo3dSource = baseCode;
                }
                scriptList.set(this.pathInfo!.name, this.destFsPath);
            }
        }
        return true;
    }
}
