'use strict';
export const TILEDMAPASSET = {
    "__type__": "cc.TiledMapAsset",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "tmxXmlStr": "",
    "tsxFiles": [],
    "tsxFileNames": [],
    "spriteFrames": [],
    "imageLayerSpriteFrame": [],
    "imageLayerSpriteFrameNames": [],
    "spriteFrameNames": [],
    "spriteFrameSizes": [],
};

export class TiledMapAsset {

    static create() {
        return JSON.parse(JSON.stringify(TILEDMAPASSET));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TILEDMAPASSET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TiledMapAsset.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
