'use strict';
export const TEXTUREANIMATIONMODULE = {
    "__type__": "cc.TextureAnimationModule",
    "_enable": false,
    "_numTilesX": 0,
    "numTilesX": 0,
    "_numTilesY": 0,
    "numTilesY": 0,
    "_mode": 0,
    "animation": 0,
    "frameOverTime": {
        "__id__": 1,
    },
    "startFrame": {
        "__id__": 2,
    },
    "cycleCount": 0,
    "_flipU": 0,
    "_flipV": 0,
    "_uvChannelMask": -1,
    "randomRow": false,
    "rowIndex": 0,
};

export class TextureAnimationModule {

    static create() {
        return JSON.parse(JSON.stringify(TEXTUREANIMATIONMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TEXTUREANIMATIONMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TextureAnimationModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
