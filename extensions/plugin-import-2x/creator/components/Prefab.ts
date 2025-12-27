'use strict';
export const PREFAB = {
    "__type__": "cc.Prefab",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "data": null,
    "optimizationPolicy": 0,
    "asyncLoadAssets": false,
};

export class Prefab {

    static create() {
        return JSON.parse(JSON.stringify(PREFAB));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PREFAB));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Prefab.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
