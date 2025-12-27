'use strict';
export const SIZEOVERTIMEMODULE = {
    "__type__": "cc.SizeOvertimeModule",
    "_enable": false,
    "separateAxes": false,
    "size": {
        "__id__": 1,
    },
    "x": {
        "__id__": 2,
    },
    "y": {
        "__id__": 3,
    },
    "z": {
        "__id__": 4,
    },
};

export class SizeOvertimeModule {

    static create() {
        return JSON.parse(JSON.stringify(SIZEOVERTIMEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SIZEOVERTIMEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SizeOvertimeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
