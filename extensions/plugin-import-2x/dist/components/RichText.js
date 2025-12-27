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
exports.RichText = exports.RICHTEXT = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
exports.RICHTEXT = {
    "__type__": "cc.RichText",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_lineHeight": 40,
    "_string": "<color=#00ff00>Rich</color><color=#0fffff>Text</color>",
    "_horizontalAlign": 0,
    "_fontSize": 40,
    "_maxWidth": 0,
    "_fontFamily": "Arial",
    "_font": null,
    "_isSystemFontUsed": true,
    "_userDefinedFont": null,
    "_cacheMode": 0,
    "_imageAtlas": null,
    "_handleTouchEvent": true,
};
class RichText {
    static create() {
        return JSON.parse(JSON.stringify(exports.RICHTEXT));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.RICHTEXT));
            for (let key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    const node = json2D[value.__id__];
                    if (node && node._color) {
                        source._color.r = node._color.r;
                        source._color.g = node._color.g;
                        source._color.b = node._color.b;
                        source._color.a = node._color.a;
                    }
                }
                else if (key === '_materials') {
                    // for (let i = 0; i < value.length; ++i) {
                    let material = value[0];
                    if (material) {
                        material = {
                            __uuid__: yield base_1.ImporterBase.getUuid(material.__uuid__),
                        };
                    }
                    source._customMaterial = material;
                    // }
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else {
                    key = key.replace(/_N\$/, '_');
                    if (value.__uuid__) {
                        value.__uuid__ = yield base_1.ImporterBase.getUuid(value.__uuid__);
                    }
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield RichText.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.RichText = RichText;
