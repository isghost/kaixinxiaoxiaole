'use strict';
export const AUDIOCLIP = {
    "__type__": "cc.AudioClip",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_duration": 0,
    "_loadMode": 3,
};

export class AudioClip {

    static create() {
        return JSON.parse(JSON.stringify(AUDIOCLIP));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(AUDIOCLIP));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await AudioClip.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
