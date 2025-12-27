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
exports.PageView = exports.PAGEVIEW = void 0;
exports.PAGEVIEW = {
    "__type__": "cc.PageView",
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
    "autoPageTurningThreshold": 100,
    "pageTurningSpeed": 0.3,
    "pageEvents": [],
    "_sizeMode": 0,
    "_direction": 0,
    "_scrollThreshold": 0.5,
    "_pageTurningEventTiming": 0.1,
    "_indicator": null,
};
class PageView {
    static create() {
        return JSON.parse(JSON.stringify(exports.PAGEVIEW));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.PAGEVIEW));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                switch (key) {
                    case '_N$content':
                    case 'content':
                        source._content = value;
                        break;
                    case 'scrollThreshold':
                        source._scrollThreshold = value;
                        break;
                    case 'pageTurningEventTiming':
                        source._pageTurningEventTiming = value;
                        break;
                    case '_N$sizeMode':
                    case 'sizeMode':
                        source._sizeMode = value;
                        break;
                    case '_N$direction':
                    case 'direction':
                        source._direction = value;
                        break;
                    case '_N$indicator':
                    case 'indicator':
                        source._indicator = value;
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
            const source = yield PageView.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.PageView = PageView;
