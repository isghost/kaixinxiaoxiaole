'use strict';
import { ImporterBase } from "../common/base";
import { getBlendFactor2DTo3D, setColor } from "../common/utlis";

export const MASK = {
    "__type__": "cc.Mask",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
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
    "_type": 0,
    "_inverted": false,
    "_segments": 64,
    "_spriteFrame": null,
    "_alphaThreshold": 0.1,
};

export class Mask {

    static typeTo2D(type: number) {
        switch (type) {
            case 2: // IMAGE_STENCIL
                return 3; // IMAGE_STENCIL
        }
        return type;
    }

    static create() {
        return JSON.parse(JSON.stringify(MASK));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(MASK));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'node') {
                source.node = value;
                setColor(source, value.__id__, json2D);
            }
            else if (key === '_type') {
                source._type = Mask.typeTo2D(value);
            }
            else if (key === '_N$alphaThreshold') {
                source._alphaThreshold = value;
            }
            else if (key === '_spriteFrame') {
                source._spriteFrame = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                };
            }
            else if (key === '_N$inverted') {
                source._inverted = value;
            } else if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_materials') {
                source._materials = [];
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Mask.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
