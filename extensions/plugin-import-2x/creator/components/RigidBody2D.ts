'use strict';
export const RIGIDBODY2D = {
    "__type__": "cc.RigidBody2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "enabledContactListener": false,
    "bullet": false,
    "awakeOnLoad": true,
    "_group": 1,
    "_type": 2,
    "_allowSleep": true,
    "_gravityScale": 1,
    "_linearDamping": 0,
    "_angularDamping": 0,
    "_linearVelocity": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_angularVelocity": 0,
    "_fixedRotation": false,
};

export class RigidBody2D {

    static create() {
        return JSON.parse(JSON.stringify(RIGIDBODY2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RIGIDBODY2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RigidBody2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
