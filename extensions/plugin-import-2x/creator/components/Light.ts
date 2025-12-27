'use strict';
import { StaticLightSettings } from "./StaticLightSettings";

export const LIGHT = {
    "__type__": "cc.Light",
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
};

export class Light {

    static create() {
        return JSON.parse(JSON.stringify(LIGHT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(LIGHT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Light.migrate(json2D[index]);
        const settings = StaticLightSettings.create();
        json3D.push(settings);
        source._staticSettings = {
            __id__: json3D.length - 1,
        };
        json3D.splice(index, 1, source);
        return source;
    }
}
