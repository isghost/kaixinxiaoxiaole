'use strict';
export const DIRECTIONALLIGHT = {
    "__type__": "cc.DirectionalLight",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_useColorTemperature": false,
    "_colorTemperature": 6550,
    "_staticSettings": {
        "__id__": 1,
    },
    "_illuminance": 65000,
};

export class DirectionalLight {

    static create() {
        return JSON.parse(JSON.stringify(DIRECTIONALLIGHT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(DIRECTIONALLIGHT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await DirectionalLight.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
