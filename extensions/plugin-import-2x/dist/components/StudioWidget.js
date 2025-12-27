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
exports.StudioWidget = exports.STUDIOWIDGET = void 0;
exports.STUDIOWIDGET = {
    "__type__": "cc.StudioWidget",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_alignFlags": 0,
    "_target": null,
    "_left": 0,
    "_right": 0,
    "_top": 0,
    "_bottom": 0,
    "_horizontalCenter": 0,
    "_verticalCenter": 0,
    "_isAbsLeft": true,
    "_isAbsRight": true,
    "_isAbsTop": true,
    "_isAbsBottom": true,
    "_isAbsHorizontalCenter": true,
    "_isAbsVerticalCenter": true,
    "_originalWidth": 0,
    "_originalHeight": 0,
    "_alignMode": 2,
    "_lockFlags": 0,
};
class StudioWidget {
    static create(nodeID, name) {
        const widget = JSON.parse(JSON.stringify(exports.STUDIOWIDGET));
        if (nodeID) {
            widget.node = {
                __id__: nodeID,
            };
        }
        if (name) {
            widget._name = name;
        }
        return widget;
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.STUDIOWIDGET));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'alignMode') {
                    source._alignMode = value;
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
            const source = yield StudioWidget.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.StudioWidget = StudioWidget;
