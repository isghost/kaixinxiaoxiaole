'use strict';
export const JSONASSET = {
    "__type__": "cc.JsonAsset",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "json": null,
};

export class JsonAsset {

    static create() {
        return JSON.parse(JSON.stringify(JSONASSET));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(JSONASSET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await JsonAsset.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
