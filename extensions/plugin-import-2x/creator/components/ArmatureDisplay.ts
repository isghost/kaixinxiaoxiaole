'use strict';
import { getBlendFactor2DTo3D } from "../common/utlis";
import { ImporterBase } from "../common/base";

export const ARMATUREDISPLAY = {
    "__type__": "dragonBones.ArmatureDisplay",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_visFlags": 0,
    "_customMaterial": null,
    "_srcBlendFactor": 2,
    "_dstBlendFactor": 4,
    "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "playTimes": -1,
    "premultipliedAlpha": false,
    "_defaultArmatureIndexValue": -1,
    "_dragonAsset": null,
    "_dragonAtlasAsset": null,
    "_armatureName": "weapon_1005",
    "_animationName": "",
    "_animationIndexValue": 0,
    "_defaultCacheModeValue": 0,
    "_timeScale": 1,
    "_playTimes": -1,
    "_debugBones": false,
    "_enableBatch": false,
    "_sockets": [],
};

export class ArmatureDisplay {

    static create() {
        return JSON.parse(JSON.stringify(ARMATUREDISPLAY));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(ARMATUREDISPLAY));
        for (let key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) {
                continue;
            }
            if (key.startsWith('_N$')) {
                key = key.replace(/N\$/, '');
            }
            if (key === '_materials') {
                let material = value[0];
                if (material) {
                    material = {
                        __uuid__: await ImporterBase.getUuid(material.__uuid__),
                    };
                }
                source._customMaterial = material;
            }
            else if (key === '_dragonAsset') {
                source._dragonAsset = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            }
            else if (key === '_dragonAtlasAsset') {
                source._dragonAtlasAsset = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            }
            else if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ArmatureDisplay.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
