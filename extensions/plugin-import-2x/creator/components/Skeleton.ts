'use strict';
export const SKELETON = {
    "__type__": "cc.Skeleton",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_joints": [],
    "_bindposes": [],
    "_hash": 0,
};

export class Skeleton {

    static create() {
        return JSON.parse(JSON.stringify(SKELETON));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SKELETON));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Skeleton.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
