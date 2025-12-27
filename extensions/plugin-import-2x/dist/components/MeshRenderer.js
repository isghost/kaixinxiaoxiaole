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
exports.MeshRenderer = exports.MESHRENDERER = void 0;
const base_1 = require("../common/base");
const ModelLightmapSettings_1 = require("./ModelLightmapSettings");
exports.MESHRENDERER = {
    "__type__": "cc.MeshRenderer",
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
};
class MeshRenderer {
    static create() {
        return JSON.parse(JSON.stringify(exports.MESHRENDERER));
    }
    static migrate(index, json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = json2D[index];
            const source = JSON.parse(JSON.stringify(exports.MESHRENDERER));
            for (const key in json) {
                const value = json[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === '_materials') {
                    source._materials = [];
                    for (let i = 0; i < value.length; ++i) {
                        let material = value[0];
                        if (material) {
                            material = {
                                __uuid__: yield base_1.ImporterBase.getUuid(material.__uuid__),
                            };
                            source._materials.push(material);
                        }
                    }
                }
                else if (key === '_receiveShadows') {
                    // 1 = ON, 0 = OFF
                    source._shadowReceivingMode = value === 'true' ? 1 : 0;
                }
                else if (key === '_mesh') {
                    source._mesh = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
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
            const source = yield MeshRenderer.migrate(index, json2D);
            const modelLightmapSettings = ModelLightmapSettings_1.ModelLightmapSettings.create();
            json3D.push(modelLightmapSettings);
            source.lightmapSettings = {
                __id__: json3D.length - 1,
            };
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.MeshRenderer = MeshRenderer;
