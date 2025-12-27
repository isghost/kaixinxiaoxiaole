'use strict';
export const STUDIOCOMPONENT = {
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

export class StudioComponent {

    static create() {
        return JSON.parse(JSON.stringify(STUDIOCOMPONENT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(STUDIOCOMPONENT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await StudioComponent.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
