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
exports.Sp_Skeleton = exports.SP_SKELETON = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
exports.SP_SKELETON = {
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
class Sp_Skeleton {
    static create() {
        return JSON.parse(JSON.stringify(exports.SP_SKELETON));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SP_SKELETON));
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
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
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
            const source = yield Sp_Skeleton.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Sp_Skeleton = Sp_Skeleton;
