'use strict';
export const TRAILMODULE = {
    "__type__": "cc.TrailModule",
    "_enable": false,
    "mode": 0,
    "lifeTime": {
        "__id__": 1,
    },
    "_minParticleDistance": 0.1,
    "existWithParticles": true,
    "textureMode": 0,
    "widthFromParticle": true,
    "widthRatio": {
        "__id__": 2,
    },
    "colorFromParticle": false,
    "colorOverTrail": {
        "__id__": 3,
    },
    "colorOvertime": {
        "__id__": 4,
    },
    "_space": 0,
    "_particleSystem": null,
};

export class TrailModule {

    static create() {
        return JSON.parse(JSON.stringify(TRAILMODULE));
    }

    static setParticleSystem(json3D: any[]) {
        json3D.forEach((obj: any, index: number) => {
            if (obj.__type__ === 'cc.ParticleSystem') {
                const __id__ = obj._trailModule && obj._trailModule.__id__;
                const trailModule = __id__ && json3D[__id__];
                if (trailModule) {
                    trailModule._particleSystem = {
                        __id__: index,
                    };
                }
            }
        });
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TRAILMODULE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await TrailModule.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
