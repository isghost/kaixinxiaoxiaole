'use strict';
export const GRADIENTRANGE = {
    "__type__": "cc.GradientRange",
    "_mode": 0,
    "color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
};

export class GradientRange {

    static create() {
        return JSON.parse(JSON.stringify(GRADIENTRANGE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(GRADIENTRANGE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await GradientRange.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
