'use strict';
export const ALPHAKEY = {
    "__type__": "cc.AlphaKey",
    "alpha": 1,
    "time": 0,
};

export class AlphaKey {

    static create() {
        return JSON.parse(JSON.stringify(ALPHAKEY));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(ALPHAKEY));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await AlphaKey.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
