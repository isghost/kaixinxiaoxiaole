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
exports.BoxCollider2D = exports.BOXCOLLIDER2D = void 0;
exports.BOXCOLLIDER2D = {
    "__type__": "cc.BoxCollider2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "tag": 0,
    "_group": 1,
    "_density": 1,
    "_sensor": false,
    "_friction": 0.2,
    "_restitution": 0,
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_size": {
        "__type__": "cc.Size",
        "width": 1,
        "height": 1,
    },
};
class BoxCollider2D {
    static create() {
        return JSON.parse(JSON.stringify(exports.BOXCOLLIDER2D));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.BOXCOLLIDER2D));
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
            const source = yield BoxCollider2D.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.BoxCollider2D = BoxCollider2D;
