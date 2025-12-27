'use strict';

import { init2DChunks } from '../common/utlis';
import { initDiff } from "../common/diff";
import { ImageImporter } from './image';
import { BitmapImporter } from "./fnt";
import { TextImporter } from "./text";
import { AudioImporter } from "./audio";
import { PlistImporter } from "./plist";
import { JSONImporter } from "./json";
import { TmxImporter } from "./tmx";
import { MaterialImporter } from "./mtl";
import { FbxImporter } from "./fbx";
import { TTFFontImporter } from "./ttf";
import { AutoAtlasImporter } from "./pac";
import { AnimImporter } from "./anim";
import { FireImporter } from "./fire";
import { PrefabImporter } from './prefab';
import { JSImporter } from "./js";
import { TSImporter } from "./ts";
import { TsxImporter } from "./tsx";
import { BinImporter } from "./bin";
import { DbbinImporter } from "./dbbin";
import { EffectImporter } from "./effect";
import { GltfImporter } from "./gltf";
import { LabelAtlasImporter } from "./label-atlas";
import { AtlasImporter } from "./atlas";
import { SacImporter } from "./sac";
import { PhysicsMaterialImporter } from "./pmtl";
import { SkelImporter } from "./skel";
import { SkeletonImporter } from "./skeleton";
import { VideoImporter } from "./video";
import { ImporterBase } from "../common/base";
import { extname } from "path";

// 存储需要转换的列表
const keys: string[] = [];
export const converterMap: Map<string, ImporterBase> = new Map<string, ImporterBase>();

function register(Importer: any, extnames: string[]) {
    extnames.forEach(extname => {
        if (!keys.includes(extname)) {
            keys.push(extname);
        }
        converterMap.set(extname, new Importer());
    });
}

function initConvert() {
    keys.length = 0;
    converterMap.clear();
}

/**
 * 排序
 * @param {object} tree
 */
export function bubbleSort(tree: any) {
    let i, j, stop;
    const len = tree.length;
    for (i = 0; i < len; i++) {
        for (j = 0, stop = len - i; j < stop - 1; j++) {
            const a = tree[j], b = tree[j + 1];
            const aIndex = keys.indexOf(extname(a.detail.value));
            const bIndex = keys.indexOf(extname(b.detail.value));
            if (aIndex > bIndex) {
                const temp = tree[j];
                tree[j] = tree[j + 1];
                tree[j + 1] = temp;
            }
        }
    }
    return tree;
}

export function getConverter(exatname: string) {
    return converterMap.get(exatname);
}

export function registerConverter() {
    initConvert();
    initDiff();
    init2DChunks();

    register(ImageImporter, ['.png', '.jpg', '.jpeg', '.webp']);// 完成
    register(TextImporter, ['.pem', '.txt', '.html', '.htm', '.xml', '.css', '.less', '.scss', '.styl', '.stylus', '.yaml', '.ini', '.csv', '.proto', '.md', '.markdown']);// 完成
    register(AudioImporter, ['.mp3', '.wav', '.ogg', '.aac', '.pcm', '.m4a']);// 完成
    register(VideoImporter, ['.mp4']);// 完成
    register(TTFFontImporter, ['.ttf']);// 完成
    register(BitmapImporter, ['.fnt']);// 完成
    register(BinImporter, ['.bin']);// 完成
    register(DbbinImporter, ['.dbbin']);// 完成
    register(SacImporter, ['.sac']);// 完成
    register(JSONImporter, ['.json']);// 完成
    register(AtlasImporter, ['.atlas']);// 完成
    register(PhysicsMaterialImporter, ['.pmtl']);
    register(GltfImporter, ['.gltf']);// 完成
    register(SkelImporter, ['.skel']);
    register(SkeletonImporter, ['.skeleton']);
    register(TsxImporter, ['.tsx']);// 完成
    register(TmxImporter, ['.tmx']);// 完成
    register(FbxImporter, ['.fbx', '.FBX']);// 完成
    register(PlistImporter, ['.plist']);// 完成
    register(AutoAtlasImporter, ['.pac']);// 完成
    register(LabelAtlasImporter, ['.labelatlas']);// 完成
    register(EffectImporter, ['.effect']);
    register(MaterialImporter, ['.mtl']);
    register(AnimImporter, ['.anim']);
    register(PrefabImporter, ['.prefab']);
    register(FireImporter, ['.fire']);
    // 代码最后导入
    register(JSImporter, ['.js']);// 完成
    register(TSImporter, ['.ts']);// 完成
}
