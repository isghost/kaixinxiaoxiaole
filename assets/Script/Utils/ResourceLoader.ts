import { Asset, resources, SpriteFrame, ImageAsset, Texture2D } from 'cc';

export class ResourceLoader {
  static load<T extends Asset>(path: string, type: new (...args: any[]) => T): Promise<T | null> {
    return new Promise((resolve) => {
      resources.load(path, type as any, (err, asset) => {
        if (err || !asset) {
          console.warn(`[ResourceLoader] Failed to load: ${path}`, err);
          resolve(null);
          return;
        }
        resolve(asset as T);
      });
    });
  }

    static async loadSpriteFrame(path: string): Promise<SpriteFrame> {
        path = path + "/spriteFrame";
        return new Promise((resolve, reject) => {
            resources.load(path, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(`SpriteFrame not found: ${path}`);
                    reject(err);
                } else {
                    resolve(spriteFrame);
                }
            });
        });
    }
}
