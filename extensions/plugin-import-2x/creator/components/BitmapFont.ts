'use strict';
export const BITMAPFONT = {
    "__type__": "cc.BitmapFont",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "fntDataStr": "",
    "spriteFrame": null,
    "fontSize": -1,
    "fntConfig": null,
};

export class BitmapFont {

    static create() {
        return JSON.parse(JSON.stringify(BITMAPFONT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BITMAPFONT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await BitmapFont.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
