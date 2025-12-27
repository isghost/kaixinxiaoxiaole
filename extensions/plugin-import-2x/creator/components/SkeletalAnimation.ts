'use strict';
import { ImporterBase } from "../common/base";

export const SKELETALANIMATION = {
    "__type__": "cc.SkeletalAnimation",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "playOnLoad": false,
    "_clips": [],
    "_defaultClip": null,
    "_useBakedAnimation": true,
    "_sockets": [],
};

export class SkeletalAnimation {

    static create() {
        return JSON.parse(JSON.stringify(SKELETALANIMATION));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SKELETALANIMATION));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_defaultClip') {
                source._defaultClip = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            }
            else if (key === '_clips') {
                for (let i = 0; i < value.length; ++i) {
                    let clip = value[i];
                    if (clip) {
                        clip = {
                            __uuid__: await ImporterBase.getUuid(clip.__uuid__),
                        };
                    }
                    source._clips.push(clip);
                }
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SkeletalAnimation.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
