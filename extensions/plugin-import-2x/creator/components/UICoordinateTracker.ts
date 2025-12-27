'use strict';
export const UICOORDINATETRACKER = {
    "__type__": "cc.UICoordinateTracker",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "syncEvents": [],
    "_target": null,
    "_camera": null,
    "_useScale": true,
    "_distance": 1,
};

export class UICoordinateTracker {

    static create() {
        return JSON.parse(JSON.stringify(UICOORDINATETRACKER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UICOORDINATETRACKER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UICoordinateTracker.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
