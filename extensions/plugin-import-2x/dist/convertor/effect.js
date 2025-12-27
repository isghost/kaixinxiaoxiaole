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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectImporter = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
const path_1 = require("path");
// @ts-ignore
const fs_extra_1 = require("fs-extra");
class EffectImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'effect';
    }
    import(main) {
        return __awaiter(this, void 0, void 0, function* () {
            let effect = this.readFileSync();
            if (effect) {
                effect = this._replaceKeyword(effect);
                effect = this._replace(effect);
            }
            this._2dTo3dSource = effect;
            this._3dMeta.ver = '1.3.7';
            this._3dMeta.importer = "effect";
            console.warn(Editor.I18n.t('plugin-import-2x.effect_tips', { name: (0, path_1.basename)(this.destFsPath), uuid: this._3dMeta.uuid }));
            return true;
        });
    }
    _replaceKeyword(effect) {
        effect = effect.replace(/texture:/g, 'mainTexture:');
        effect = effect.replace(/texture;/g, 'mainTexture;');
        effect = effect.replace(/texture,/g, 'mainTexture,');
        effect = effect.replace(/vs/g, 'unlit-vs');
        effect = effect.replace(/fs/g, 'unlit-fs');
        return effect;
    }
    _replace(effect) {
        const includes = effect.match(/#include +[<]([^>]+)[>]/g) || [];
        for (const include of includes) {
            const results = include.match(/(?<=#include <)(.*)(?=>)/g);
            if (results && results[0]) {
                const value = results[0];
                const info = utlis_1.chunksCacheBy2D.get(value);
                if (info) {
                    // this._writeChunksSync(info.from, info.to);
                    effect = effect.replace(include, include);
                }
            }
        }
        return effect;
    }
    _writeChunksSync(from, to) {
        const content = this.readFileSync(from);
        if (content) {
            const includes = content.match(/#include +[<]([^>]+)[>]/g) || [];
            for (const include of includes) {
                const results = include.match(/(?<=#include <)(.*)(?=>)/g);
                if (results && results[0]) {
                    const value = results[0];
                    const info = utlis_1.chunksCacheBy2D.get(value);
                    if (info) {
                        this._writeChunksSync(info.from, info.to);
                    }
                }
            }
            (0, fs_extra_1.ensureDirSync)((0, path_1.dirname)(to));
            this.writeFileSync(to, content);
        }
    }
}
exports.EffectImporter = EffectImporter;
