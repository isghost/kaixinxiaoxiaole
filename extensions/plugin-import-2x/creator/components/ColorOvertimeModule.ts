'use strict';
export const COLOROVERTIMEMODULE = {
    "__type__": "cc.ColorOvertimeModule",
    "_enable": false,
    "color": {
        "__id__": 1,
    },
};

export class ColorOvertimeModule {

    static create() {
        return JSON.parse(JSON.stringify(COLOROVERTIMEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(COLOROVERTIMEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'enable') {
                source._enable = value;
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ColorOvertimeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
