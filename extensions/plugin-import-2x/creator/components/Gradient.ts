'use strict';
export const GRADIENT = {
    "__type__": "cc.Gradient",
    "colorKeys": [],
    "alphaKeys": [],
    "mode": 0,
};

export class Gradient {

    static create() {
        return JSON.parse(JSON.stringify(GRADIENT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(GRADIENT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Gradient.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
