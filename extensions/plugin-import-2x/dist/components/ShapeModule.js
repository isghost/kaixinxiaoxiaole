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
exports.ShapeModule = exports.SHAPEMODULE = void 0;
exports.SHAPEMODULE = {
    "__type__": "cc.ShapeModule",
    "_enable": false,
    "_shapeType": 2,
    "shapeType": 2,
    "emitFrom": 3,
    "alignToDirection": false,
    "randomDirectionAmount": 0,
    "sphericalDirectionAmount": 0,
    "randomPositionAmount": 0,
    "radius": 1,
    "radiusThickness": 1,
    "arcMode": 0,
    "arcSpread": 0,
    "arcSpeed": {
        "__id__": 1,
    },
    "length": 5,
    "boxThickness": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_position": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_rotation": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_scale": {
        "__type__": "cc.Vec3",
        "x": 1,
        "y": 1,
        "z": 1,
    },
    "_arc": 6.283185307179586,
    "_angle": 0.4363323129985824,
};
class ShapeModule {
    static create() {
        return JSON.parse(JSON.stringify(exports.SHAPEMODULE));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SHAPEMODULE));
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
            const source = yield ShapeModule.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.ShapeModule = ShapeModule;
