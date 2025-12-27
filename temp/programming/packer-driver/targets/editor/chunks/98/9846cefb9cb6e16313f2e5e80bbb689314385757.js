System.register(["__unresolved_0", "cc", "cc/env", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, assert, cclegacy, clamp, geometry, gfx, Layers, Material, pipeline, PipelineEventType, renderer, rendering, sys, Vec2, Vec3, Vec4, warn, DEBUG, EDITOR, makePipelineSettings, PipelineConfigs, CameraConfigs, ForwardLighting, BuiltinForwardPassBuilder, BuiltinBloomPassBuilder, BuiltinToneMappingPassBuilder, BuiltinFXAAPassBuilder, BuiltinFsrPassBuilder, BuiltinUiPassBuilder, _crd, AABB, Sphere, intersect, ClearFlagBit, Color, Format, FormatFeatureBit, LoadOp, StoreOp, TextureType, Viewport, scene, CameraUsage, CSMLevel, LightType, defaultSettings, sClearColorTransparentBlack, QueueHint, SceneFlags;

  function forwardNeedClearColor(camera) {
    return !!(camera.clearFlag & (ClearFlagBit.COLOR | ClearFlagBit.STENCIL << 1));
  }

  function getCsmMainLightViewport(light, w, h, level, vp, screenSpaceSignY) {
    if (light.shadowFixedArea || light.csmLevel === CSMLevel.LEVEL_1) {
      vp.left = 0;
      vp.top = 0;
      vp.width = Math.trunc(w);
      vp.height = Math.trunc(h);
    } else {
      vp.left = Math.trunc(level % 2 * 0.5 * w);

      if (screenSpaceSignY > 0) {
        vp.top = Math.trunc((1 - Math.floor(level / 2)) * 0.5 * h);
      } else {
        vp.top = Math.trunc(Math.floor(level / 2) * 0.5 * h);
      }

      vp.width = Math.trunc(0.5 * w);
      vp.height = Math.trunc(0.5 * h);
    }

    vp.left = Math.max(0, vp.left);
    vp.top = Math.max(0, vp.top);
    vp.width = Math.max(1, vp.width);
    vp.height = Math.max(1, vp.height);
  }

  function setupPipelineConfigs(ppl, configs) {
    const sampleFeature = FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;
    const device = ppl.device; // Platform

    configs.isWeb = !sys.isNative;
    configs.isWebGL1 = device.gfxAPI === gfx.API.WEBGL;
    configs.isWebGPU = device.gfxAPI === gfx.API.WEBGPU;
    configs.isMobile = sys.isMobile; // Rendering

    configs.isHDR = ppl.pipelineSceneData.isHDR; // Has tone mapping

    configs.useFloatOutput = ppl.getMacroBool('CC_USE_FLOAT_OUTPUT');
    configs.toneMappingType = ppl.pipelineSceneData.postSettings.toneMappingType; // Shadow

    const shadowInfo = ppl.pipelineSceneData.shadows;
    configs.shadowEnabled = shadowInfo.enabled;
    configs.shadowMapFormat = pipeline.supportsR32FloatTexture(ppl.device) ? Format.R32F : Format.RGBA8;
    configs.shadowMapSize.set(shadowInfo.size);
    configs.usePlanarShadow = shadowInfo.enabled && shadowInfo.type === renderer.scene.ShadowType.Planar; // Device

    configs.screenSpaceSignY = ppl.device.capabilities.screenSpaceSignY;
    configs.supportDepthSample = (ppl.device.getFormatFeatures(Format.DEPTH_STENCIL) & sampleFeature) === sampleFeature; // Constants

    const screenSpaceSignY = device.capabilities.screenSpaceSignY;
    configs.platform.x = configs.isMobile ? 1.0 : 0.0;
    configs.platform.w = screenSpaceSignY * 0.5 + 0.5 << 1 | device.capabilities.clipSpaceSignY * 0.5 + 0.5;
  }

  function sortPipelinePassBuildersByConfigOrder(passBuilders) {
    passBuilders.sort((a, b) => {
      return a.getConfigOrder() - b.getConfigOrder();
    });
  }

  function sortPipelinePassBuildersByRenderOrder(passBuilders) {
    passBuilders.sort((a, b) => {
      return a.getRenderOrder() - b.getRenderOrder();
    });
  }

  function addCopyToScreenPass(ppl, pplConfigs, cameraConfigs, input) {
    assert(!!cameraConfigs.copyAndTonemapMaterial);
    const pass = ppl.addRenderPass(cameraConfigs.nativeWidth, cameraConfigs.nativeHeight, 'cc-tone-mapping');
    pass.addRenderTarget(cameraConfigs.colorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
    pass.addTexture(input, 'inputTexture');
    pass.setVec4('g_platform', pplConfigs.platform);
    pass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(cameraConfigs.copyAndTonemapMaterial, 1);
    return pass;
  }

  function getPingPongRenderTarget(prevName, prefix, id) {
    if (prevName.startsWith(prefix)) {
      return `${prefix}${1 - Number(prevName.charAt(prefix.length))}_${id}`;
    } else {
      return `${prefix}0_${id}`;
    }
  }

  function _reportPossibleCrUseOfmakePipelineSettings(extras) {
    _reporterNs.report("makePipelineSettings", "./builtin-pipeline-types", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPipelineSettings(extras) {
    _reporterNs.report("PipelineSettings", "./builtin-pipeline-types", _context.meta, extras);
  }

  _export({
    PipelineConfigs: void 0,
    CameraConfigs: void 0,
    getPingPongRenderTarget: getPingPongRenderTarget,
    BuiltinForwardPassBuilder: void 0,
    BuiltinBloomPassBuilder: void 0,
    BuiltinToneMappingPassBuilder: void 0,
    BuiltinFXAAPassBuilder: void 0,
    BuiltinFsrPassBuilder: void 0,
    BuiltinUiPassBuilder: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      assert = _cc.assert;
      cclegacy = _cc.cclegacy;
      clamp = _cc.clamp;
      geometry = _cc.geometry;
      gfx = _cc.gfx;
      Layers = _cc.Layers;
      Material = _cc.Material;
      pipeline = _cc.pipeline;
      PipelineEventType = _cc.PipelineEventType;
      renderer = _cc.renderer;
      rendering = _cc.rendering;
      sys = _cc.sys;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      Vec4 = _cc.Vec4;
      warn = _cc.warn;
    }, function (_ccEnv) {
      DEBUG = _ccEnv.DEBUG;
      EDITOR = _ccEnv.EDITOR;
    }, function (_unresolved_2) {
      makePipelineSettings = _unresolved_2.makePipelineSettings;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ff9b0GZzgRM/obMbHGfCNbk", "builtin-pipeline", undefined);
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


      __checkObsolete__(['assert', 'cclegacy', 'clamp', 'geometry', 'gfx', 'Layers', 'Material', 'pipeline', 'PipelineEventProcessor', 'PipelineEventType', 'ReflectionProbeManager', 'renderer', 'rendering', 'sys', 'Vec2', 'Vec3', 'Vec4', 'warn']);

      ({
        AABB,
        Sphere,
        intersect
      } = geometry);
      ({
        ClearFlagBit,
        Color,
        Format,
        FormatFeatureBit,
        LoadOp,
        StoreOp,
        TextureType,
        Viewport
      } = gfx);
      ({
        scene
      } = renderer);
      ({
        CameraUsage,
        CSMLevel,
        LightType
      } = scene);

      _export("PipelineConfigs", PipelineConfigs = class PipelineConfigs {
        constructor() {
          this.isWeb = false;
          this.isWebGL1 = false;
          this.isWebGPU = false;
          this.isMobile = false;
          this.isHDR = false;
          this.useFloatOutput = false;
          this.toneMappingType = 0;
          // 0: ACES, 1: None
          this.shadowEnabled = false;
          this.shadowMapFormat = Format.R32F;
          this.shadowMapSize = new Vec2(1, 1);
          this.usePlanarShadow = false;
          this.screenSpaceSignY = 1;
          this.supportDepthSample = false;
          this.mobileMaxSpotLightShadowMaps = 1;
          this.platform = new Vec4(0, 0, 0, 0);
        }

      });

      defaultSettings = (_crd && makePipelineSettings === void 0 ? (_reportPossibleCrUseOfmakePipelineSettings({
        error: Error()
      }), makePipelineSettings) : makePipelineSettings)();

      _export("CameraConfigs", CameraConfigs = class CameraConfigs {
        constructor() {
          this.settings = defaultSettings;
          // Window
          this.isMainGameWindow = false;
          this.renderWindowId = 0;
          // Camera
          this.colorName = '';
          this.depthStencilName = '';
          // Pipeline
          this.enableFullPipeline = false;
          this.enableProfiler = false;
          this.remainingPasses = 0;
          // Shading Scale
          this.enableShadingScale = false;
          this.shadingScale = 1.0;
          this.nativeWidth = 1;
          this.nativeHeight = 1;
          this.width = 1;
          // Scaled width
          this.height = 1;
          // Scaled height
          // Radiance
          this.enableHDR = false;
          this.radianceFormat = gfx.Format.RGBA8;
          // Tone Mapping
          this.copyAndTonemapMaterial = null;
          // Depth

          /** @en mutable */
          this.enableStoreSceneDepth = false;
        }

      });

      sClearColorTransparentBlack = new Color(0, 0, 0, 0);
      ForwardLighting = class ForwardLighting {
        constructor() {
          // Active lights
          this.lights = [];
          // Active spot lights with shadows (Mutually exclusive with `lights`)
          this.shadowEnabledSpotLights = [];
          // Internal cached resources
          this._sphere = Sphere.create(0, 0, 0, 1);
          this._boundingBox = new AABB();
          this._rangedDirLightBoundingBox = new AABB(0.0, 0.0, 0.0, 0.5, 0.5, 0.5);
        }

        // ----------------------------------------------------------------
        // Interface
        // ----------------------------------------------------------------
        cullLights(scene, frustum, cameraPos) {
          // TODO(zhouzhenglong): Make light culling native
          this.lights.length = 0;
          this.shadowEnabledSpotLights.length = 0; // spot lights

          for (const light of scene.spotLights) {
            if (light.baked) {
              continue;
            }

            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);

            if (intersect.sphereFrustum(this._sphere, frustum)) {
              if (light.shadowEnabled) {
                this.shadowEnabledSpotLights.push(light);
              } else {
                this.lights.push(light);
              }
            }
          } // sphere lights


          for (const light of scene.sphereLights) {
            if (light.baked) {
              continue;
            }

            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);

            if (intersect.sphereFrustum(this._sphere, frustum)) {
              this.lights.push(light);
            }
          } // point lights


          for (const light of scene.pointLights) {
            if (light.baked) {
              continue;
            }

            Sphere.set(this._sphere, light.position.x, light.position.y, light.position.z, light.range);

            if (intersect.sphereFrustum(this._sphere, frustum)) {
              this.lights.push(light);
            }
          } // ranged dir lights


          for (const light of scene.rangedDirLights) {
            AABB.transform(this._boundingBox, this._rangedDirLightBoundingBox, light.node.getWorldMatrix());

            if (intersect.aabbFrustum(this._boundingBox, frustum)) {
              this.lights.push(light);
            }
          }

          if (cameraPos) {
            this.shadowEnabledSpotLights.sort((lhs, rhs) => Vec3.squaredDistance(cameraPos, lhs.position) - Vec3.squaredDistance(cameraPos, rhs.position));
          }
        }

        _addLightQueues(camera, pass) {
          for (const light of this.lights) {
            const queue = pass.addQueue(rendering.QueueHint.BLEND, 'forward-add');

            switch (light.type) {
              case LightType.SPHERE:
                queue.name = 'sphere-light';
                break;

              case LightType.SPOT:
                queue.name = 'spot-light';
                break;

              case LightType.POINT:
                queue.name = 'point-light';
                break;

              case LightType.RANGED_DIRECTIONAL:
                queue.name = 'ranged-directional-light';
                break;

              default:
                queue.name = 'unknown-light';
            }

            queue.addScene(camera, rendering.SceneFlags.BLEND, light);
          }
        }

        addSpotlightShadowPasses(ppl, camera, maxNumShadowMaps) {
          let i = 0;

          for (const light of this.shadowEnabledSpotLights) {
            const shadowMapSize = ppl.pipelineSceneData.shadows.size;
            const shadowPass = ppl.addRenderPass(shadowMapSize.x, shadowMapSize.y, 'default');
            shadowPass.name = `SpotLightShadowPass${i}`;
            shadowPass.addRenderTarget(`SpotShadowMap${i}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            shadowPass.addDepthStencil(`SpotShadowDepth${i}`, LoadOp.CLEAR, StoreOp.DISCARD);
            shadowPass.addQueue(rendering.QueueHint.NONE, 'shadow-caster').addScene(camera, rendering.SceneFlags.OPAQUE | rendering.SceneFlags.MASK | rendering.SceneFlags.SHADOW_CASTER).useLightFrustum(light);
            ++i;

            if (i >= maxNumShadowMaps) {
              break;
            }
          }
        }

        addLightQueues(pass, camera, maxNumShadowMaps) {
          this._addLightQueues(camera, pass);

          let i = 0;

          for (const light of this.shadowEnabledSpotLights) {
            // Add spot-light pass
            // Save last RenderPass to the `pass` variable
            // TODO(zhouzhenglong): Fix per queue addTexture
            pass.addTexture(`SpotShadowMap${i}`, 'cc_spotShadowMap');
            const queue = pass.addQueue(rendering.QueueHint.BLEND, 'forward-add');
            queue.addScene(camera, rendering.SceneFlags.BLEND, light);
            ++i;

            if (i >= maxNumShadowMaps) {
              break;
            }
          }
        } // Notice: ForwardLighting cannot handle a lot of lights.
        // If there are too many lights, the performance will be very poor.
        // If many lights are needed, please implement a forward+ or deferred rendering pipeline.


        addLightPasses(colorName, depthStencilName, depthStencilStoreOp, id, // window id
        width, height, camera, viewport, ppl, pass) {
          this._addLightQueues(camera, pass);

          let count = 0;
          const shadowMapSize = ppl.pipelineSceneData.shadows.size;

          for (const light of this.shadowEnabledSpotLights) {
            const shadowPass = ppl.addRenderPass(shadowMapSize.x, shadowMapSize.y, 'default');
            shadowPass.name = 'SpotlightShadowPass'; // Reuse csm shadow map

            shadowPass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
            shadowPass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
            shadowPass.addQueue(rendering.QueueHint.NONE, 'shadow-caster').addScene(camera, rendering.SceneFlags.OPAQUE | rendering.SceneFlags.MASK | rendering.SceneFlags.SHADOW_CASTER).useLightFrustum(light); // Add spot-light pass
            // Save last RenderPass to the `pass` variable

            ++count;
            const storeOp = count === this.shadowEnabledSpotLights.length ? depthStencilStoreOp : StoreOp.STORE;
            pass = ppl.addRenderPass(width, height, 'default');
            pass.name = 'SpotlightWithShadowMap';
            pass.setViewport(viewport);
            pass.addRenderTarget(colorName, LoadOp.LOAD);
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD, storeOp);
            pass.addTexture(`ShadowMap${id}`, 'cc_spotShadowMap');
            const queue = pass.addQueue(rendering.QueueHint.BLEND, 'forward-add');
            queue.addScene(camera, rendering.SceneFlags.BLEND, light);
          }

          return pass;
        }

        isMultipleLightPassesNeeded() {
          return this.shadowEnabledSpotLights.length > 0;
        }

      };

      _export("BuiltinForwardPassBuilder", BuiltinForwardPassBuilder = class BuiltinForwardPassBuilder {
        constructor() {
          this.forwardLighting = new ForwardLighting();
          this._viewport = new Viewport();
          this._clearColor = new Color(0, 0, 0, 1);
          this._reflectionProbeClearColor = new Vec3(0, 0, 0);
        }

        getConfigOrder() {
          return BuiltinForwardPassBuilder.ConfigOrder;
        }

        getRenderOrder() {
          return BuiltinForwardPassBuilder.RenderOrder;
        }

        configCamera(camera, pipelineConfigs, cameraConfigs) {
          // Shadow
          cameraConfigs.enableMainLightShadowMap = pipelineConfigs.shadowEnabled && !pipelineConfigs.usePlanarShadow && !!camera.scene && !!camera.scene.mainLight && camera.scene.mainLight.shadowEnabled;
          cameraConfigs.enableMainLightPlanarShadowMap = pipelineConfigs.shadowEnabled && pipelineConfigs.usePlanarShadow && !!camera.scene && !!camera.scene.mainLight && camera.scene.mainLight.shadowEnabled; // Reflection Probe

          cameraConfigs.enablePlanarReflectionProbe = cameraConfigs.isMainGameWindow || camera.cameraUsage === CameraUsage.SCENE_VIEW || camera.cameraUsage === CameraUsage.GAME_VIEW; // MSAA

          cameraConfigs.enableMSAA = cameraConfigs.settings.msaa.enabled && !cameraConfigs.enableStoreSceneDepth // Cannot store MS depth, resolve depth is also not cross-platform
          && !pipelineConfigs.isWeb // TODO(zhouzhenglong): remove this constraint
          && !pipelineConfigs.isWebGL1; // Forward rendering (Depend on MSAA and TBR)

          cameraConfigs.enableSingleForwardPass = pipelineConfigs.isMobile || cameraConfigs.enableMSAA;
          ++cameraConfigs.remainingPasses;
        }

        windowResize(ppl, pplConfigs, cameraConfigs, window, camera, nativeWidth, nativeHeight) {
          const ResourceFlags = rendering.ResourceFlags;
          const ResourceResidency = rendering.ResourceResidency;
          const id = window.renderWindowId;
          const settings = cameraConfigs.settings;
          const width = cameraConfigs.enableShadingScale ? Math.max(Math.floor(nativeWidth * cameraConfigs.shadingScale), 1) : nativeWidth;
          const height = cameraConfigs.enableShadingScale ? Math.max(Math.floor(nativeHeight * cameraConfigs.shadingScale), 1) : nativeHeight; // MsaaRadiance

          if (cameraConfigs.enableMSAA) {
            // Notice: We never store multisample results.
            // These samples are always resolved and discarded at the end of the render pass.
            // So the ResourceResidency should be MEMORYLESS.
            if (cameraConfigs.enableHDR) {
              ppl.addTexture(`MsaaRadiance${id}`, TextureType.TEX2D, cameraConfigs.radianceFormat, width, height, 1, 1, 1, settings.msaa.sampleCount, ResourceFlags.COLOR_ATTACHMENT, ResourceResidency.MEMORYLESS);
            } else {
              ppl.addTexture(`MsaaRadiance${id}`, TextureType.TEX2D, Format.RGBA8, width, height, 1, 1, 1, settings.msaa.sampleCount, ResourceFlags.COLOR_ATTACHMENT, ResourceResidency.MEMORYLESS);
            }

            ppl.addTexture(`MsaaDepthStencil${id}`, TextureType.TEX2D, Format.DEPTH_STENCIL, width, height, 1, 1, 1, settings.msaa.sampleCount, ResourceFlags.DEPTH_STENCIL_ATTACHMENT, ResourceResidency.MEMORYLESS);
          } // Mainlight ShadowMap


          ppl.addRenderTarget(`ShadowMap${id}`, pplConfigs.shadowMapFormat, pplConfigs.shadowMapSize.x, pplConfigs.shadowMapSize.y);
          ppl.addDepthStencil(`ShadowDepth${id}`, Format.DEPTH_STENCIL, pplConfigs.shadowMapSize.x, pplConfigs.shadowMapSize.y); // Spot-light shadow maps

          if (cameraConfigs.enableSingleForwardPass) {
            const count = pplConfigs.mobileMaxSpotLightShadowMaps;

            for (let i = 0; i !== count; ++i) {
              ppl.addRenderTarget(`SpotShadowMap${i}`, pplConfigs.shadowMapFormat, pplConfigs.shadowMapSize.x, pplConfigs.shadowMapSize.y);
              ppl.addDepthStencil(`SpotShadowDepth${i}`, Format.DEPTH_STENCIL, pplConfigs.shadowMapSize.x, pplConfigs.shadowMapSize.y);
            }
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context) {
          const id = camera.window.renderWindowId;
          const scene = camera.scene;
          const mainLight = scene.mainLight;
          --cameraConfigs.remainingPasses;
          assert(cameraConfigs.remainingPasses >= 0); // Forward Lighting (Light Culling)

          this.forwardLighting.cullLights(scene, camera.frustum); // Main Directional light CSM Shadow Map

          if (cameraConfigs.enableMainLightShadowMap) {
            assert(!!mainLight);

            this._addCascadedShadowMapPass(ppl, pplConfigs, id, mainLight, camera);
          } // Spot light shadow maps (Mobile or MSAA)


          if (cameraConfigs.enableSingleForwardPass) {
            // Currently, only support 1 spot light with shadow map on mobile platform.
            // TODO(zhouzhenglong): Relex this limitation.
            this.forwardLighting.addSpotlightShadowPasses(ppl, camera, pplConfigs.mobileMaxSpotLightShadowMaps);
          }

          this._tryAddReflectionProbePasses(ppl, cameraConfigs, id, mainLight, camera.scene);

          if (cameraConfigs.remainingPasses > 0 || cameraConfigs.enableShadingScale) {
            context.colorName = cameraConfigs.enableShadingScale ? `ScaledRadiance0_${id}` : `Radiance0_${id}`;
            context.depthStencilName = cameraConfigs.enableShadingScale ? `ScaledSceneDepth_${id}` : `SceneDepth_${id}`;
          } else {
            context.colorName = cameraConfigs.colorName;
            context.depthStencilName = cameraConfigs.depthStencilName;
          }

          const pass = this._addForwardRadiancePasses(ppl, pplConfigs, cameraConfigs, id, camera, cameraConfigs.width, cameraConfigs.height, mainLight, context.colorName, context.depthStencilName, !cameraConfigs.enableMSAA, cameraConfigs.enableStoreSceneDepth ? StoreOp.STORE : StoreOp.DISCARD);

          if (!cameraConfigs.enableStoreSceneDepth) {
            context.depthStencilName = '';
          }

          if (cameraConfigs.remainingPasses === 0 && cameraConfigs.enableShadingScale) {
            return addCopyToScreenPass(ppl, pplConfigs, cameraConfigs, context.colorName);
          } else {
            return pass;
          }
        }

        _addCascadedShadowMapPass(ppl, pplConfigs, id, light, camera) {
          const QueueHint = rendering.QueueHint;
          const SceneFlags = rendering.SceneFlags; // ----------------------------------------------------------------
          // Dynamic states
          // ----------------------------------------------------------------

          const shadowSize = ppl.pipelineSceneData.shadows.size;
          const width = shadowSize.x;
          const height = shadowSize.y;
          const viewport = this._viewport;
          viewport.left = viewport.top = 0;
          viewport.width = width;
          viewport.height = height; // ----------------------------------------------------------------
          // CSM Shadow Map
          // ----------------------------------------------------------------

          const pass = ppl.addRenderPass(width, height, 'default');
          pass.name = 'CascadedShadowMap';
          pass.addRenderTarget(`ShadowMap${id}`, LoadOp.CLEAR, StoreOp.STORE, new Color(1, 1, 1, 1));
          pass.addDepthStencil(`ShadowDepth${id}`, LoadOp.CLEAR, StoreOp.DISCARD);
          const csmLevel = ppl.pipelineSceneData.csmSupported ? light.csmLevel : 1; // Add shadow map viewports

          for (let level = 0; level !== csmLevel; ++level) {
            getCsmMainLightViewport(light, width, height, level, this._viewport, pplConfigs.screenSpaceSignY);
            const queue = pass.addQueue(QueueHint.NONE, 'shadow-caster');

            if (!pplConfigs.isWebGPU) {
              // Temporary workaround for WebGPU
              queue.setViewport(this._viewport);
            }

            queue.addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.SHADOW_CASTER).useLightFrustum(light, level);
          }
        }

        _tryAddReflectionProbePasses(ppl, cameraConfigs, id, mainLight, scene) {
          const reflectionProbeManager = cclegacy.internal.reflectionProbeManager;

          if (!reflectionProbeManager) {
            return;
          }

          const ResourceResidency = rendering.ResourceResidency;
          const probes = reflectionProbeManager.getProbes();
          const maxProbeCount = 4;
          let probeID = 0;

          for (const probe of probes) {
            if (!probe.needRender) {
              continue;
            }

            const area = probe.renderArea();
            const width = Math.max(Math.floor(area.x), 1);
            const height = Math.max(Math.floor(area.y), 1);

            if (probe.probeType === renderer.scene.ProbeType.PLANAR) {
              if (!cameraConfigs.enablePlanarReflectionProbe) {
                continue;
              }

              const window = probe.realtimePlanarTexture.window;
              const colorName = `PlanarProbeRT${probeID}`;
              const depthStencilName = `PlanarProbeDS${probeID}`; // ProbeResource

              ppl.addRenderWindow(colorName, cameraConfigs.radianceFormat, width, height, window);
              ppl.addDepthStencil(depthStencilName, gfx.Format.DEPTH_STENCIL, width, height, ResourceResidency.MEMORYLESS); // Rendering

              const probePass = ppl.addRenderPass(width, height, 'default');
              probePass.name = `PlanarReflectionProbe${probeID}`;

              this._buildReflectionProbePass(probePass, cameraConfigs, id, probe.camera, colorName, depthStencilName, mainLight, scene);
            } else if (EDITOR) {
              for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                probe.updateCameraDir(faceIdx);
                const window = probe.bakedCubeTextures[faceIdx].window;
                const colorName = `CubeProbeRT${probeID}${faceIdx}`;
                const depthStencilName = `CubeProbeDS${probeID}${faceIdx}`; // ProbeResource

                ppl.addRenderWindow(colorName, cameraConfigs.radianceFormat, width, height, window);
                ppl.addDepthStencil(depthStencilName, gfx.Format.DEPTH_STENCIL, width, height, ResourceResidency.MEMORYLESS); // Rendering

                const probePass = ppl.addRenderPass(width, height, 'default');
                probePass.name = `CubeProbe${probeID}${faceIdx}`;

                this._buildReflectionProbePass(probePass, cameraConfigs, id, probe.camera, colorName, depthStencilName, mainLight, scene);
              }

              probe.needRender = false;
            }

            ++probeID;

            if (probeID === maxProbeCount) {
              break;
            }
          }
        }

        _buildReflectionProbePass(pass, cameraConfigs, id, camera, colorName, depthStencilName, mainLight, scene = null) {
          const QueueHint = rendering.QueueHint;
          const SceneFlags = rendering.SceneFlags; // set viewport

          const colorStoreOp = cameraConfigs.enableMSAA ? StoreOp.DISCARD : StoreOp.STORE; // bind output render target

          if (forwardNeedClearColor(camera)) {
            this._reflectionProbeClearColor.x = camera.clearColor.x;
            this._reflectionProbeClearColor.y = camera.clearColor.y;
            this._reflectionProbeClearColor.z = camera.clearColor.z;
            const clearColor = rendering.packRGBE(this._reflectionProbeClearColor);
            this._clearColor.x = clearColor.x;
            this._clearColor.y = clearColor.y;
            this._clearColor.z = clearColor.z;
            this._clearColor.w = clearColor.w;
            pass.addRenderTarget(colorName, LoadOp.CLEAR, colorStoreOp, this._clearColor);
          } else {
            pass.addRenderTarget(colorName, LoadOp.LOAD, colorStoreOp);
          } // bind depth stencil buffer


          if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
            pass.addDepthStencil(depthStencilName, LoadOp.CLEAR, StoreOp.DISCARD, camera.clearDepth, camera.clearStencil, camera.clearFlag & ClearFlagBit.DEPTH_STENCIL);
          } else {
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD, StoreOp.DISCARD);
          } // Set shadow map if enabled


          if (cameraConfigs.enableMainLightShadowMap) {
            pass.addTexture(`ShadowMap${id}`, 'cc_shadowMap');
          } // TODO(zhouzhenglong): Separate OPAQUE and MASK queue
          // add opaque and mask queue


          pass.addQueue(QueueHint.NONE, 'reflect-map') // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
          .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK | SceneFlags.REFLECTION_PROBE, mainLight || undefined, scene ? scene : undefined);
        }

        _addForwardRadiancePasses(ppl, pplConfigs, cameraConfigs, id, camera, width, height, mainLight, colorName, depthStencilName, disableMSAA = false, depthStencilStoreOp = StoreOp.DISCARD) {
          const QueueHint = rendering.QueueHint;
          const SceneFlags = rendering.SceneFlags; // ----------------------------------------------------------------
          // Dynamic states
          // ----------------------------------------------------------------
          // Prepare camera clear color

          const clearColor = camera.clearColor; // Reduce C++/TS interop

          this._clearColor.x = clearColor.x;
          this._clearColor.y = clearColor.y;
          this._clearColor.z = clearColor.z;
          this._clearColor.w = clearColor.w; // Prepare camera viewport

          const viewport = camera.viewport; // Reduce C++/TS interop

          this._viewport.left = Math.round(viewport.x * width);
          this._viewport.top = Math.round(viewport.y * height); // Here we must use camera.viewport.width instead of camera.viewport.z, which
          // is undefined on native platform. The same as camera.viewport.height.

          this._viewport.width = Math.max(Math.round(viewport.width * width), 1);
          this._viewport.height = Math.max(Math.round(viewport.height * height), 1); // MSAA

          const enableMSAA = !disableMSAA && cameraConfigs.enableMSAA;
          assert(!enableMSAA || cameraConfigs.enableSingleForwardPass); // ----------------------------------------------------------------
          // Forward Lighting (Main Directional Light)
          // ----------------------------------------------------------------

          const pass = cameraConfigs.enableSingleForwardPass ? this._addForwardSingleRadiancePass(ppl, pplConfigs, cameraConfigs, id, camera, enableMSAA, width, height, mainLight, colorName, depthStencilName, depthStencilStoreOp) : this._addForwardMultipleRadiancePasses(ppl, cameraConfigs, id, camera, width, height, mainLight, colorName, depthStencilName, depthStencilStoreOp); // Planar Shadow

          if (cameraConfigs.enableMainLightPlanarShadowMap) {
            this._addPlanarShadowQueue(camera, mainLight, pass);
          } // ----------------------------------------------------------------
          // Forward Lighting (Blend)
          // ----------------------------------------------------------------
          // Add transparent queue


          const sceneFlags = SceneFlags.BLEND | (camera.geometryRenderer ? SceneFlags.GEOMETRY : SceneFlags.NONE);
          pass.addQueue(QueueHint.BLEND).addScene(camera, sceneFlags, mainLight || undefined);
          return pass;
        }

        _addForwardSingleRadiancePass(ppl, pplConfigs, cameraConfigs, id, camera, enableMSAA, width, height, mainLight, colorName, depthStencilName, depthStencilStoreOp) {
          assert(cameraConfigs.enableSingleForwardPass); // ----------------------------------------------------------------
          // Forward Lighting (Main Directional Light)
          // ----------------------------------------------------------------

          let pass;

          if (enableMSAA) {
            const msaaRadianceName = `MsaaRadiance${id}`;
            const msaaDepthStencilName = `MsaaDepthStencil${id}`;
            const sampleCount = cameraConfigs.settings.msaa.sampleCount;
            const msPass = ppl.addMultisampleRenderPass(width, height, sampleCount, 0, 'default');
            msPass.name = 'MsaaForwardPass'; // MSAA always discards depth stencil

            this._buildForwardMainLightPass(msPass, cameraConfigs, id, camera, msaaRadianceName, msaaDepthStencilName, StoreOp.DISCARD, mainLight);

            msPass.resolveRenderTarget(msaaRadianceName, colorName);
            pass = msPass;
          } else {
            pass = ppl.addRenderPass(width, height, 'default');
            pass.name = 'ForwardPass';

            this._buildForwardMainLightPass(pass, cameraConfigs, id, camera, colorName, depthStencilName, depthStencilStoreOp, mainLight);
          }

          assert(pass !== undefined); // Forward Lighting (Additive Lights)

          this.forwardLighting.addLightQueues(pass, camera, pplConfigs.mobileMaxSpotLightShadowMaps);
          return pass;
        }

        _addForwardMultipleRadiancePasses(ppl, cameraConfigs, id, camera, width, height, mainLight, colorName, depthStencilName, depthStencilStoreOp) {
          assert(!cameraConfigs.enableSingleForwardPass); // Forward Lighting (Main Directional Light)

          let pass = ppl.addRenderPass(width, height, 'default');
          pass.name = 'ForwardPass';
          const firstStoreOp = this.forwardLighting.isMultipleLightPassesNeeded() ? StoreOp.STORE : depthStencilStoreOp;

          this._buildForwardMainLightPass(pass, cameraConfigs, id, camera, colorName, depthStencilName, firstStoreOp, mainLight); // Forward Lighting (Additive Lights)


          pass = this.forwardLighting.addLightPasses(colorName, depthStencilName, depthStencilStoreOp, id, width, height, camera, this._viewport, ppl, pass);
          return pass;
        }

        _buildForwardMainLightPass(pass, cameraConfigs, id, camera, colorName, depthStencilName, depthStencilStoreOp, mainLight, scene = null) {
          const QueueHint = rendering.QueueHint;
          const SceneFlags = rendering.SceneFlags; // set viewport

          pass.setViewport(this._viewport);
          const colorStoreOp = cameraConfigs.enableMSAA ? StoreOp.DISCARD : StoreOp.STORE; // bind output render target

          if (forwardNeedClearColor(camera)) {
            pass.addRenderTarget(colorName, LoadOp.CLEAR, colorStoreOp, this._clearColor);
          } else {
            pass.addRenderTarget(colorName, LoadOp.LOAD, colorStoreOp);
          } // bind depth stencil buffer


          if (DEBUG) {
            if (colorName === cameraConfigs.colorName && depthStencilName !== cameraConfigs.depthStencilName) {
              warn('Default framebuffer cannot use custom depth stencil buffer');
            }
          }

          if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
            pass.addDepthStencil(depthStencilName, LoadOp.CLEAR, depthStencilStoreOp, camera.clearDepth, camera.clearStencil, camera.clearFlag & ClearFlagBit.DEPTH_STENCIL);
          } else {
            pass.addDepthStencil(depthStencilName, LoadOp.LOAD, depthStencilStoreOp);
          } // Set shadow map if enabled


          if (cameraConfigs.enableMainLightShadowMap) {
            pass.addTexture(`ShadowMap${id}`, 'cc_shadowMap');
          } // TODO(zhouzhenglong): Separate OPAQUE and MASK queue
          // add opaque and mask queue


          pass.addQueue(QueueHint.NONE) // Currently we put OPAQUE and MASK into one queue, so QueueHint is NONE
          .addScene(camera, SceneFlags.OPAQUE | SceneFlags.MASK, mainLight || undefined, scene ? scene : undefined);
        }

        _addPlanarShadowQueue(camera, mainLight, pass) {
          const QueueHint = rendering.QueueHint;
          const SceneFlags = rendering.SceneFlags;
          pass.addQueue(QueueHint.BLEND, 'planar-shadow').addScene(camera, SceneFlags.SHADOW_CASTER | SceneFlags.PLANAR_SHADOW | SceneFlags.BLEND, mainLight || undefined);
        }

      });

      BuiltinForwardPassBuilder.ConfigOrder = 100;
      BuiltinForwardPassBuilder.RenderOrder = 100;

      _export("BuiltinBloomPassBuilder", BuiltinBloomPassBuilder = class BuiltinBloomPassBuilder {
        constructor() {
          // Bloom
          this._clearColorTransparentBlack = new Color(0, 0, 0, 0);
          this._bloomParams = new Vec4(0, 0, 0, 0);
          this._bloomTexSize = new Vec4(0, 0, 0, 0);
          this._bloomWidths = [];
          this._bloomHeights = [];
          this._bloomTexNames = [];
        }

        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 200;
        }

        configCamera(camera, pipelineConfigs, cameraConfigs) {
          cameraConfigs.enableBloom = cameraConfigs.settings.bloom.enabled && !!cameraConfigs.settings.bloom.material;

          if (cameraConfigs.enableBloom) {
            ++cameraConfigs.remainingPasses;
          }
        }

        windowResize(ppl, pplConfigs, cameraConfigs, window) {
          if (cameraConfigs.enableBloom) {
            const id = window.renderWindowId;
            let bloomWidth = cameraConfigs.width;
            let bloomHeight = cameraConfigs.height;

            for (let i = 0; i !== cameraConfigs.settings.bloom.iterations + 1; ++i) {
              bloomWidth = Math.max(Math.floor(bloomWidth / 2), 1);
              bloomHeight = Math.max(Math.floor(bloomHeight / 2), 1);
              ppl.addRenderTarget(`BloomTex${id}_${i}`, cameraConfigs.radianceFormat, bloomWidth, bloomHeight);
            }
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          if (!cameraConfigs.enableBloom) {
            return prevRenderPass;
          }

          --cameraConfigs.remainingPasses;
          assert(cameraConfigs.remainingPasses >= 0);
          const id = camera.window.renderWindowId;
          assert(!!cameraConfigs.settings.bloom.material);
          return this._addKawaseDualFilterBloomPasses(ppl, pplConfigs, cameraConfigs, cameraConfigs.settings, cameraConfigs.settings.bloom.material, id, cameraConfigs.width, cameraConfigs.height, context.colorName);
        }

        _addKawaseDualFilterBloomPasses(ppl, pplConfigs, cameraConfigs, settings, bloomMaterial, id, width, height, radianceName) {
          const QueueHint = rendering.QueueHint; // Based on Kawase Dual Filter Blur. Saves bandwidth on mobile devices.
          // eslint-disable-next-line max-len
          // https://community.arm.com/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_slides.pdf
          // Size: [prefilter(1/2), downsample(1/4), downsample(1/8), downsample(1/16), ...]

          const iterations = settings.bloom.iterations;
          const sizeCount = iterations + 1;
          this._bloomWidths.length = sizeCount;
          this._bloomHeights.length = sizeCount;
          this._bloomWidths[0] = Math.max(Math.floor(width / 2), 1);
          this._bloomHeights[0] = Math.max(Math.floor(height / 2), 1);

          for (let i = 1; i !== sizeCount; ++i) {
            this._bloomWidths[i] = Math.max(Math.floor(this._bloomWidths[i - 1] / 2), 1);
            this._bloomHeights[i] = Math.max(Math.floor(this._bloomHeights[i - 1] / 2), 1);
          } // Bloom texture names


          this._bloomTexNames.length = sizeCount;

          for (let i = 0; i !== sizeCount; ++i) {
            this._bloomTexNames[i] = `BloomTex${id}_${i}`;
          } // Setup bloom parameters


          this._bloomParams.x = pplConfigs.useFloatOutput ? 1 : 0;
          this._bloomParams.x = 0; // unused

          this._bloomParams.z = settings.bloom.threshold;
          this._bloomParams.w = settings.bloom.enableAlphaMask ? 1 : 0; // Prefilter pass

          const prefilterPass = ppl.addRenderPass(this._bloomWidths[0], this._bloomHeights[0], 'cc-bloom-prefilter');
          prefilterPass.addRenderTarget(this._bloomTexNames[0], LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
          prefilterPass.addTexture(radianceName, 'inputTexture');
          prefilterPass.setVec4('g_platform', pplConfigs.platform);
          prefilterPass.setVec4('bloomParams', this._bloomParams);
          prefilterPass.addQueue(QueueHint.OPAQUE).addFullscreenQuad(bloomMaterial, 0); // Downsample passes

          for (let i = 1; i !== sizeCount; ++i) {
            const downPass = ppl.addRenderPass(this._bloomWidths[i], this._bloomHeights[i], 'cc-bloom-downsample');
            downPass.addRenderTarget(this._bloomTexNames[i], LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            downPass.addTexture(this._bloomTexNames[i - 1], 'bloomTexture');
            this._bloomTexSize.x = this._bloomWidths[i - 1];
            this._bloomTexSize.y = this._bloomHeights[i - 1];
            downPass.setVec4('g_platform', pplConfigs.platform);
            downPass.setVec4('bloomTexSize', this._bloomTexSize);
            downPass.addQueue(QueueHint.OPAQUE).addFullscreenQuad(bloomMaterial, 1);
          } // Upsample passes


          for (let i = iterations; i-- > 0;) {
            const upPass = ppl.addRenderPass(this._bloomWidths[i], this._bloomHeights[i], 'cc-bloom-upsample');
            upPass.addRenderTarget(this._bloomTexNames[i], LoadOp.CLEAR, StoreOp.STORE, this._clearColorTransparentBlack);
            upPass.addTexture(this._bloomTexNames[i + 1], 'bloomTexture');
            this._bloomTexSize.x = this._bloomWidths[i + 1];
            this._bloomTexSize.y = this._bloomHeights[i + 1];
            upPass.setVec4('g_platform', pplConfigs.platform);
            upPass.setVec4('bloomTexSize', this._bloomTexSize);
            upPass.addQueue(QueueHint.OPAQUE).addFullscreenQuad(bloomMaterial, 2);
          } // Combine pass


          const combinePass = ppl.addRenderPass(width, height, 'cc-bloom-combine');
          combinePass.addRenderTarget(radianceName, LoadOp.LOAD, StoreOp.STORE);
          combinePass.addTexture(this._bloomTexNames[0], 'bloomTexture');
          combinePass.setVec4('g_platform', pplConfigs.platform);
          combinePass.setVec4('bloomParams', this._bloomParams);
          combinePass.addQueue(QueueHint.BLEND).addFullscreenQuad(bloomMaterial, 3);

          if (cameraConfigs.remainingPasses === 0) {
            return addCopyToScreenPass(ppl, pplConfigs, cameraConfigs, radianceName);
          } else {
            return combinePass;
          }
        }

      });

      _export("BuiltinToneMappingPassBuilder", BuiltinToneMappingPassBuilder = class BuiltinToneMappingPassBuilder {
        constructor() {
          this._colorGradingTexSize = new Vec2(0, 0);
        }

        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 300;
        }

        configCamera(camera, pplConfigs, cameraConfigs) {
          const settings = cameraConfigs.settings;
          cameraConfigs.enableColorGrading = settings.colorGrading.enabled && !!settings.colorGrading.material && !!settings.colorGrading.colorGradingMap;
          cameraConfigs.enableToneMapping = cameraConfigs.enableHDR // From Half to RGBA8
          || cameraConfigs.enableColorGrading; // Color grading

          if (cameraConfigs.enableToneMapping) {
            ++cameraConfigs.remainingPasses;
          }
        }

        windowResize(ppl, pplConfigs, cameraConfigs) {
          if (cameraConfigs.enableColorGrading) {
            assert(!!cameraConfigs.settings.colorGrading.material);
            cameraConfigs.settings.colorGrading.material.setProperty('colorGradingMap', cameraConfigs.settings.colorGrading.colorGradingMap);
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          if (!cameraConfigs.enableToneMapping) {
            return prevRenderPass;
          }

          --cameraConfigs.remainingPasses;
          assert(cameraConfigs.remainingPasses >= 0);

          if (cameraConfigs.remainingPasses === 0) {
            return this._addCopyAndTonemapPass(ppl, pplConfigs, cameraConfigs, cameraConfigs.width, cameraConfigs.height, context.colorName, cameraConfigs.colorName);
          } else {
            const id = cameraConfigs.renderWindowId;
            const ldrColorPrefix = cameraConfigs.enableShadingScale ? `ScaledLdrColor` : `LdrColor`;
            const ldrColorName = getPingPongRenderTarget(context.colorName, ldrColorPrefix, id);
            const radianceName = context.colorName;
            context.colorName = ldrColorName;
            return this._addCopyAndTonemapPass(ppl, pplConfigs, cameraConfigs, cameraConfigs.width, cameraConfigs.height, radianceName, ldrColorName);
          }
        }

        _addCopyAndTonemapPass(ppl, pplConfigs, cameraConfigs, width, height, radianceName, colorName) {
          let pass;
          const settings = cameraConfigs.settings;

          if (cameraConfigs.enableColorGrading) {
            assert(!!settings.colorGrading.material);
            assert(!!settings.colorGrading.colorGradingMap);
            const lutTex = settings.colorGrading.colorGradingMap;
            this._colorGradingTexSize.x = lutTex.width;
            this._colorGradingTexSize.y = lutTex.height;
            const isSquareMap = lutTex.width === lutTex.height;

            if (isSquareMap) {
              pass = ppl.addRenderPass(width, height, 'cc-color-grading-8x8');
            } else {
              pass = ppl.addRenderPass(width, height, 'cc-color-grading-nx1');
            }

            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
            pass.addTexture(radianceName, 'sceneColorMap');
            pass.setVec4('g_platform', pplConfigs.platform);
            pass.setVec2('lutTextureSize', this._colorGradingTexSize);
            pass.setFloat('contribute', settings.colorGrading.contribute);
            pass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(settings.colorGrading.material, isSquareMap ? 1 : 0);
          } else {
            pass = ppl.addRenderPass(width, height, 'cc-tone-mapping');
            pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
            pass.addTexture(radianceName, 'inputTexture');
            pass.setVec4('g_platform', pplConfigs.platform);

            if (settings.toneMapping.material) {
              pass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(settings.toneMapping.material, 0);
            } else {
              assert(!!cameraConfigs.copyAndTonemapMaterial);
              pass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(cameraConfigs.copyAndTonemapMaterial, 0);
            }
          }

          return pass;
        }

      });

      _export("BuiltinFXAAPassBuilder", BuiltinFXAAPassBuilder = class BuiltinFXAAPassBuilder {
        constructor() {
          // FXAA
          this._fxaaParams = new Vec4(0, 0, 0, 0);
        }

        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 400;
        }

        configCamera(camera, pplConfigs, cameraConfigs) {
          cameraConfigs.enableFXAA = cameraConfigs.settings.fxaa.enabled && !!cameraConfigs.settings.fxaa.material;

          if (cameraConfigs.enableFXAA) {
            ++cameraConfigs.remainingPasses;
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          if (!cameraConfigs.enableFXAA) {
            return prevRenderPass;
          }

          --cameraConfigs.remainingPasses;
          assert(cameraConfigs.remainingPasses >= 0);
          const id = cameraConfigs.renderWindowId;
          const ldrColorPrefix = cameraConfigs.enableShadingScale ? `ScaledLdrColor` : `LdrColor`;
          const ldrColorName = getPingPongRenderTarget(context.colorName, ldrColorPrefix, id);
          assert(!!cameraConfigs.settings.fxaa.material);

          if (cameraConfigs.remainingPasses === 0) {
            if (cameraConfigs.enableShadingScale) {
              this._addFxaaPass(ppl, pplConfigs, cameraConfigs.settings.fxaa.material, cameraConfigs.width, cameraConfigs.height, context.colorName, ldrColorName);

              return addCopyToScreenPass(ppl, pplConfigs, cameraConfigs, ldrColorName);
            } else {
              assert(cameraConfigs.width === cameraConfigs.nativeWidth);
              assert(cameraConfigs.height === cameraConfigs.nativeHeight);
              return this._addFxaaPass(ppl, pplConfigs, cameraConfigs.settings.fxaa.material, cameraConfigs.width, cameraConfigs.height, context.colorName, cameraConfigs.colorName);
            }
          } else {
            const inputColorName = context.colorName;
            context.colorName = ldrColorName;

            const lastPass = this._addFxaaPass(ppl, pplConfigs, cameraConfigs.settings.fxaa.material, cameraConfigs.width, cameraConfigs.height, inputColorName, ldrColorName);

            return lastPass;
          }
        }

        _addFxaaPass(ppl, pplConfigs, fxaaMaterial, width, height, ldrColorName, colorName) {
          this._fxaaParams.x = width;
          this._fxaaParams.y = height;
          this._fxaaParams.z = 1 / width;
          this._fxaaParams.w = 1 / height;
          const pass = ppl.addRenderPass(width, height, 'cc-fxaa');
          pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
          pass.addTexture(ldrColorName, 'sceneColorMap');
          pass.setVec4('g_platform', pplConfigs.platform);
          pass.setVec4('texSize', this._fxaaParams);
          pass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(fxaaMaterial, 0);
          return pass;
        }

      });

      _export("BuiltinFsrPassBuilder", BuiltinFsrPassBuilder = class BuiltinFsrPassBuilder {
        constructor() {
          // FSR
          this._fsrParams = new Vec4(0, 0, 0, 0);
          this._fsrTexSize = new Vec4(0, 0, 0, 0);
        }

        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 500;
        }

        configCamera(camera, pplConfigs, cameraConfigs) {
          // FSR (Depend on Shading scale)
          cameraConfigs.enableFSR = cameraConfigs.settings.fsr.enabled && !!cameraConfigs.settings.fsr.material && cameraConfigs.enableShadingScale && cameraConfigs.shadingScale < 1.0;

          if (cameraConfigs.enableFSR) {
            ++cameraConfigs.remainingPasses;
          }
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          if (!cameraConfigs.enableFSR) {
            return prevRenderPass;
          }

          --cameraConfigs.remainingPasses;
          const inputColorName = context.colorName;
          const outputColorName = cameraConfigs.remainingPasses === 0 ? cameraConfigs.colorName : getPingPongRenderTarget(context.colorName, 'UiColor', cameraConfigs.renderWindowId);
          context.colorName = outputColorName;
          assert(!!cameraConfigs.settings.fsr.material);
          return this._addFsrPass(ppl, pplConfigs, cameraConfigs, cameraConfigs.settings, cameraConfigs.settings.fsr.material, cameraConfigs.renderWindowId, cameraConfigs.width, cameraConfigs.height, inputColorName, cameraConfigs.nativeWidth, cameraConfigs.nativeHeight, outputColorName);
        }

        _addFsrPass(ppl, pplConfigs, cameraConfigs, settings, fsrMaterial, id, width, height, inputColorName, nativeWidth, nativeHeight, outputColorName) {
          this._fsrTexSize.x = width;
          this._fsrTexSize.y = height;
          this._fsrTexSize.z = nativeWidth;
          this._fsrTexSize.w = nativeHeight;
          this._fsrParams.x = clamp(1.0 - settings.fsr.sharpness, 0.02, 0.98);
          const uiColorPrefix = 'UiColor';
          const fsrColorName = getPingPongRenderTarget(outputColorName, uiColorPrefix, id);
          const easuPass = ppl.addRenderPass(nativeWidth, nativeHeight, 'cc-fsr-easu');
          easuPass.addRenderTarget(fsrColorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
          easuPass.addTexture(inputColorName, 'outputResultMap');
          easuPass.setVec4('g_platform', pplConfigs.platform);
          easuPass.setVec4('fsrTexSize', this._fsrTexSize);
          easuPass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(fsrMaterial, 0);
          const rcasPass = ppl.addRenderPass(nativeWidth, nativeHeight, 'cc-fsr-rcas');
          rcasPass.addRenderTarget(outputColorName, LoadOp.CLEAR, StoreOp.STORE, sClearColorTransparentBlack);
          rcasPass.addTexture(fsrColorName, 'outputResultMap');
          rcasPass.setVec4('g_platform', pplConfigs.platform);
          rcasPass.setVec4('fsrTexSize', this._fsrTexSize);
          rcasPass.setVec4('fsrParams', this._fsrParams);
          rcasPass.addQueue(rendering.QueueHint.OPAQUE).addFullscreenQuad(fsrMaterial, 1);
          return rcasPass;
        }

      });

      _export("BuiltinUiPassBuilder", BuiltinUiPassBuilder = class BuiltinUiPassBuilder {
        getConfigOrder() {
          return 0;
        }

        getRenderOrder() {
          return 1000;
        }

        setup(ppl, pplConfigs, cameraConfigs, camera, context, prevRenderPass) {
          assert(!!prevRenderPass);
          let flags = rendering.SceneFlags.UI;

          if (cameraConfigs.enableProfiler) {
            flags |= rendering.SceneFlags.PROFILER;
            prevRenderPass.showStatistics = true;
          }

          prevRenderPass.addQueue(rendering.QueueHint.BLEND, 'default', 'default').addScene(camera, flags);
          return prevRenderPass;
        }

      });

      if (rendering) {
        ({
          QueueHint,
          SceneFlags
        } = rendering);

        class BuiltinPipelineBuilder {
          constructor() {
            this._pipelineEvent = cclegacy.director.root.pipelineEvent;
            this._forwardPass = new BuiltinForwardPassBuilder();
            this._bloomPass = new BuiltinBloomPassBuilder();
            this._toneMappingPass = new BuiltinToneMappingPassBuilder();
            this._fxaaPass = new BuiltinFXAAPassBuilder();
            this._fsrPass = new BuiltinFsrPassBuilder();
            this._uiPass = new BuiltinUiPassBuilder();
            // Internal cached resources
            this._clearColor = new Color(0, 0, 0, 1);
            this._viewport = new Viewport();
            this._configs = new PipelineConfigs();
            this._cameraConfigs = new CameraConfigs();
            // Materials
            this._copyAndTonemapMaterial = new Material();
            // Internal States
            this._initialized = false;
            // TODO(zhouzhenglong): Make default effect asset loading earlier and remove this flag
            this._passBuilders = [];
          }

          _setupPipelinePreview(camera, cameraConfigs) {
            const isEditorView = camera.cameraUsage === CameraUsage.SCENE_VIEW || camera.cameraUsage === CameraUsage.PREVIEW;

            if (isEditorView) {
              const editorSettings = rendering.getEditorPipelineSettings();

              if (editorSettings) {
                cameraConfigs.settings = editorSettings;
              } else {
                cameraConfigs.settings = defaultSettings;
              }
            } else {
              if (camera.pipelineSettings) {
                cameraConfigs.settings = camera.pipelineSettings;
              } else {
                cameraConfigs.settings = defaultSettings;
              }
            }
          }

          _preparePipelinePasses(cameraConfigs) {
            const passBuilders = this._passBuilders;
            passBuilders.length = 0;
            const settings = cameraConfigs.settings;

            if (settings._passes) {
              for (const pass of settings._passes) {
                passBuilders.push(pass);
              }

              assert(passBuilders.length === settings._passes.length);
            }

            passBuilders.push(this._forwardPass);

            if (settings.bloom.enabled) {
              passBuilders.push(this._bloomPass);
            }

            passBuilders.push(this._toneMappingPass);

            if (settings.fxaa.enabled) {
              passBuilders.push(this._fxaaPass);
            }

            if (settings.fsr.enabled) {
              passBuilders.push(this._fsrPass);
            }

            passBuilders.push(this._uiPass);
          }

          _setupBuiltinCameraConfigs(camera, pipelineConfigs, cameraConfigs) {
            const window = camera.window;
            const isMainGameWindow = camera.cameraUsage === CameraUsage.GAME && !!window.swapchain; // Window

            cameraConfigs.isMainGameWindow = isMainGameWindow;
            cameraConfigs.renderWindowId = window.renderWindowId; // Camera

            cameraConfigs.colorName = window.colorName;
            cameraConfigs.depthStencilName = window.depthStencilName; // Pipeline

            cameraConfigs.enableFullPipeline = (camera.visibility & Layers.Enum.DEFAULT) !== 0;
            cameraConfigs.enableProfiler = DEBUG && isMainGameWindow;
            cameraConfigs.remainingPasses = 0; // Shading scale

            cameraConfigs.shadingScale = cameraConfigs.settings.shadingScale;
            cameraConfigs.enableShadingScale = cameraConfigs.settings.enableShadingScale && cameraConfigs.shadingScale !== 1.0;
            cameraConfigs.nativeWidth = Math.max(Math.floor(window.width), 1);
            cameraConfigs.nativeHeight = Math.max(Math.floor(window.height), 1);
            cameraConfigs.width = cameraConfigs.enableShadingScale ? Math.max(Math.floor(cameraConfigs.nativeWidth * cameraConfigs.shadingScale), 1) : cameraConfigs.nativeWidth;
            cameraConfigs.height = cameraConfigs.enableShadingScale ? Math.max(Math.floor(cameraConfigs.nativeHeight * cameraConfigs.shadingScale), 1) : cameraConfigs.nativeHeight; // Radiance

            cameraConfigs.enableHDR = cameraConfigs.enableFullPipeline && pipelineConfigs.useFloatOutput;
            cameraConfigs.radianceFormat = cameraConfigs.enableHDR ? gfx.Format.RGBA16F : gfx.Format.RGBA8; // Tone Mapping

            cameraConfigs.copyAndTonemapMaterial = this._copyAndTonemapMaterial; // Depth

            cameraConfigs.enableStoreSceneDepth = false;
          }

          _setupCameraConfigs(camera, pipelineConfigs, cameraConfigs) {
            this._setupPipelinePreview(camera, cameraConfigs);

            this._preparePipelinePasses(cameraConfigs);

            sortPipelinePassBuildersByConfigOrder(this._passBuilders);

            this._setupBuiltinCameraConfigs(camera, pipelineConfigs, cameraConfigs);

            for (const builder of this._passBuilders) {
              if (builder.configCamera) {
                builder.configCamera(camera, pipelineConfigs, cameraConfigs);
              }
            }
          } // ----------------------------------------------------------------
          // Interface
          // ----------------------------------------------------------------


          windowResize(ppl, window, camera, nativeWidth, nativeHeight) {
            setupPipelineConfigs(ppl, this._configs);

            this._setupCameraConfigs(camera, this._configs, this._cameraConfigs); // Render Window (UI)


            const id = window.renderWindowId;
            ppl.addRenderWindow(this._cameraConfigs.colorName, Format.RGBA8, nativeWidth, nativeHeight, window, this._cameraConfigs.depthStencilName);
            const width = this._cameraConfigs.width;
            const height = this._cameraConfigs.height;

            if (this._cameraConfigs.enableShadingScale) {
              ppl.addDepthStencil(`ScaledSceneDepth_${id}`, Format.DEPTH_STENCIL, width, height);
              ppl.addRenderTarget(`ScaledRadiance0_${id}`, this._cameraConfigs.radianceFormat, width, height);
              ppl.addRenderTarget(`ScaledRadiance1_${id}`, this._cameraConfigs.radianceFormat, width, height);
              ppl.addRenderTarget(`ScaledLdrColor0_${id}`, Format.RGBA8, width, height);
              ppl.addRenderTarget(`ScaledLdrColor1_${id}`, Format.RGBA8, width, height);
            } else {
              ppl.addDepthStencil(`SceneDepth_${id}`, Format.DEPTH_STENCIL, width, height);
              ppl.addRenderTarget(`Radiance0_${id}`, this._cameraConfigs.radianceFormat, width, height);
              ppl.addRenderTarget(`Radiance1_${id}`, this._cameraConfigs.radianceFormat, width, height);
              ppl.addRenderTarget(`LdrColor0_${id}`, Format.RGBA8, width, height);
              ppl.addRenderTarget(`LdrColor1_${id}`, Format.RGBA8, width, height);
            }

            ppl.addRenderTarget(`UiColor0_${id}`, Format.RGBA8, nativeWidth, nativeHeight);
            ppl.addRenderTarget(`UiColor1_${id}`, Format.RGBA8, nativeWidth, nativeHeight);

            for (const builder of this._passBuilders) {
              if (builder.windowResize) {
                builder.windowResize(ppl, this._configs, this._cameraConfigs, window, camera, nativeWidth, nativeHeight);
              }
            }
          }

          setup(cameras, ppl) {
            // TODO(zhouzhenglong): Make default effect asset loading earlier and remove _initMaterials
            if (this._initMaterials(ppl)) {
              return;
            } // Render cameras
            // log(`==================== One Frame ====================`);


            for (const camera of cameras) {
              // Skip invalid camera
              if (!camera.scene || !camera.window) {
                continue;
              } // Setup camera configs


              this._setupCameraConfigs(camera, this._configs, this._cameraConfigs); // log(`Setup camera: ${camera.node!.name}, window: ${camera.window.renderWindowId}, isFull: ${this._cameraConfigs.enableFullPipeline}, `
              //     + `size: ${camera.window.width}x${camera.window.height}`);


              this._pipelineEvent.emit(PipelineEventType.RENDER_CAMERA_BEGIN, camera); // Build pipeline


              if (this._cameraConfigs.enableFullPipeline) {
                this._buildForwardPipeline(ppl, camera, camera.scene, this._passBuilders);
              } else {
                this._buildSimplePipeline(ppl, camera);
              }

              this._pipelineEvent.emit(PipelineEventType.RENDER_CAMERA_END, camera);
            }
          } // ----------------------------------------------------------------
          // Pipelines
          // ----------------------------------------------------------------


          _buildSimplePipeline(ppl, camera) {
            const width = Math.max(Math.floor(camera.window.width), 1);
            const height = Math.max(Math.floor(camera.window.height), 1);
            const colorName = this._cameraConfigs.colorName;
            const depthStencilName = this._cameraConfigs.depthStencilName;
            const viewport = camera.viewport; // Reduce C++/TS interop

            this._viewport.left = Math.round(viewport.x * width);
            this._viewport.top = Math.round(viewport.y * height); // Here we must use camera.viewport.width instead of camera.viewport.z, which
            // is undefined on native platform. The same as camera.viewport.height.

            this._viewport.width = Math.max(Math.round(viewport.width * width), 1);
            this._viewport.height = Math.max(Math.round(viewport.height * height), 1);
            const clearColor = camera.clearColor; // Reduce C++/TS interop

            this._clearColor.x = clearColor.x;
            this._clearColor.y = clearColor.y;
            this._clearColor.z = clearColor.z;
            this._clearColor.w = clearColor.w;
            const pass = ppl.addRenderPass(width, height, 'default'); // bind output render target

            if (forwardNeedClearColor(camera)) {
              pass.addRenderTarget(colorName, LoadOp.CLEAR, StoreOp.STORE, this._clearColor);
            } else {
              pass.addRenderTarget(colorName, LoadOp.LOAD, StoreOp.STORE);
            } // bind depth stencil buffer


            if (camera.clearFlag & ClearFlagBit.DEPTH_STENCIL) {
              pass.addDepthStencil(depthStencilName, LoadOp.CLEAR, StoreOp.DISCARD, camera.clearDepth, camera.clearStencil, camera.clearFlag & ClearFlagBit.DEPTH_STENCIL);
            } else {
              pass.addDepthStencil(depthStencilName, LoadOp.LOAD, StoreOp.DISCARD);
            }

            pass.setViewport(this._viewport); // The opaque queue is used for Reflection probe preview

            pass.addQueue(QueueHint.OPAQUE).addScene(camera, SceneFlags.OPAQUE); // The blend queue is used for UI and Gizmos

            let flags = SceneFlags.BLEND | SceneFlags.UI;

            if (this._cameraConfigs.enableProfiler) {
              flags |= SceneFlags.PROFILER;
              pass.showStatistics = true;
            }

            pass.addQueue(QueueHint.BLEND).addScene(camera, flags);
          }

          _buildForwardPipeline(ppl, camera, scene, passBuilders) {
            sortPipelinePassBuildersByRenderOrder(passBuilders);
            const context = {
              colorName: '',
              depthStencilName: ''
            };
            let lastPass = undefined;

            for (const builder of passBuilders) {
              if (builder.setup) {
                lastPass = builder.setup(ppl, this._configs, this._cameraConfigs, camera, context, lastPass);
              }
            }

            assert(this._cameraConfigs.remainingPasses === 0);
          }

          _initMaterials(ppl) {
            if (this._initialized) {
              return 0;
            }

            setupPipelineConfigs(ppl, this._configs); // When add new effect asset, please add its uuid to the dependentAssets in cc.config.json.

            this._copyAndTonemapMaterial._uuid = `builtin-pipeline-tone-mapping-material`;

            this._copyAndTonemapMaterial.initialize({
              effectName: 'pipeline/post-process/tone-mapping'
            });

            if (this._copyAndTonemapMaterial.effectAsset) {
              this._initialized = true;
            }

            return this._initialized ? 0 : 1;
          }

        }

        rendering.setCustomPipeline('Builtin', new BuiltinPipelineBuilder());
      } // if (rendering)


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9846cefb9cb6e16313f2e5e80bbb689314385757.js.map