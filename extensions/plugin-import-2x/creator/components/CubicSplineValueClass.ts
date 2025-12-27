'use strict';
export const CUBICSPLINEVALUECLASS = {
    "__type__": "cc.CubicSplineVec2Value",
    "dataPoint": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "inTangent": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "outTangent": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
};

export class CubicSplineValueClass {

    static create() {
        return JSON.parse(JSON.stringify(CUBICSPLINEVALUECLASS));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(CUBICSPLINEVALUECLASS));
        for (const key in json2D) {
            const value = json2D[key];
            if (value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await CubicSplineValueClass.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
