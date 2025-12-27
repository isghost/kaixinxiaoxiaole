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
exports.UIOpacity = exports.UIOPACITY = void 0;
exports.UIOPACITY = {
    "__type__": "cc.UIOpacity",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_opacity": 255,
};
class UIOpacity {
    static create() {
        return JSON.parse(JSON.stringify(exports.UIOPACITY));
    }
    static add(node, nodeID, json3D) {
        let uiOpacity;
        node._components.find((obj) => {
            const comp = json3D[obj.__id__];
            if (comp && comp.__type__ === 'cc.UIOpacity') {
                uiOpacity = comp;
                return comp;
            }
        });
        if (!uiOpacity) {
            uiOpacity = UIOpacity.create();
            uiOpacity.node = {
                __id__: nodeID,
            };
            json3D.push(uiOpacity);
            node._components.push({
                __id__: json3D.length - 1,
            });
        }
        return uiOpacity;
    }
    static setOpacity(node, nodeID, opacity, json3D) {
        const uiOpacity = UIOpacity.add(node, nodeID, json3D);
        uiOpacity._opacity = opacity;
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.UIOPACITY));
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
            const source = yield UIOpacity.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.UIOpacity = UIOpacity;
