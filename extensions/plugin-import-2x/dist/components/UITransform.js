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
exports.UITransform = exports.UITRANSFORM = void 0;
exports.UITRANSFORM = {
    "__type__": "cc.UITransform",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_priority": 0,
    "_contentSize": {
        "__type__": "cc.Size",
        "width": 100,
        "height": 100,
    },
    "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0.5,
        "y": 0.5,
    },
};
class UITransform {
    static create(nodeID, name) {
        const uiTransform = JSON.parse(JSON.stringify(exports.UITRANSFORM));
        if (nodeID) {
            uiTransform.node = {
                __id__: nodeID,
            };
        }
        if (name) {
            uiTransform._name = name;
        }
        return uiTransform;
    }
    static add(node, nodeID, json3D) {
        let uiTransform;
        node._components.find((obj) => {
            const comp = json3D[obj.__id__];
            if (comp && comp.__type__ === 'cc.UITransform') {
                uiTransform = comp;
                return comp;
            }
        });
        if (!uiTransform) {
            uiTransform = UITransform.create();
            uiTransform.node = {
                __id__: nodeID,
            };
            json3D.push(uiTransform);
            node._components.push({
                __id__: json3D.length - 1,
            });
        }
        return uiTransform;
    }
    static setContentSize(node, nodeID, contentSize, json3D) {
        const uiTransform = UITransform.add(node, nodeID, json3D);
        uiTransform._contentSize = contentSize;
    }
    static setAnchorPoint(node, nodeID, anchorPoint, json3D) {
        const uiTransform = UITransform.add(node, nodeID, json3D);
        uiTransform._anchorPoint = anchorPoint;
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.UITRANSFORM));
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
            const source = yield UITransform.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.UITransform = UITransform;
