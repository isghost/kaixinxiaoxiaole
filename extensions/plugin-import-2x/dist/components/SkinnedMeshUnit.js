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
exports.SkinnedMeshUnit = exports.SKINNEDMESHUNIT = void 0;
exports.SKINNEDMESHUNIT = {
    "__type__": "cc.SkinnedMeshUnit",
    "mesh": null,
    "skeleton": null,
    "material": null,
    "_localTransform": {
        "__type__": "cc.Mat4",
        "m00": 1,
        "m01": 0,
        "m02": 0,
        "m03": 0,
        "m04": 0,
        "m05": 1,
        "m06": 0,
        "m07": 0,
        "m08": 0,
        "m09": 0,
        "m10": 1,
        "m11": 0,
        "m12": 0,
        "m13": 0,
        "m14": 0,
        "m15": 1,
    },
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_size": {
        "__type__": "cc.Vec2",
        "x": 1,
        "y": 1,
    },
};
class SkinnedMeshUnit {
    static create() {
        return JSON.parse(JSON.stringify(exports.SKINNEDMESHUNIT));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SKINNEDMESHUNIT));
            for (const key in json2D) {
                const value = json2D[key];
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
            const source = yield SkinnedMeshUnit.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.SkinnedMeshUnit = SkinnedMeshUnit;
