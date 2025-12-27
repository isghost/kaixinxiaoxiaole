'use strict';
export const LABELATLAS = {
    "__type__": "cc.LabelAtlas",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "fntDataStr": "",
    "spriteFrame": null,
    "fontSize": -1,
    "fntConfig": null,
};

export class LabelAtlas {

    static create() {
        return JSON.parse(JSON.stringify(LABELATLAS));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(LABELATLAS));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await LabelAtlas.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
