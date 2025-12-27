'use strict';
export const TYPESCRIPT = {
    "__type__": "cc.TypeScript",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
};

export class TypeScript {

    static create() {
        return JSON.parse(JSON.stringify(TYPESCRIPT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TYPESCRIPT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TypeScript.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
