'use strict';
export const VELOCITYOVERTIMEMODULE = {
    "__type__": "cc.VelocityOvertimeModule",
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
    "speedModifier": {
        "__id__": 4,
    },
    "space": 1,
};

export class VelocityOvertimeModule {

    static create() {
        return JSON.parse(JSON.stringify(VELOCITYOVERTIMEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(VELOCITYOVERTIMEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await VelocityOvertimeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
