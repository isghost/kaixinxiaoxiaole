'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrefabImporter = void 0;
const base_1 = require("../common/base");
const MigrateManager_1 = require("../components/MigrateManager");
const TrailModule_1 = require("../components/TrailModule");
function getOptimizationPolicy(value) {
    switch (value) {
        case 'AUTO':
            return 0;
        case 'SINGLE_INSTANCE':
            return 1;
        case 'MULTI_INSTANCE':
            return 2;
    }
}
class PrefabImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'prefab';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            this._3dMeta.ver = '1.1.26';
            this._3dMeta.importer = "prefab";
            const json2D = this.readJSONSync();
            const json3D = new Array(json2D.length);
            for (let i = 0; i < json2D.length; ++i) {
                const obj = yield MigrateManager_1.MigrateManager.migrate(i, json2D, json3D);
                if (obj.__type__ === 'cc.Prefab') {
                    obj.optimizationPolicy = getOptimizationPolicy(this._2dMeta.optimizationPolicy);
                    obj.asyncLoadAssets = this._2dMeta.asyncLoadAssets;
                }
            }
            TrailModule_1.TrailModule.setParticleSystem(json3D);
            this.ensureDefaultSprite2DFor3D(json3D);
            this._2dTo3dSource = json3D;
            return true;
        });
    }
}
exports.PrefabImporter = PrefabImporter;
