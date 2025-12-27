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
exports.LabelAtlasImporter = void 0;
const base_1 = require("../common/base");
class LabelAtlasImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'label-atlas';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._2dMeta) {
                return true;
            }
            this._3dMeta.ver = '1.0.0';
            this._3dMeta.importer = 'label-atlas';
            const userData = this._3dMeta.userData;
            userData.itemWidth = this._2dMeta.itemWidth;
            userData.itemHeight = this._2dMeta.itemHeight;
            userData.startChar = this._2dMeta.startChar;
            userData.spriteFrameUuid = `${this._2dMeta.rawTextureUuid}@${base_1.ImporterBase.getNameByID('spriteFrame')}`;
            userData.fontSize = this._2dMeta.fontSize;
            return true;
        });
    }
}
exports.LabelAtlasImporter = LabelAtlasImporter;
