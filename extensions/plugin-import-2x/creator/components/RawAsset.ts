'use strict';
export const RAWASSET = {
    "__type__": "cc.RawAsset",
    "_name": "",
    "_objFlags": 0,
};

export class RawAsset {

    static create() {
        return JSON.parse(JSON.stringify(RAWASSET));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RAWASSET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RawAsset.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
