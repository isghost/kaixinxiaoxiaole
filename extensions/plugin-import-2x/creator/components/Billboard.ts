'use strict';
export const BILLBOARD = {
    "__type__": "cc.Billboard",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_texture": null,
    "_height": 0,
    "_width": 0,
    "_rotation": 0,
};

export class Billboard {

    static create() {
        return JSON.parse(JSON.stringify(BILLBOARD));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BILLBOARD));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Billboard.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
