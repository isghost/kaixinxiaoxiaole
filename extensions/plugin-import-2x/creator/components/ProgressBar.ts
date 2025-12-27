'use strict';
export const PROGRESSBAR = {
    "__type__": "cc.ProgressBar",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_barSprite": null,
    "_mode": 0,
    "_totalLength": 1,
    "_progress": 0.1,
    "_reverse": false,
};

export class ProgressBar {

    static create() {
        return JSON.parse(JSON.stringify(PROGRESSBAR));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PROGRESSBAR));
        for (let key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key.startsWith('_N$')) {
                key = key.replace(/N\$/, '');
            }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ProgressBar.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
