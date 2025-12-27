import { ImporterBase } from '../common/base';
import { scriptList, scriptName} from "../common/utlis";
import {parseTSCode} from "../common/parseCode";

export class TSImporter extends ImporterBase {
    type: string = 'script';
    async import(main: any): Promise<boolean> {
        try {
            this._3dMeta.ver = '4.0.21';
            this._3dMeta.importer = 'typescript';
            let name = this.pathInfo!.name;
            // 类名只保留字母
            name = scriptName.getValidClassName(name);
            let code = this.readFileSync();
            if (code) {
                let needParse = false;
                let commentCode = '';
                code.trim().split('\n').forEach((line: string) => {
                    commentCode += '// ' + line + `\n`;
                    if (line.includes('export default class ') ||
                        line.includes('export class ') ||
                        line.includes('@ccclass')
                    ) {
                        needParse = true;
                    }
                });
                if (needParse) {
                    const data = await parseTSCode(name, this.sourceFsPath);
                    this._2dTo3dSource = data.content;
                    this._2dTo3dSource += `/**\n`;
                    this._2dTo3dSource += ` * ${Editor.I18n.t('plugin-import-2x.plugin_js_tips')}\n`;
                    this._2dTo3dSource += ` */\n`;
                    this._2dTo3dSource += commentCode;
                } else {
                    this._2dTo3dSource = code;
                }

                scriptList.set(name, this.destFsPath);
            }
            return true;
        }
        catch (e) {
            console.error(e + ',\n this file path: ' + this.sourceFsPath);
            return false;
        }
    }
}
