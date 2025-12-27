'use strict';
import { ImporterBase } from "../common/base";

export const MESHCOLLIDER = {
    "__type__": "cc.MeshCollider",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_material": null,
    "_isTrigger": false,
    "_center": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_mesh": null,
    "_convex": false,
};

export class MeshCollider {

    static create() {
        return JSON.parse(JSON.stringify(MESHCOLLIDER));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(MESHCOLLIDER));
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
        const source = await MeshCollider.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
