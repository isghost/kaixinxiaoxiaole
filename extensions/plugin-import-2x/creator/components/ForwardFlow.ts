'use strict';
export const FORWARDFLOW = {
    "__type__": "ForwardFlow",
    "_name": "",
    "_priority": 0,
    "_tag": 0,
    "_stages": [],
};

export class ForwardFlow {

    static create() {
        return JSON.parse(JSON.stringify(FORWARDFLOW));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(FORWARDFLOW));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ForwardFlow.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
