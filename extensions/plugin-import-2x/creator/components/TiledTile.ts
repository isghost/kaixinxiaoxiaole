'use strict';
export const TILEDTILE = {
    "__type__": "cc.TiledTile",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_x": 0,
    "_y": 0,
};

export class TiledTile {

    static create() {
        return JSON.parse(JSON.stringify(TILEDTILE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TILEDTILE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TiledTile.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
