'use strict';

export const WIDGET = {
    "__type__": "cc.Widget",
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

function getAlignMode(value: number) {
    switch (value) {
        case 1:
            return 2;
        case 2:
            return 1;
    }
    return value;
}

export class Widget {

    static create(nodeID?: number, name?: string) {
        const widget = JSON.parse(JSON.stringify(WIDGET));
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

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(WIDGET));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'alignMode') {
                source._alignMode = getAlignMode(value);
            } else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Widget.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
