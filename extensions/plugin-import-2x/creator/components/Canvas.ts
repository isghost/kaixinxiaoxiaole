'use strict';
import { Node } from "./Node";
import { UITransform } from "./UITransform";
import { Widget } from "./Widget";
import {
    hasComponent,
    setColor,
    hasUIRenderComponent,
    getComponentByType,
    getDesignResolution
} from "../common/utlis";
import { Camera } from "./Camera";

export const CANVAS = {
    "__type__": "cc.Canvas",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "_cameraComponent": null,
    "_alignCanvasWithScreen": true,
    "_id": "e6QojeC9FOBZjtx9CZWAUA"
};

const NAME = 'RenderRoot2D';

export const RENDER2D = {
    "__type__": `cc.${NAME}`,
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
};

export class Canvas {

    static async checkDesignResolution (json: any, sceneName: any) {
        const canvasNodeIDs = json.map((item: any) => {
            if (item.__type__ === 'cc.Canvas') {
                return item.node.__id__;
            }
            return null
        }).filter(Boolean);

        for (let canvasNodeID of canvasNodeIDs) {
            const canvasName = json[canvasNodeID] && json[canvasNodeID]._name;
            const component = getComponentByType(canvasNodeID, 'cc.UITransform', json);
            if (component) {
                const { width, height } = await getDesignResolution();
                if (component._contentSize.width !== width || component._contentSize.height !== height) {
                    console.warn(Editor.I18n.t('plugin-import-2x.canvas_tips', { scene: sceneName +'.scene', name: canvasName }));
                }
            }
        }
    }

    static getCameraIDByCanvasChildren(canvas: any, json3D: any) {
        const node = json3D[canvas.node.__id__];
        for (let child of node._children) {
            const item = json3D[child.__id__];
            if (item._name === 'Main Camera') {
                for (let childComponent of item._components) {
                    const component = json3D[childComponent.__id__];
                    if (component.__type__ === 'cc.Camera') {
                        return childComponent;
                    }
                }
            }
        }
        return null;
    }

    static async updateCameraComponent(json3D: any, json2D: any) {
        for (let i = 0; i < json3D.length; ++i) {
            const target = json3D[i];
            if (target.__type__ === 'cc.Canvas') {
                const item = Canvas.getCameraIDByCanvasChildren(target, json3D);
                if (item) {
                    target._cameraComponent = item;
                    const camera = json2D[item.__id__];
                    target._alignCanvasWithScreen = camera._alignWithScreen;
                }
                else {
                    Camera.addToScene(target, json3D);
                }
            }
        }
    }

    static async insert(json3D: any) {
        // 把放在 Canvas 外的 ui 组件都归位新的 Canvas 中
        const scene = json3D[1];
        const children = scene._children.slice();
        let node;
        let renderNodeID;
        for (const child of children) {
            const item = json3D[child.__id__];
            if (!hasComponent(item, json3D, 'cc.Canvas') && hasUIRenderComponent(item, json3D)) {
                const width = await Editor.Profile.getProject('project', 'general.designResolution.width');
                const height = await Editor.Profile.getProject('project', 'general.designResolution.height');
                if (!node) {
                    node = Node.create(NAME, 1);
                    json3D.push(node);
                    renderNodeID = json3D.length - 1;
                    scene._children.push({
                        __id__: renderNodeID,
                    });
                    // add Render2D component
                    const render2D = Canvas.create(renderNodeID, NAME, true);
                    json3D.push(render2D);
                    const render2DID = json3D.length - 1;
                    Node.addComponents(node, render2DID);

                    // add uitransform component
                    const uiTransform = UITransform.create(renderNodeID);
                    uiTransform._contentSize.width = width;
                    uiTransform._contentSize.height = height;
                    uiTransform._anchorPoint.x = 0;
                    uiTransform._anchorPoint.y = 0;
                    json3D.push(uiTransform);
                    Node.addComponents(node, json3D.length - 1);

                    // add widget component
                    const widget = Widget.create(renderNodeID);
                    widget._alignFlags = 45;
                    json3D.push(widget);
                    Node.addComponents(node, json3D.length - 1);
                }
                item._parent = {
                    __id__: renderNodeID,
                };
                Node.addChildren(node, child.__id__);
                const index = scene._children.indexOf(child);
                scene._children.splice(index, 1);
            }
        }
    }

    static create(nodeID?: number, name?: string, isRender2D?: boolean) {
        let component;
        if (isRender2D) {
            component = JSON.parse(JSON.stringify(RENDER2D));
        }
        else {
            component = JSON.parse(JSON.stringify(CANVAS));
        }
        if (name) {
            component._name = name;
        }
        if (nodeID) {
            component.node = {
                __id__: nodeID,
            };
        }
        return component;
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(CANVAS));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'node') {
                source.node = value;
                setColor(source, value.__id__, json2D);
            }
            else if (key === '_name' || key === '_id' || key === '_objFlags' || key === '_enabled') {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Canvas.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
