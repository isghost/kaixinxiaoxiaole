'use strict';
export const SPRITEFRAME = {
    "__type__": "cc.SpriteFrame",
    "content": {
        "name": "",
        "atlas": "",
        "rect": {
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0,
        },
        "offset": {
            "x": 0,
            "y": 0,
        },
        "originalSize": {
            "width": 0,
            "height": 0,
        },
        "rotated": false,
        "capInsets": [
            0,
            0,
            0,
            0,
        ],
    },
};

export class SpriteFrame {

    static create() {
        return JSON.parse(JSON.stringify(SPRITEFRAME));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SPRITEFRAME));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SpriteFrame.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
