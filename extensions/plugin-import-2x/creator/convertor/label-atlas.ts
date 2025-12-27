'use strict';
import { ImporterBase } from '../common/base';

export class LabelAtlasImporter extends ImporterBase {
    type: string = 'label-atlas';
    async import(): Promise<boolean> {
        if (!this._2dMeta) {
            return true;
        }
        this._3dMeta.ver = '1.0.0';
        this._3dMeta.importer = 'label-atlas';
        const userData = this._3dMeta.userData;
        userData.itemWidth = this._2dMeta.itemWidth;
        userData.itemHeight = this._2dMeta.itemHeight;
        userData.startChar = this._2dMeta.startChar;
        userData.spriteFrameUuid = `${this._2dMeta.rawTextureUuid}@${ImporterBase.getNameByID('spriteFrame')}`;
        userData.fontSize = this._2dMeta.fontSize;
        return true;
    }
}
