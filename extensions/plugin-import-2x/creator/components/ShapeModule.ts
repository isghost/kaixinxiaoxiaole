'use strict';
export const SHAPEMODULE = {
    "__type__": "cc.ShapeModule",
    "_enable": false,
    "_shapeType": 2,
    "shapeType": 2,
    "emitFrom": 3,
    "alignToDirection": false,
    "randomDirectionAmount": 0,
    "sphericalDirectionAmount": 0,
    "randomPositionAmount": 0,
    "radius": 1,
    "radiusThickness": 1,
    "arcMode": 0,
    "arcSpread": 0,
    "arcSpeed": {
        "__id__": 1,
    },
    "length": 5,
    "boxThickness": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_position": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_rotation": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_scale": {
        "__type__": "cc.Vec3",
        "x": 1,
        "y": 1,
        "z": 1,
    },
    "_arc": 6.283185307179586,
    "_angle": 0.4363323129985824,
};

export class ShapeModule {

    static create() {
        return JSON.parse(JSON.stringify(SHAPEMODULE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SHAPEMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ShapeModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
