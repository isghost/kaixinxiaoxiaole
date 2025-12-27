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
exports.AutoAtlasImporter = void 0;
const base_1 = require("../common/base");
// 2d 自动图集已有的数据
const KEYS = [
    'maxWidth',
    'maxHeight',
    'padding',
    'allowRotation',
    'forceSquared',
    'powerOfTwo',
    'algorithm',
    'format',
    'quality',
    'contourBleed',
    'paddingBleed',
    'filterUnused',
];
class AutoAtlasImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'pac';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._2dMeta) {
                return true;
            }
            this._3dMeta.ver = '1.0.5';
            this._3dMeta.importer = 'auto-atlas';
            for (const key in this._2dMeta) {
                if (KEYS.includes(key)) {
                    this._3dMeta.userData[key] = this._2dMeta[key];
                }
            }
            const compressSettings = yield this.migratePlatformSettings(this._2dMeta.platformSettings);
            if (compressSettings) {
                this._3dMeta.userData.compressSettings = compressSettings;
            }
            return true;
        });
    }
}
exports.AutoAtlasImporter = AutoAtlasImporter;
