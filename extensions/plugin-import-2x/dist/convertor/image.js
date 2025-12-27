"use strict";
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
exports.ImageImporter = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
class ImageImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'image';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._2dMeta) {
                return true;
            }
            this._3dMeta.ver = '1.0.13';
            this._3dMeta.importer = 'image';
            // copy base asset and meta
            const userData = this._3dMeta.userData;
            if (this._2dMeta.type === 'sprite') {
                userData.type = 'sprite-frame';
                // texture
                const textureMeta = this.createNewMeta();
                textureMeta.importer = 'texture';
                const textureID = base_1.ImporterBase.getNameByID('texture');
                const filterMode = this._2dMeta['filterMode'];
                // @ts-ignore
                textureMeta.userData['minfilter'] = filterMode === 'point' ? 'nearest' : 'linear';
                // @ts-ignore
                textureMeta.userData['magfilter'] = filterMode === 'point' ? 'nearest' : 'linear';
                const wrapMode = this._2dMeta['wrapMode'];
                // @ts-ignore
                textureMeta.userData['wrapModeS'] = textureMeta.userData['wrapModeT'] = wrapMode === 'clamp' ? 'clamp-to-edge' : wrapMode;
                //
                const genMipmaps = this._2dMeta['genMipmaps'];
                let mipfilter = 'none';
                if (genMipmaps) {
                    mipfilter = (filterMode === 'bilinear' || filterMode === 'point') ? 'nearest' : 'linear';
                }
                // @ts-ignore
                textureMeta.userData['mipfilter'] = mipfilter;
                this._3dMeta.subMetas[textureID] = textureMeta;
                // sprite frame
                const spriteFrameMeta = this.createNewMeta();
                const _2dSubMeta = this._2dMeta.subMetas[this.pathInfo.name];
                for (const key in _2dSubMeta) {
                    if (key === 'ver' || key === 'uuid' ||
                        key === 'subMetas' || key === 'rawTextureUuid') {
                        continue;
                    }
                    else {
                        // @ts-ignore
                        spriteFrameMeta.userData[key] = _2dSubMeta[key];
                    }
                }
                spriteFrameMeta.importer = 'sprite-frame';
                // @ts-ignore
                spriteFrameMeta.userData.imageUuidOrDatabaseUri = `${this._3dMeta.uuid}@${textureID}`;
                //
                const spriteFrameID = base_1.ImporterBase.getNameByID('spriteFrame');
                this._3dMeta.subMetas[spriteFrameID] = spriteFrameMeta;
            }
            else {
                userData.type = 'raw';
            }
            // 是否开启缓存
            const compressSettings = yield this.migratePlatformSettings(this._2dMeta.platformSettings);
            if (compressSettings) {
                userData.compressSettings = compressSettings;
            }
            this._3dMeta.userData = userData;
            //
            if (this._2dMeta.type === 'sprite') {
                for (const key in this._2dMeta.subMetas) {
                    const subMeta = this._2dMeta.subMetas[key];
                    if (subMeta) {
                        utlis_1.importSubAssets.set(subMeta.uuid, {
                            baseUuid: this._2dMeta.uuid,
                            uuid: `${this._2dMeta.uuid}@${base_1.ImporterBase.getNameByID('spriteFrame')}`,
                        });
                    }
                }
            }
            else if (this._2dMeta.type === 'raw') {
                utlis_1.importSubAssets.set(this._2dMeta.uuid, {
                    baseUuid: this._2dMeta.uuid,
                    uuid: `${this._2dMeta.uuid}@${base_1.ImporterBase.getNameByID('texture')}`,
                });
            }
            return true;
        });
    }
}
exports.ImageImporter = ImageImporter;
