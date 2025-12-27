'use strict';
export const TEXTURE2D = {
    "__type__": "cc.Texture2D",
    "content": {
        "base": "2,2,0,0,0,8",
        "mipmaps": [],
    },
};

export class Texture2D {

    static create() {
        return JSON.parse(JSON.stringify(TEXTURE2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TEXTURE2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Texture2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
