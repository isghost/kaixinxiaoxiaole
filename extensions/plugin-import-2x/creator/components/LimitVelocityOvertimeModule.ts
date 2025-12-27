'use strict';
export const LIMITVELOCITYOVERTIMEMODULE = {
    "__type__": "cc.LimitVelocityOvertimeModule",
    "_enable": false,
    "limitX": {
        "__id__": 1,
    },
    "limitY": {
        "__id__": 2,
    },
    "limitZ": {
        "__id__": 3,
    },
    "limit": {
        "__id__": 4,
    },
    "dampen": 3,
    "separateAxes": false,
    "space": 1,
};

export class LimitVelocityOvertimeModule {

    static create() {
        return JSON.parse(JSON.stringify(LIMITVELOCITYOVERTIMEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(LIMITVELOCITYOVERTIMEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await LimitVelocityOvertimeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
