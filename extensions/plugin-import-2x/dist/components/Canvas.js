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
exports.Canvas = exports.RENDER2D = exports.CANVAS = void 0;
const Node_1 = require("./Node");
const UITransform_1 = require("./UITransform");
const Widget_1 = require("./Widget");
const utlis_1 = require("../common/utlis");
const Camera_1 = require("./Camera");
exports.CANVAS = {
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
exports.RENDER2D = {
    "__type__": `cc.${NAME}`,
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
};
class Canvas {
    static checkDesignResolution(json, sceneName) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvasNodeIDs = json.map((item) => {
                if (item.__type__ === 'cc.Canvas') {
                    return item.node.__id__;
                }
                return null;
            }).filter(Boolean);
            for (let canvasNodeID of canvasNodeIDs) {
                const canvasName = json[canvasNodeID] && json[canvasNodeID]._name;
                const component = (0, utlis_1.getComponentByType)(canvasNodeID, 'cc.UITransform', json);
                if (component) {
                    const { width, height } = yield (0, utlis_1.getDesignResolution)();
                    if (component._contentSize.width !== width || component._contentSize.height !== height) {
                        console.warn(Editor.I18n.t('plugin-import-2x.canvas_tips', { scene: sceneName + '.scene', name: canvasName }));
                    }
                }
            }
        });
    }
    static getCameraIDByCanvasChildren(canvas, json3D) {
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
    static updateCameraComponent(json3D, json2D) {
        return __awaiter(this, void 0, void 0, function* () {
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
                        Camera_1.Camera.addToScene(target, json3D);
                    }
                }
            }
        });
    }
    static insert(json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            // 把放在 Canvas 外的 ui 组件都归位新的 Canvas 中
            const scene = json3D[1];
            const children = scene._children.slice();
            let node;
            let renderNodeID;
            for (const child of children) {
                const item = json3D[child.__id__];
                if (!(0, utlis_1.hasComponent)(item, json3D, 'cc.Canvas') && (0, utlis_1.hasUIRenderComponent)(item, json3D)) {
                    const width = yield Editor.Profile.getProject('project', 'general.designResolution.width');
                    const height = yield Editor.Profile.getProject('project', 'general.designResolution.height');
                    if (!node) {
                        node = Node_1.Node.create(NAME, 1);
                        json3D.push(node);
                        renderNodeID = json3D.length - 1;
                        scene._children.push({
                            __id__: renderNodeID,
                        });
                        // add Render2D component
                        const render2D = Canvas.create(renderNodeID, NAME, true);
                        json3D.push(render2D);
                        const render2DID = json3D.length - 1;
                        Node_1.Node.addComponents(node, render2DID);
                        // add uitransform component
                        const uiTransform = UITransform_1.UITransform.create(renderNodeID);
                        uiTransform._contentSize.width = width;
                        uiTransform._contentSize.height = height;
                        uiTransform._anchorPoint.x = 0;
                        uiTransform._anchorPoint.y = 0;
                        json3D.push(uiTransform);
                        Node_1.Node.addComponents(node, json3D.length - 1);
                        // add widget component
                        const widget = Widget_1.Widget.create(renderNodeID);
                        widget._alignFlags = 45;
                        json3D.push(widget);
                        Node_1.Node.addComponents(node, json3D.length - 1);
                    }
                    item._parent = {
                        __id__: renderNodeID,
                    };
                    Node_1.Node.addChildren(node, child.__id__);
                    const index = scene._children.indexOf(child);
                    scene._children.splice(index, 1);
                }
            }
        });
    }
    static create(nodeID, name, isRender2D) {
        let component;
        if (isRender2D) {
            component = JSON.parse(JSON.stringify(exports.RENDER2D));
        }
        else {
            component = JSON.parse(JSON.stringify(exports.CANVAS));
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
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.CANVAS));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
                }
                else if (key === '_name' || key === '_id' || key === '_objFlags' || key === '_enabled') {
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Canvas.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Canvas = Canvas;
