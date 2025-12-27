'use strict';
export const ANIMATIONCLIP = {
    "__type__": "cc.AnimationClip",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "sample": 60,
    "speed": 1,
    "wrapMode": 1,
    "events": [],
    "_duration": 0,
    "_keys": [],
    "_stepness": 0,
    "_curves": [],
    "_commonTargets": [],
    "_hash": 0,
};

export class AnimationClip {

    static create() {
        return JSON.parse(JSON.stringify(ANIMATIONCLIP));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(ANIMATIONCLIP));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await AnimationClip.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
