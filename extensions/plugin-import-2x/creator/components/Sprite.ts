'use strict';
import { ImporterBase } from "../common/base";
import { basename, extname } from "path";
import { getBlendFactor2DTo3D, importProjectAssets, setColor } from "../common/utlis";

export const SPRITE = {
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

export class Sprite {

    static create() {
        return JSON.parse(JSON.stringify(SPRITE));
    }

    static getAtlasSpriteFrame(atlasUuid: string, spriteFrameUuid: string) {
        const assets = importProjectAssets.get(atlasUuid);
        if (!assets || !assets.meta || !assets.meta.subMetas) {
            return null;
        }
        const subMetas = assets.meta.subMetas;
        for (const key in subMetas) {
            const subMeta = subMetas[key];
            if (subMeta.uuid === spriteFrameUuid) {
                return `${atlasUuid}@${ImporterBase.getNameByID(basename(key, extname(key)))}`;
            }
        }
        return null;
    }

    static async migrate(index: number, json2D: any, json3D: any) {
        const sprite = json2D[index];
        const source = JSON.parse(JSON.stringify(SPRITE));
        for (const key in sprite) {
            const value = sprite[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'node') {
                source.node = value;
                setColor(source, value.__id__, json2D);
            } else if (key === '_spriteFrame') {
                let __uuid__ = value.__uuid__;
                if (sprite['_atlas'] && __uuid__) {
                    __uuid__ = Sprite.getAtlasSpriteFrame(sprite['_atlas'].__uuid__, __uuid__);
                }
                else {
                    __uuid__ = await ImporterBase.getUuid(value.__uuid__, 'spriteFrame');
                }
                if (__uuid__) {
                    source._spriteFrame = {
                        __uuid__: __uuid__,
                    };
                }
            } else if (key === '_atlas') {
                source._atlas = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            } else if (key === '_materials') {
                // for (let i = 0; i < value.length; ++i) {
                let material = value[0];
                if (material) {
                    material = {
                        __uuid__: await ImporterBase.getUuid(material.__uuid__),
                    };
                    source._customMaterial = material;
                }
                // }
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Sprite.migrate(index, json2D, json3D);
        json3D.splice(index, 1, source);
        return source;
    }
}
