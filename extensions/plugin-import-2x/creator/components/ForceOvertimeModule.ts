'use strict';
export const FORCEOVERTIMEMODULE = {
    "__type__": "cc.ForceOvertimeModule",
    "_enable": false,
    "x": {
        "__id__": 1,
    },
    "y": {
        "__id__": 2,
    },
    "z": {
        "__id__": 3,
    },
    "space": 1,
};

export class ForceOvertimeModule {

    static create() {
        return JSON.parse(JSON.stringify(FORCEOVERTIMEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(FORCEOVERTIMEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ForceOvertimeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
