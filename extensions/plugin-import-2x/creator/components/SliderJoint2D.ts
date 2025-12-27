'use strict';
export const SLIDERJOINT2D = {
    "__type__": "cc.SliderJoint2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "anchor": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "connectedAnchor": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "collideConnected": false,
    "connectedBody": null,
    "_angle": 0,
    "_autoCalcAngle": true,
    "_enableMotor": false,
    "_maxMotorForce": 1000,
    "_motorSpeed": 1000,
    "_enableLimit": false,
    "_lowerLimit": 0,
    "_upperLimit": 0,
};

export class SliderJoint2D {

    static create() {
        return JSON.parse(JSON.stringify(SLIDERJOINT2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SLIDERJOINT2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SliderJoint2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
