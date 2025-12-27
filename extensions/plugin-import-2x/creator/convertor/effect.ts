'use strict';
import { ImporterBase } from '../common/base';
import { chunksCacheBy2D } from '../common/utlis';
import {basename, dirname} from "path";
// @ts-ignore
import { ensureDirSync } from "fs-extra";

export class EffectImporter extends ImporterBase {
    type: string = 'effect';

    async import(main: any): Promise<boolean> {
        let effect = this.readFileSync();
        if (effect) {
            effect = this._replaceKeyword(effect);
            effect = this._replace(effect);
        }
        this._2dTo3dSource = effect;
        this._3dMeta.ver = '1.3.7';
        this._3dMeta.importer = "effect";
        console.warn(Editor.I18n.t('plugin-import-2x.effect_tips', { name: basename(this.destFsPath), uuid: this._3dMeta.uuid }));
        return true;
    }

    _replaceKeyword(effect: string) {
        effect = effect.replace(/texture:/g, 'mainTexture:');
        effect = effect.replace(/texture;/g, 'mainTexture;');
        effect = effect.replace(/texture,/g, 'mainTexture,');
        effect = effect.replace(/vs/g, 'unlit-vs');
        effect = effect.replace(/fs/g, 'unlit-fs');
        return effect;
    }

    _replace(effect: string): string {
        const includes = effect.match(/#include +[<]([^>]+)[>]/g) || [];
        for (const include of includes) {
            const results = include.match(/(?<=#include <)(.*)(?=>)/g);
            if (results && results[0]) {
                const value = results[0] as string;
                const info = chunksCacheBy2D.get(value);
                if (info) {
                    // this._writeChunksSync(info.from, info.to);
                    effect = effect.replace(include, include);
                }
            }
        }
        return effect;
    }

    _writeChunksSync(from: string, to: string) {
        const content = this.readFileSync(from);
        if (content) {
            const includes = content.match(/#include +[<]([^>]+)[>]/g) || [];
            for (const include of includes) {
                const results = include.match(/(?<=#include <)(.*)(?=>)/g);
                if (results && results[0]) {
                    const value = results[0] as string;
                    const info = chunksCacheBy2D.get(value);
                    if (info) {
                        this._writeChunksSync(info.from, info.to);
                    }
                }
            }
            ensureDirSync(dirname(to));
            this.writeFileSync(to, content);
        }
    }
}
