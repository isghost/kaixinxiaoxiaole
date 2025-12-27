'use strict';
export const COMPACTVALUETYPEARRAY = {
    "__type__": "cc.CompactValueTypeArray",
    "_byteOffset": 0,
    "_unitCount": 0,
    "_unitElement": 0,
    "_length": 0,
};

export class CompactValueTypeArray {

    static create() {
        return JSON.parse(JSON.stringify(COMPACTVALUETYPEARRAY));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(COMPACTVALUETYPEARRAY));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await CompactValueTypeArray.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
