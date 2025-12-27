'use strict';
import { ImporterBase } from '../common/base';
import { MigrateManager } from "../components/MigrateManager";
import { TrailModule } from "../components/TrailModule";

function getOptimizationPolicy(value: string) {
    switch (value) {
        case 'AUTO':
            return 0;
        case 'SINGLE_INSTANCE':
            return 1;
        case 'MULTI_INSTANCE':
            return 2;
    }
}

export class PrefabImporter extends ImporterBase {
    type: string = 'prefab';
    async import(): Promise<boolean> {
        this._3dMeta.ver = '1.1.26';
        this._3dMeta.importer = "prefab";
        const json2D = this.readJSONSync();
        const json3D = new Array(json2D.length);
        for (let i = 0; i < json2D.length; ++i) {
            const obj = await MigrateManager.migrate(i, json2D, json3D);
            if (obj.__type__ === 'cc.Prefab') {
                obj.optimizationPolicy = getOptimizationPolicy(this._2dMeta.optimizationPolicy);
                obj.asyncLoadAssets = this._2dMeta.asyncLoadAssets;
            }
        }
        TrailModule.setParticleSystem(json3D);
        this.ensureDefaultSprite2DFor3D(json3D);
        this._2dTo3dSource = json3D;
        return true;
    }
}
