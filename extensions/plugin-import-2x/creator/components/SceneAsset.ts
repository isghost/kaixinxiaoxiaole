'use strict';
export const SCENEASSET = {
    "__type__": "cc.SceneAsset",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "scene": null,
    "asyncLoadAssets": false,
};

export class SceneAsset {

    static create() {
        return JSON.parse(JSON.stringify(SCENEASSET));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SCENEASSET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SceneAsset.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
