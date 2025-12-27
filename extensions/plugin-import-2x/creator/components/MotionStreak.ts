'use strict';
import { getBlendFactor2DTo3D } from "../common/utlis";
import { ImporterBase } from "../common/base";

export const MOTIONSTREAK = {
    "__type__": "cc.MotionStreak",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
    "_visFlags": 0,
    "_srcBlendFactor": 2,
    "_dstBlendFactor": 4,
    "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_preview": false,
    "_fadeTime": 1,
    "_minSeg": 1,
    "_stroke": 64,
    "_texture": null,
    "_fastMode": false,
};

export class MotionStreak {

    static create() {
        return JSON.parse(JSON.stringify(MOTIONSTREAK));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(MOTIONSTREAK));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_texture') {
                source._texture = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__, 'texture'),
                };
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await MotionStreak.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
