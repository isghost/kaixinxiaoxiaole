'use strict';
import { ImporterBase } from '../common/base';
import { Canvas } from "../components/Canvas";
import { MigrateManager } from "../components/MigrateManager";
import { TrailModule } from "../components/TrailModule";
import { Camera } from "../components/Camera";

export class FireImporter extends ImporterBase {
    type: string = 'fire';
    async import(): Promise<boolean> {
        this._3dMeta.ver = '1.1.26';
        this._3dMeta.importer = "scene";
        const json2D = this.readJSONSync();
        const json3D = new Array(json2D.length);
        for (let i = 0; i < json2D.length; ++i) {
            await MigrateManager.migrate(i, json2D, json3D);
        }
        // 插入 Canvas
        await Canvas.updateCameraComponent(json3D, json2D);
        await Canvas.insert(json3D);
        await Canvas.checkDesignResolution(json3D, this.pathInfo?.name);
        TrailModule.setParticleSystem(json3D);
        this.ensureDefaultSprite2DFor3D(json3D);
        this._2dTo3dSource = json3D;
        return true;
    }
}
