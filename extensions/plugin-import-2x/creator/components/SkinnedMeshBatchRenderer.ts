'use strict';
import { ImporterBase } from "../common/base";

export const SKINNEDMESHBATCHRENDERER = {
    "__type__": "cc.SkinnedMeshBatchRenderer",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
    "_visFlags": 0,
    "lightmapSettings": {
        "__id__": 1,
    },
    "_mesh": null,
    "_shadowCastingMode": 0,
    "_shadowReceivingMode": 1,
    "_enableMorph": true,
    "_skeleton": null,
    "_skinningRoot": null,
    "atlasSize": 1024,
    "batchableTextureNames": [],
    "units": [],
};

export class SkinnedMeshBatchRenderer {

    static create() {
        return JSON.parse(JSON.stringify(SKINNEDMESHBATCHRENDERER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SKINNEDMESHBATCHRENDERER));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_materials') {
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
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SkinnedMeshBatchRenderer.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
