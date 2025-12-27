'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefabInfo = exports.PREFABINFO = void 0;
const base_1 = require("../common/base");
exports.PREFABINFO = {
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
class PrefabInfo {
    static create() {
        return JSON.parse(JSON.stringify(exports.PREFABINFO));
    }
    static migrate(json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.PREFABINFO));
            let isPrefab = false;
            if (json3D && json3D[0]) {
                isPrefab = json3D[0].__type__ === 'cc.Prefab';
            }
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'asset') {
                    if (value.__uuid__) {
                        let __uuid__;
                        if (isPrefab) {
                            __uuid__ = base_1.ImporterBase.getNewUuid(value.__uuid__);
                        }
                        else {
                            __uuid__ = yield base_1.ImporterBase.getUuid(value.__uuid__);
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
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield PrefabInfo.migrate(json2D[index], json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.PrefabInfo = PrefabInfo;
