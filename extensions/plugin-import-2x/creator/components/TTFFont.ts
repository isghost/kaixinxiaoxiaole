'use strict';
export const TTFFONT = {
    "__type__": "cc.TTFFont",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_fontFamily": null,
};

export class TTFFont {

    static create() {
        return JSON.parse(JSON.stringify(TTFFONT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TTFFONT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TTFFont.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
