'use strict';
export const TEXTURECUBE = {
    "__type__": "cc.TextureCube",
    "content": {
        "base": "2,2,0,0,0,8",
        "mipmaps": [],
    },
};

export class TextureCube {

    static create() {
        return JSON.parse(JSON.stringify(TEXTURECUBE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TEXTURECUBE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TextureCube.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
