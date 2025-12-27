'use strict';
import { ImporterBase } from "../common/base";
import { getBlendFactor2DTo3D } from "../common/utlis";

export const GRAPHICS = {
    "__type__": "cc.Graphics",
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
    "_lineWidth": 1,
    "_strokeColor": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 255,
    },
    "_lineJoin": 2,
    "_lineCap": 0,
    "_fillColor": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_miterLimit": 10,
};

export class Graphics {

    static create() {
        return JSON.parse(JSON.stringify(GRAPHICS));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(GRAPHICS));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) {
                continue;
            }
            if (key === '_materials') {
                let material = value[0];
                if (material) {
                    material = {
                        __uuid__: await ImporterBase.getUuid(material.__uuid__),
                    };
                }
                source._customMaterial = material;
            } else if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Graphics.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
