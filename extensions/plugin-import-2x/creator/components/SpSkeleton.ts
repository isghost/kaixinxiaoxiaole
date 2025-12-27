'use strict';
import { ImporterBase } from "../common/base";
import { getBlendFactor2DTo3D, setColor } from "../common/utlis";

export const SP_SKELETON = {
    "__type__": "sp.Skeleton",
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
    "loop": true,
    "timeScale": 1,
    "_useTint": false,
    "_preCacheMode": 1,
    "_cacheMode": 1,
    "_defaultCacheMode": 0,
    "_debugBones": false,
    "_debugSlots": false,
    "_skeletonData": null,
    "defaultSkin": "default",
    "defaultAnimation": "",
    "_sockets": [],
    "_debugMesh": false,
};

export class Sp_Skeleton {

    static create() {
        return JSON.parse(JSON.stringify(SP_SKELETON));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SP_SKELETON));
        for (let key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) {
                continue;
            }
            if (key.startsWith('_N$')) {
                key = key.replace(/N\$/, '');
            }
            if (key === '_skeletonData') {
                source._skeletonData = {
                    __uuid__: await ImporterBase.getUuid(value.__uuid__),
                };
            } else if (key === 'node') {
                source.node = value;
                setColor(source, value.__id__, json2D);
            } else if (key === '_dstBlendFactor') {
                source._dstBlendFactor = getBlendFactor2DTo3D(value);
            } else if (key === '_srcBlendFactor') {
                source._srcBlendFactor = getBlendFactor2DTo3D(value);
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Sp_Skeleton.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
