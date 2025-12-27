'use strict';
import { ImporterBase } from "../common/base";

export const PREFABINFO = {
    "__type__": "cc.PrefabInfo",
    "root": null,
    "asset": null,
    "fileId": "",
    "sync": false,
    "_synced": {
        "default": false,
        "serializable": false,
    },
};

export class PrefabInfo {

    static create() {
        return JSON.parse(JSON.stringify(PREFABINFO));
    }

    static async migrate(json2D: any, json3D: any) {
        const source = JSON.parse(JSON.stringify(PREFABINFO));
        let isPrefab = false;
        if (json3D && json3D[0]) {
            isPrefab = json3D[0].__type__ === 'cc.Prefab';
        }
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'asset') {
                if (value.__uuid__) {
                    let __uuid__;
                    if (isPrefab) {
                        __uuid__ = ImporterBase.getNewUuid(value.__uuid__);
                    } else {
                        __uuid__ = await ImporterBase.getUuid(value.__uuid__);
                    }
                    source.asset = {
                        __uuid__: __uuid__,
                    };
                }
                else if (value.__id__) {
                    source.asset = value;
                }
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PrefabInfo.migrate(json2D[index], json3D);
        json3D.splice(index, 1, source);
        return source;
    }
}
