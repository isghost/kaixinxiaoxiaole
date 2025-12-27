'use strict';
export const CURVERANGE = {
    "__type__": "cc.CurveRange",
    "mode": 0,
    "constant": 0,
    "constantMin": 0,
    "constantMax": 0,
    "multiplier": 1,
};

export class CurveRange {

    static create() {
        return JSON.parse(JSON.stringify(CURVERANGE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(CURVERANGE));
        for (const key in json2D) {
            const value = json2D[key];
            if (value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await CurveRange.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
