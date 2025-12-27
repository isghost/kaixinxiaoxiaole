'use strict';
import { ImporterBase } from '../common/base';
import { Material } from "../components/Material";

export class MaterialImporter extends ImporterBase {
    type: string = 'base';
    async import(): Promise<boolean> {
        this._3dMeta.ver = '1.0.9';
        this._3dMeta.importer = 'material';
        this._2dTo3dSource = await Material.migrate(this.readJSONSync());
        return true;
    }
}
