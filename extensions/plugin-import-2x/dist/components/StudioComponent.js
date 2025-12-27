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
exports.StudioComponent = exports.STUDIOCOMPONENT = void 0;
exports.STUDIOCOMPONENT = {
    "__type__": "cc.StudioComponent",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "_type": 0,
    "_checkNormalBackFrame": null,
    "_checkPressedBackFrame": null,
    "_checkDisableBackFrame": null,
    "_checkNormalFrame": null,
    "_checkDisableFrame": null,
    "checkInteractable": true,
    "isChecked": true,
    "_atlasFrame": null,
    "firstChar": ".",
    "charWidth": 0,
    "charHeight": 0,
    "string": "",
    "_sliderBackFrame": null,
    "_sliderBarFrame": null,
    "_sliderBtnNormalFrame": null,
    "_sliderBtnPressedFrame": null,
    "_sliderBtnDisabledFrame": null,
    "sliderInteractable": true,
    "sliderProgress": 0.5,
    "listInertia": false,
    "listDirection": 0,
    "listHorizontalAlign": 0,
    "listVerticalAlign": 0,
    "listPadding": 0,
};
class StudioComponent {
    static create() {
        return JSON.parse(JSON.stringify(exports.STUDIOCOMPONENT));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.STUDIOCOMPONENT));
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
            const source = yield StudioComponent.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.StudioComponent = StudioComponent;
