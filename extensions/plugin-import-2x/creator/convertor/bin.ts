'use strict';
import { ImporterBase } from '../common/base';

export class BinImporter extends ImporterBase {
    type: string = 'base';
    async import(): Promise<boolean> {
        return true;
    }
}
