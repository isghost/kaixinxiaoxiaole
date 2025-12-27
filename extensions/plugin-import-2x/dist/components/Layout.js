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
exports.Layout = exports.LAYOUT = void 0;
exports.LAYOUT = {
    "__type__": "cc.Layout",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_resizeMode": 0,
    "_N$layoutType": 0,
    "_N$padding": 0,
    "_cellSize": {
        "__type__": "cc.Size",
        "width": 40,
        "height": 40,
    },
    "_startAxis": 0,
    "_paddingLeft": 0,
    "_paddingRight": 0,
    "_paddingTop": 0,
    "_paddingBottom": 0,
    "_spacingX": 0,
    "_spacingY": 0,
    "_verticalDirection": 1,
    "_horizontalDirection": 0,
    "_affectedByScale": false,
};
class Layout {
    static create() {
        return JSON.parse(JSON.stringify(exports.LAYOUT));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.LAYOUT));
            for (let key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key.startsWith('_N$')) {
                    key = key.replace(/N\$/, '');
                }
                if (key === '_padding') {
                    source._paddingLeft = source._paddingRight = source._paddingTop = source._paddingBottom = value;
                }
                else if (key === '_resize') {
                    source._resizeMode = value;
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
            const source = yield Layout.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Layout = Layout;
