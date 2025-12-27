'use strict';
import { getBlendFactor2DTo3D } from "../common/utlis";

export const TILEDLAYER = {
    "__type__": "cc.TiledLayer",
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
};

export class TiledLayer {

    static create() {
        return JSON.parse(JSON.stringify(TILEDLAYER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TILEDLAYER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) {
                continue;
            }
            if (key === '_srcBlendFactor') {
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
        const source = await TiledLayer.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
