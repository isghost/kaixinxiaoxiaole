'use strict';
export const ANIMATION = {
    "__type__": "cc.Animation",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "playOnLoad": false,
    "_clips": [],
    "_defaultClip": null,
};

export class Animation {

    static create() {
        return JSON.parse(JSON.stringify(ANIMATION));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(ANIMATION));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Animation.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
