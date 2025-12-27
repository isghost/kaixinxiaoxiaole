'use strict';
export const LINE = {
    "__type__": "cc.Line",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_texture": null,
    "_worldSpace": false,
    "_positions": [],
    "_width": {
        "__id__": 1,
    },
    "_tile": {
        "__type__": "cc.Vec2",
        "x": 1,
        "y": 1,
    },
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_color": {
        "__id__": 2,
    },
};

export class Line {

    static create() {
        return JSON.parse(JSON.stringify(LINE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(LINE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Line.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
