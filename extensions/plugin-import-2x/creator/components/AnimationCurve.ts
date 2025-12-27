'use strict';
export const ANIMATIONCURVE = {
    "__type__": "cc.AnimationCurve",
    "preWrapMode": 2,
    "postWrapMode": 8,
    "keyFrames": [
        {
            "time": 0,
            "value": 1,
            "inTangent": 0,
            "outTangent": 0,
        },
        {
            "time": 1,
            "value": 1,
            "inTangent": 0,
            "outTangent": 0,
        },
    ],
};

export class AnimationCurve {

    static create() {
        return JSON.parse(JSON.stringify(ANIMATIONCURVE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(ANIMATIONCURVE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await AnimationCurve.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
