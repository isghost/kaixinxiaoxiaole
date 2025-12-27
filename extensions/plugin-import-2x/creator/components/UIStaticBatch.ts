'use strict';
export const UISTATICBATCH = {
    "__type__": "cc.UIStaticBatch",
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

export class UIStaticBatch {

    static create() {
        return JSON.parse(JSON.stringify(UISTATICBATCH));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UISTATICBATCH));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UIStaticBatch.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
