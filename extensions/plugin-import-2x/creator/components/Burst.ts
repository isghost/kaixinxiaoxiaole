'use strict';
export const BURST = {
    "__type__": "cc.Burst",
    "_time": 0,
    "_repeatCount": 1,
    "repeatInterval": 1,
    "count": {
        "__id__": 1,
    },
};

export class Burst {

    static create() {
        return JSON.parse(JSON.stringify(BURST));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BURST));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Burst.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
