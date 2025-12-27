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
exports.CapsuleCollider = exports.CAPSULECOLLIDER = void 0;
const base_1 = require("../common/base");
exports.CAPSULECOLLIDER = {
    "__type__": "cc.CapsuleCollider",
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
    "_radius": 0.5,
    "_cylinderHeight": 1,
    "_direction": 1,
};
class CapsuleCollider {
    static create() {
        return JSON.parse(JSON.stringify(exports.CAPSULECOLLIDER));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.CAPSULECOLLIDER));
            for (const key in json2D) {
                const value = json2D[key];
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
                else {
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield CapsuleCollider.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.CapsuleCollider = CapsuleCollider;
