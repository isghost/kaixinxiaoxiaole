System.register(["__unresolved_0", "cc", "cc/env", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, assert, CCBoolean, CCFloat, CCInteger, gfx, Material, rendering, Vec3, Vec4, EDITOR, BuiltinPipelineSettings, BuiltinPipelinePassBuilder, getPingPongRenderTarget, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, disallowMultiple, executeInEditMode, menu, property, requireComponent, type, Color, LoadOp, StoreOp, BuiltinDepthOfFieldPass;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBuiltinPipelineSettings(extras) {
    _reporterNs.report("BuiltinPipelineSettings", "./builtin-pipeline-settings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBuiltinPipelinePassBuilder(extras) {
    _reporterNs.report("BuiltinPipelinePassBuilder", "./builtin-pipeline-pass", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraConfigs(extras) {
    _reporterNs.report("CameraConfigs", "./builtin-pipeline", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetPingPongRenderTarget(extras) {
    _reporterNs.report("getPingPongRenderTarget", "./builtin-pipeline", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPipelineConfigs(extras) {
    _reporterNs.report("PipelineConfigs", "./builtin-pipeline", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPipelineContext(extras) {
    _reporterNs.report("PipelineContext", "./builtin-pipeline", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      assert = _cc.assert;
      CCBoolean = _cc.CCBoolean;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      gfx = _cc.gfx;
      Material = _cc.Material;
      rendering = _cc.rendering;
      Vec3 = _cc.Vec3;
      Vec4 = _cc.Vec4;
    }, function (_ccEnv) {
      EDITOR = _ccEnv.EDITOR;
    }, function (_unresolved_2) {
      BuiltinPipelineSettings = _unresolved_2.BuiltinPipelineSettings;
    }, function (_unresolved_3) {
      BuiltinPipelinePassBuilder = _unresolved_3.BuiltinPipelinePassBuilder;
    }, function (_unresolved_4) {
      getPingPongRenderTarget = _unresolved_4.getPingPongRenderTarget;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "11f31MOwIxHu6IJcdEUWU5t", "builtin-dof-pass", undefined);
      /*
       Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.
      
       https://www.cocos.com/
      
       Permission is hereby granted, free of charge, to any person obtaining a copy
       of this software and associated documentation files (the "Software"), to deal
       in the Software without restriction, including without limitation the rights to
       use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
       of the Software, and to permit persons to whom the Software is furnished to do so,
       subject to the following conditions:
      
       The above copyright notice and this permission notice shall be included in
       all copies or substantial portions of the Software.
      
       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
       THE SOFTWARE.
      */


      __checkObsolete__(['_decorator', 'assert', 'CCBoolean', 'CCFloat', 'CCInteger', 'gfx', 'Material', 'renderer', 'rendering', 'Vec3', 'Vec4']);

      ({
        ccclass,
        disallowMultiple,
        executeInEditMode,
        menu,
        property,
        requireComponent,
        type
      } = _decorator);
      ({
        Color,
        LoadOp,
        StoreOp
      } = gfx);

      _export("BuiltinDepthOfFieldPass", BuiltinDepthOfFieldPass = (_dec = ccclass('BuiltinDepthOfFieldPass'), _dec2 = menu('Rendering/BuiltinDepthOfFieldPass'), _dec3 = requireComponent(_crd && BuiltinPipelineSettings === void 0 ? (_reportPossibleCrUseOfBuiltinPipelineSettings({
        error: Error()
      }), BuiltinPipelineSettings) : BuiltinPipelineSettings), _dec4 = property({
        group: {
          id: 'BuiltinPass',
          name: 'Pass Settings',
          style: 'section'
        },
        type: CCInteger
      }), _dec5 = property({
        group: {
          id: 'BuiltinPass',
          name: 'Pass Settings',
          style: 'section'
        },
        type: CCInteger
      }), _dec6 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: CCBoolean,
        visible: true
      }), _dec7 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: Material,
        visible: true
      }), _dec8 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: CCFloat,
        min: 0,
        visible: true
      }), _dec9 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: CCFloat,
        min: 0,
        visible: true
      }), _dec10 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: CCFloat,
        range: [0.0, 2, 0.01],
        slide: true,
        visible: true
      }), _dec11 = type(CCFloat), _dec12 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: CCFloat,
        range: [0.01, 10, 0.01],
        slide: true,
        visible: true
      }), _dec13 = type(Vec3), _dec14 = property({
        group: {
          id: 'DepthOfField',
          name: 'DepthOfField (PostProcessing)',
          style: 'section'
        },
        type: Vec3,
        visible: true
      }), _dec(_class = _dec2(_class = _dec3(_class = disallowMultiple(_class = executeInEditMode(_class = (_class2 = class BuiltinDepthOfFieldPass extends (_crd && BuiltinPipelinePassBuilder === void 0 ? (_reportPossibleCrUseOfBuiltinPipelinePassBuilder({
        error: Error()
      }), BuiltinPipelinePassBuilder) : BuiltinPipelinePassBuilder) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "configOrder", _descriptor, this);

          _initializerDefineProperty(this, "renderOrder", _descriptor2, this);

          _initializerDefineProperty(this, "_enableDof", _descriptor3, this);

          _initializerDefineProperty(this, "_material", _descriptor4, this);

          _initializerDefineProperty(this, "_minRange", _descriptor5, this);

          _initializerDefineProperty(this, "_maxRange", _descriptor6, this);

          _initializerDefineProperty(this, "_blurRadius", _descriptor7, this);

          _initializerDefineProperty(this, "_intensity", _descriptor8, this);

          _initializerDefineProperty(this, "_focusPos", _descriptor9, this);

          // Runtime members
          this._clearColorTransparentBlack = new Color(0, 0, 0, 0);
          this._cocParams = new Vec4(0, 0, 0, 0);
          this._focusPosVec4 = new Vec4(0, 0, 0, 1);
          this._cocTexSize = new Vec4(0, 0, 0, 0);
        }

        // DepthOfField
        set dofEnable(value) {
          this._enableDof = value;

          if (EDITOR) {
            this._parent._tryEnableEditorPreview();
          }
        }

        get dofEnable() {
          return this._enableDof;
        }

        set dofMaterial(value) {
          if (this._material === value) {
            return;
          }

          this._material = value;

          if (EDITOR) {
            this._parent._tryEnableEditorPreview();
          }
        }

        get dofMaterial() {
          return this._material;
        }

        set dofMinRange(value) {
          this._minRange = value;
        }

        get dofMinRange() {
          return this._minRange;
        }

        set dofMaxRange(value) {
          this._maxRange = value;
        }

        get dofMaxRange() {
          return this._maxRange;
        }

        set dofIntensity(value) {
          this._intensity = value;
        }

        get dofIntensity() {
          return this._intensity;
        }

        set dofBlurRadius(value) {
          this._blurRadius = value;
        }

        get dofBlurRadius() {
          return this._blurRadius;
        }

        set dofFocusPos(value) {
          this._focusPos = value;
        }

        get dofFocusPos() {
          return this._focusPos;
        } // PipelinePassBuilder


        getConfigOrder() {
          return this.configOrder;
        }

        getRenderOrder() {
          return this.renderOrder;
        }

        configCamera(camera, pplConfigs, cameraConfigs) {
          cameraConfigs.enableDof = pplConfigs.supportDepthSample && this._enableDof && !!this._material;

          if (cameraConfigs.enableDof) {
            // Output scene depth, this is allowed but has performance impact
            cameraConfigs.enableStoreSceneDepth = true;
            ++cameraConfigs.remainingPasses;
          }
        }

        windowResize(ppl, pplConfigs, cameraConfigs, window) {
          var id = window.renderWindowId;

          if (cameraConfigs.enableDof) {
            ppl.addRenderTarget("DofRadiance" + id, cameraConfigs.radianceFormat, cameraConfigs.width, cameraConfigs.height);
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          if (!cameraConfigs.enableDof) {
            return prevRenderPass;
          }

          --cameraConfigs.remainingPasses;
          assert(!!this._material);

          if (cameraConfigs.remainingPasses === 0) {
            return this._addDepthOfFieldPasses(ppl, pplConfigs, cameraConfigs, this._material, camera, cameraConfigs.width, cameraConfigs.height, context.colorName, context.depthStencilName, cameraConfigs.colorName);
          } else {
            var prefix = cameraConfigs.enableShadingScale ? "ScaledRadiance" : "Radiance";
            var outputRadianceName = (_crd && getPingPongRenderTarget === void 0 ? (_reportPossibleCrUseOfgetPingPongRenderTarget({
              error: Error()
            }), getPingPongRenderTarget) : getPingPongRenderTarget)(context.colorName, prefix, cameraConfigs.renderWindowId);
            var inputRadianceName = context.colorName;
            context.colorName = outputRadianceName;
            return this._addDepthOfFieldPasses(ppl, pplConfigs, cameraConfigs, this._material, camera, cameraConfigs.width, cameraConfigs.height, inputRadianceName, context.depthStencilName, outputRadianceName);
          }
        }

        _addDepthOfFieldPasses(ppl, pplConfigs, cameraConfigs, dofMaterial, camera, width, height, inputRadiance, inputDepthStencil, outputRadianceName) {
          this._cocParams.x = this._minRange;
          this._cocParams.y = this._maxRange;
          this._cocParams.z = this._blurRadius;
          this._cocParams.w = this._intensity;
          this._focusPosVec4.x = this._focusPos.x;
          this._focusPosVec4.y = this._focusPos.y;
          this._focusPosVec4.z = this._focusPos.z;
          this._cocTexSize.x = 1.0 / width;
          this._cocTexSize.y = 1.0 / height;
          this._cocTexSize.z = width;
          this._cocTexSize.w = height;
          var id = cameraConfigs.renderWindowId;
          var tempRadiance = "DofRadiance" + id; // Blur Pass

          var blurPass = ppl.addRenderPass(width, height, 'cc-dof-blur');
          blurPass.addRenderTarget(tempRadiance, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
          blurPass.addTexture(inputRadiance, 'screenTex');
          blurPass.setVec4('g_platform', pplConfigs.platform);
          blurPass.setVec4('blurParams', this._cocParams);
          blurPass.setVec4('mainTexTexelSize', this._cocTexSize);
          blurPass.addQueue(rendering.QueueHint.OPAQUE).addCameraQuad(camera, dofMaterial, 0); // addCameraQuad will set camera related UBOs
          // coc pass

          var cocPass = ppl.addRenderPass(width, height, 'cc-dof-coc');
          cocPass.addRenderTarget(outputRadianceName, LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
          cocPass.addTexture(tempRadiance, 'colorTex');
          cocPass.addTexture(inputDepthStencil, "DepthTex");
          cocPass.addTexture(inputRadiance, "screenTex");
          cocPass.setVec4('g_platform', pplConfigs.platform);
          cocPass.setMat4('proj', camera.matProj);
          cocPass.setMat4('invProj', camera.matProjInv);
          cocPass.setMat4('viewMatInv', camera.node.worldMatrix);
          cocPass.setVec4('cocParams', this._cocParams);
          cocPass.setVec4('focus', this._focusPosVec4);
          cocPass.addQueue(rendering.QueueHint.OPAQUE).addCameraQuad(camera, dofMaterial, 1);
          return cocPass;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "configOrder", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "renderOrder", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 150;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_enableDof", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_material", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_minRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_maxRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_blurRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_intensity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_focusPos", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 0, 0);
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "dofEnable", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "dofEnable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofMaterial", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "dofMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofMinRange", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "dofMinRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofMaxRange", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "dofMaxRange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofIntensity", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "dofIntensity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofBlurRadius", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "dofBlurRadius"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dofFocusPos", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "dofFocusPos"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d208b01558c13077e4a9c9f1302dfbf2b2122e40.js.map