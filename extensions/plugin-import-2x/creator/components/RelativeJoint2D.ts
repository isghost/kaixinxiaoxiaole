'use strict';
export const RELATIVEJOINT2D = {
    "__type__": "cc.RelativeJoint2D",
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
    "_maxForce": 5,
    "_maxTorque": 0.7,
    "_correctionFactor": 0.3,
    "_angularOffset": 0,
    "_linearOffset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_autoCalcOffset": true,
};

export class RelativeJoint2D {

    static create() {
        return JSON.parse(JSON.stringify(RELATIVEJOINT2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RELATIVEJOINT2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RelativeJoint2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
