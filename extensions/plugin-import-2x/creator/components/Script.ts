'use strict';
export const SCRIPT = {
    "__type__": "cc.Script",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
};

export class Script {

    static create() {
        return JSON.parse(JSON.stringify(SCRIPT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SCRIPT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Script.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
