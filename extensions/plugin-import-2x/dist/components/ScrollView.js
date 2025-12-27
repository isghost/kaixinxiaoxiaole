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
exports.ScrollView = exports.SCROLLVIEW = void 0;
exports.SCROLLVIEW = {
    "__type__": "cc.ScrollView",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "bounceDuration": 1,
    "brake": 0.5,
    "elastic": true,
    "inertia": true,
    "horizontal": true,
    "vertical": true,
    "cancelInnerEvents": true,
    "scrollEvents": [],
    "_content": null,
    "_horizontalScrollBar": null,
    "_verticalScrollBar": null,
};
class ScrollView {
    static create() {
        return JSON.parse(JSON.stringify(exports.SCROLLVIEW));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SCROLLVIEW));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'content' || key === '_N$content') {
                    source._content = value;
                }
                else if (key === '_N$horizontalScrollBar') {
                    source._horizontalScrollBar = value;
                }
                else if (key === '_N$verticalScrollBar') {
                    source._verticalScrollBar = value;
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
            const source = yield ScrollView.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.ScrollView = ScrollView;
