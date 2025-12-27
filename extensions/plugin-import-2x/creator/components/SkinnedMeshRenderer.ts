'use strict';
import { ImporterBase } from "../common/base";
import { ModelLightmapSettings } from "./ModelLightmapSettings";

export const SKINNEDMESHRENDERER = {
    "__type__": "cc.SkinnedMeshRenderer",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
    "_visFlags": 0,
    "lightmapSettings": null,
    "_mesh": null,
    "_shadowCastingMode": 0,
    "_shadowReceivingMode": 1,
    "_enableMorph": true,
    "_skeleton": null,
    "_skinningRoot": null,
};

export class SkinnedMeshRenderer {

    static create() {
        return JSON.parse(JSON.stringify(SKINNEDMESHRENDERER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SKINNEDMESHRENDERER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_rootBone') {
                source._skinningRoot = value;
            }
            else if (key === '_receiveShadows') {
                // 1 = ON, 0 = OFF
                source._shadowReceivingMode = value === 'true' ? 1 : 0;
            }
            else if (key === '_materials') {
                source._materials = [];
                for (let i = 0; i < value.length; ++i) {
                    let material = value[0];
                    if (material) {
                        material = {
                            __uuid__: await ImporterBase.getUuid(material.__uuid__),
                        };
                        source._materials.push(material);
                    }
                }
            }
            else if (key === '_mesh') {
                source._mesh = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            }
            else if (key === '_skeleton') {
                source._skeleton = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SkinnedMeshRenderer.migrate(json2D[index]);
        const modelLightmapSettings = ModelLightmapSettings.create();
        json3D.push(modelLightmapSettings);
        source.lightmapSettings = {
            __id__: json3D.length - 1,
        };
        json3D.splice(index, 1, source);
        return source;
    }
}
