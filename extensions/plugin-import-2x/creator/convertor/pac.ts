'use strict';
import { ImporterBase } from '../common/base';

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

export class AutoAtlasImporter extends ImporterBase {
    type: string = 'pac';
    async import(): Promise<boolean> {
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
        const compressSettings = await this.migratePlatformSettings(this._2dMeta.platformSettings);
        if (compressSettings) {
            this._3dMeta.userData.compressSettings = compressSettings;
        }
        return true;
    }
}
