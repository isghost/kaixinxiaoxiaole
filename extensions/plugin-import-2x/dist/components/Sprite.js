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
exports.Sprite = exports.SPRITE = void 0;
const base_1 = require("../common/base");
const path_1 = require("path");
const utlis_1 = require("../common/utlis");
exports.SPRITE = {
    "__type__": "cc.Sprite",
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
    "_spriteFrame": null,
    "_type": 0,
    "_fillType": 0,
    "_sizeMode": 1,
    "_fillCenter": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_fillStart": 0,
    "_fillRange": 0,
    "_isTrimmedMode": true,
    "_useGrayscale": false,
    "_atlas": null,
};
class Sprite {
    static create() {
        return JSON.parse(JSON.stringify(exports.SPRITE));
    }
    static getAtlasSpriteFrame(atlasUuid, spriteFrameUuid) {
        const assets = utlis_1.importProjectAssets.get(atlasUuid);
        if (!assets || !assets.meta || !assets.meta.subMetas) {
            return null;
        }
        const subMetas = assets.meta.subMetas;
        for (const key in subMetas) {
            const subMeta = subMetas[key];
            if (subMeta.uuid === spriteFrameUuid) {
                return `${atlasUuid}@${base_1.ImporterBase.getNameByID((0, path_1.basename)(key, (0, path_1.extname)(key)))}`;
            }
        }
        return null;
    }
    static migrate(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const sprite = json2D[index];
            const source = JSON.parse(JSON.stringify(exports.SPRITE));
            for (const key in sprite) {
                const value = sprite[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
                }
                else if (key === '_spriteFrame') {
                    let __uuid__ = value.__uuid__;
                    if (sprite['_atlas'] && __uuid__) {
                        __uuid__ = Sprite.getAtlasSpriteFrame(sprite['_atlas'].__uuid__, __uuid__);
                    }
                    else {
                        __uuid__ = yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame');
                    }
                    if (__uuid__) {
                        source._spriteFrame = {
                            __uuid__: __uuid__,
                        };
                    }
                }
                else if (key === '_atlas') {
                    source._atlas = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_materials') {
                    // for (let i = 0; i < value.length; ++i) {
                    let material = value[0];
                    if (material) {
                        material = {
                            __uuid__: yield base_1.ImporterBase.getUuid(material.__uuid__),
                        };
                        source._customMaterial = material;
                    }
                    // }
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
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
            const source = yield Sprite.migrate(index, json2D, json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Sprite = Sprite;
