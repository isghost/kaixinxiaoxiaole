'use strict';
export const MODELLIGHTMAPSETTINGS = {
    "__type__": "cc.ModelLightmapSettings",
    "texture": null,
    "uvParam": {
        "__type__": "cc.Vec4",
        "x": 0,
        "y": 0,
        "z": 0,
        "w": 0,
    },
    "_bakeable": false,
    "_castShadow": false,
    "_receiveShadow": false,
    "_recieveShadow": false,
    "_lightmapSize": 64,
};

export class ModelLightmapSettings {

    static create() {
        return JSON.parse(JSON.stringify(MODELLIGHTMAPSETTINGS));
    }

    static async migrate(index: any, json2D: any) {
        const source = JSON.parse(JSON.stringify(MODELLIGHTMAPSETTINGS));
        const json = json2D[index];
        for (const key in json) {
            const value = json[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ModelLightmapSettings.migrate(index, json2D);
        json3D.splice(index, 1, source);
        return source;
    }
}
