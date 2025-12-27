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
exports.Label = exports.LABEL = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
exports.LABEL = {
    "__type__": "cc.Label",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_customMaterial": null,
    "_visFlags": 0,
    "_srcBlendFactor": 2,
    "_dstBlendFactor": 4,
    "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_useOriginalSize": true,
    "_string": "label",
    "_horizontalAlign": 1,
    "_verticalAlign": 1,
    "_actualFontSize": 0,
    "_fontSize": 40,
    "_fontFamily": "Arial",
    "_lineHeight": 40,
    "_overflow": 0,
    "_enableWrapText": true,
    "_font": null,
    "_isSystemFontUsed": true,
    "_isItalic": false,
    "_isBold": false,
    "_isUnderline": false,
    "_underlineHeight": 0,
    "_cacheMode": 0,
};
class Label {
    static create() {
        return JSON.parse(JSON.stringify(exports.LABEL));
    }
    static migrate(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.LABEL));
            const label = json2D[index];
            for (const key in label) {
                const value = label[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
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
                else if (key === '_N$file') {
                    source._font = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_N$string') {
                    source._string = value;
                }
                else if (key === '_N$fontFamily') {
                    source._fontFamily = value;
                }
                else if (key === '_N$overflow') {
                    source._overflow = value;
                }
                else if (key === '_N$cacheMode') {
                    source._cacheMode = value;
                }
                else if (key === '_N$horizontalAlign') {
                    source._horizontalAlign = value;
                }
                else if (key === '_N$verticalAlign') {
                    source._verticalAlign = value;
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else {
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Label.migrate(index, json2D, json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Label = Label;
