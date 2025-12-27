'use strict';
export const KEYFRAME = {
    "__type__": "cc.Keyframe",
    "time": 0,
    "value": 0,
    "inTangent": 0,
    "outTangent": 0,
};

export class Keyframe {

    static create() {
        return JSON.parse(JSON.stringify(KEYFRAME));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(KEYFRAME));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Keyframe.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
