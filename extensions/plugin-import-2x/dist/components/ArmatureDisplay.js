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
exports.ArmatureDisplay = exports.ARMATUREDISPLAY = void 0;
const utlis_1 = require("../common/utlis");
const base_1 = require("../common/base");
exports.ARMATUREDISPLAY = {
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
class ArmatureDisplay {
    static create() {
        return JSON.parse(JSON.stringify(exports.ARMATUREDISPLAY));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.ARMATUREDISPLAY));
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
                            __uuid__: yield base_1.ImporterBase.getUuid(material.__uuid__),
                        };
                    }
                    source._customMaterial = material;
                }
                else if (key === '_dragonAsset') {
                    source._dragonAsset = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_dragonAtlasAsset') {
                    source._dragonAtlasAsset = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
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
            const source = yield ArmatureDisplay.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.ArmatureDisplay = ArmatureDisplay;
