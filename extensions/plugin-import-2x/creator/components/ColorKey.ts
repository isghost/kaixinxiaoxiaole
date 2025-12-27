'use strict';
export const COLORKEY = {
    "__type__": "cc.ColorKey",
    "color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "time": 0,
};

export class ColorKey {

    static create() {
        return JSON.parse(JSON.stringify(COLORKEY));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(COLORKEY));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ColorKey.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
