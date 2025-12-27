'use strict';
export const AUDIOSOURCE = {
    "__type__": "cc.AudioSource",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_clip": null,
    "_loop": false,
    "_playOnAwake": true,
    "_volume": 1,
};

export class AudioSource {

    static create() {
        return JSON.parse(JSON.stringify(AUDIOSOURCE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(AUDIOSOURCE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await AudioSource.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
