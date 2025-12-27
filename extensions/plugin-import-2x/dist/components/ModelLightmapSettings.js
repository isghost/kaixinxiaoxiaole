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
exports.ModelLightmapSettings = exports.MODELLIGHTMAPSETTINGS = void 0;
exports.MODELLIGHTMAPSETTINGS = {
    "__type__": "cc.ModelLightmapSettings",
    "texture": null,
    "uvParam": {
        "__type__": "cc.Vec4",
        "x": 0,
        "y": 0,
        "z": 0,
        "w": 0,
    },
    "_bakeable": false,
    "_castShadow": false,
    "_receiveShadow": false,
    "_recieveShadow": false,
    "_lightmapSize": 64,
};
class ModelLightmapSettings {
    static create() {
        return JSON.parse(JSON.stringify(exports.MODELLIGHTMAPSETTINGS));
    }
    static migrate(index, json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.MODELLIGHTMAPSETTINGS));
            const json = json2D[index];
            for (const key in json) {
                const value = json[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                source[key] = value;
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield ModelLightmapSettings.migrate(index, json2D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.ModelLightmapSettings = ModelLightmapSettings;
