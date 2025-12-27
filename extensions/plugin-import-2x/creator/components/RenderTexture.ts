'use strict';
export const RENDERTEXTURE = {
    "__type__": "cc.RenderTexture",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_width": 1,
    "_height": 1,
};

export class RenderTexture {

    static create() {
        return JSON.parse(JSON.stringify(RENDERTEXTURE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RENDERTEXTURE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RenderTexture.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
