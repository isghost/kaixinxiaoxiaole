'use strict';
export const PARTICLEASSET = {
    "__type__": "cc.ParticleAsset",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "spriteFrame": null,
};

export class ParticleAsset {

    static create() {
        return JSON.parse(JSON.stringify(PARTICLEASSET));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(PARTICLEASSET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ParticleAsset.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
