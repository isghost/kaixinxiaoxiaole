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
exports.Scrollbar = exports.SCROLLBAR = void 0;
exports.SCROLLBAR = {
    "__type__": "cc.ScrollBar",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_scrollView": null,
    "_handle": null,
    "_direction": 0,
    "_enableAutoHide": false,
    "_autoHideTime": 1,
};
class Scrollbar {
    static create() {
        return JSON.parse(JSON.stringify(exports.SCROLLBAR));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SCROLLBAR));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                switch (key) {
                    case '_N$handle':
                        source._handle = value;
                        break;
                    case '_N$direction':
                        source._direction = value;
                        break;
                    case 'enableAutoHide':
                        source._enableAutoHide = value;
                        break;
                    case 'autoHideTime':
                        source._autoHideTime = value;
                        break;
                    default:
                        source[key] = value;
                        break;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Scrollbar.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Scrollbar = Scrollbar;
