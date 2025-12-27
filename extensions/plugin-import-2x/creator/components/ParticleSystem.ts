'use strict';
import { ImporterBase } from "../common/base";
import {GradientRange} from "./GradientRange";
import {CurveRange} from "./CurveRange";

export const PARTICLESYSTEM = {
    "__type__": "cc.ParticleSystem",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
    "_visFlags": 0,
    "startColor": {
        "__id__": -1,
    },
    "scaleSpace": 1,
    "startSize3D": false,
    "startSizeX": {
        "__id__": 2,
    },
    "startSize": {
        "__id__": 2,
    },
    "startSizeY": {
        "__id__": 3,
    },
    "startSizeZ": {
        "__id__": 4,
    },
    "startSpeed": {
        "__id__": 5,
    },
    "startRotation3D": false,
    "startRotationX": {
        "__id__": 6,
    },
    "startRotationY": {
        "__id__": 7,
    },
    "startRotationZ": {
        "__id__": 8,
    },
    "startRotation": {
        "__id__": 8,
    },
    "startDelay": {
        "__id__": 9,
    },
    "startLifetime": {
        "__id__": 10,
    },
    "duration": 5,
    "loop": true,
    "simulationSpeed": 1,
    "playOnAwake": true,
    "gravityModifier": {
        "__id__": 11,
    },
    "rateOverTime": {
        "__id__": 12,
    },
    "rateOverDistance": {
        "__id__": 13,
    },
    "bursts": [],
    "_colorOverLifetimeModule": null,
    "_shapeModule": null,
    "_sizeOvertimeModule": null,
    "_velocityOvertimeModule": null,
    "_forceOvertimeModule": null,
    "_limitVelocityOvertimeModule": null,
    "_rotationOvertimeModule": null,
    "_textureAnimationModule": null,
    "_trailModule": null,
    "renderer": {
        "__id__": 14,
    },
    "enableCulling": false,
    "_prewarm": false,
    "_capacity": 100,
    "_simulationSpace": 1,
};

const PARTICLESYSTEMRENDERER = {
    "__type__": "cc.ParticleSystemRenderer",
    "_renderMode": 0,
    "_velocityScale": 1,
    "_lengthScale": 1,
    "_mesh": null,
    "_mainTexture": null,
    "_useGPU": false,
};

export class ParticleSystem {

    static create() {
        return JSON.parse(JSON.stringify(PARTICLESYSTEM));
    }

    static createRenderer() {
        return JSON.parse(JSON.stringify(PARTICLESYSTEMRENDERER));
    }

    static async migrate(particleSystem: any) {
        const source = JSON.parse(JSON.stringify(PARTICLESYSTEM));
        for (const key in particleSystem) {
            const value = particleSystem[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_materials') {
                source._materials = [];
                for (let i = 0; i < value.length; ++i) {
                    let material = value[i];
                    if (material) {
                        material = {
                            __uuid__: await ImporterBase.getUuid(material.__uuid__),
                        };
                        source._materials.push(material);
                    }
                }
            }
            else if (key === '_velocityScale' || key === '_lengthScale' || key === '_mesh' || key === '_renderMode') {
                // 不做处理
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const particleSystem = json2D[index];
        const source = await ParticleSystem.migrate(particleSystem);
        const renderer = ParticleSystem.createRenderer();
        renderer._velocityScale = particleSystem._velocityScale;
        renderer._lengthScale = particleSystem._lengthScale;
        renderer._renderMode = particleSystem._renderMode;
        if (particleSystem._mesh) {
            renderer._mesh = {
                __uuid__: await ImporterBase.getUuid(particleSystem._mesh.__uuid__),
            };
        }
        json3D.push(renderer);
        source.renderer.__id__ = json3D.length - 1;
        const gr = GradientRange.create();
        json3D.push(gr);
        let cr = CurveRange.create();
        json3D.push(cr);
        source.startSizeX = json3D.length - 1;
        cr = CurveRange.create();
        json3D.push(cr);
        source.startSizeY = json3D.length - 1;
        cr = CurveRange.create();
        json3D.push(cr);
        source.startSizeZ = json3D.length - 1;
        cr = CurveRange.create();
        json3D.push(cr);
        source.startRotationX = json3D.length - 1;
        cr = CurveRange.create();
        json3D.push(cr);
        source.startRotationY = json3D.length - 1;
        cr = CurveRange.create();
        json3D.push(cr);
        source.startRotationZ = json3D.length - 1;

        json3D.splice(index, 1, source);
        return source;
    }
}
