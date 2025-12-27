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
exports.MigrateManager = void 0;
const Animation_1 = require("./Animation");
const AnimationClip_1 = require("./AnimationClip");
const Asset_1 = require("./Asset");
const AudioClip_1 = require("./AudioClip");
const AudioSource_1 = require("./AudioSource");
const ArmatureDisplay_1 = require("./ArmatureDisplay"); // dragonBones.ArmatureDisplay
const BaseNode_1 = require("./BaseNode");
const Billboard_1 = require("./Billboard");
const BitmapFont_1 = require("./BitmapFont");
const BlockInputEvents_1 = require("./BlockInputEvents");
const BoxCollider_1 = require("./BoxCollider");
const BoxCollider2D_1 = require("./BoxCollider2D");
const BufferAsset_1 = require("./BufferAsset");
const Button_1 = require("./Button");
const Camera_1 = require("./Camera");
const Canvas_1 = require("./Canvas");
const CapsuleCollider_1 = require("./CapsuleCollider");
const CircleCollider2D_1 = require("./CircleCollider2D");
const Collider_1 = require("./Collider");
const Collider2D_1 = require("./Collider2D");
const CompPrefabInfo_1 = require("./CompPrefabInfo");
const CompactValueTypeArray_1 = require("./CompactValueTypeArray");
const Component_1 = require("./Component");
const ComponentModifier_1 = require("./ComponentModifier");
const ConeCollider_1 = require("./ConeCollider");
const ConstantForce_1 = require("./ConstantForce");
const Constraint_1 = require("./Constraint");
const CubicSplineNumberValue_1 = require("./CubicSplineNumberValue");
const CubicSplineValueClass_1 = require("./CubicSplineValueClass");
const CurveRange_1 = require("./CurveRange");
const CurveValueAdapter_1 = require("./CurveValueAdapter");
const CylinderCollider_1 = require("./CylinderCollider");
const DirectionalLight_1 = require("./DirectionalLight");
const DistanceJoint2D_1 = require("./DistanceJoint2D");
const EditBox_1 = require("./EditBox");
const EffectAsset_1 = require("./EffectAsset");
const EventHandler_1 = require("./EventHandler");
const FixedJoint2D_1 = require("./FixedJoint2D");
const Font_1 = require("./Font");
const ForwardFlow_1 = require("./ForwardFlow");
const ForwardPipeline_1 = require("./ForwardPipeline");
const ForwardStage_1 = require("./ForwardStage");
const Graphics_1 = require("./Graphics");
const HierachyModifier_1 = require("./HierachyModifier");
const HingeConstraint_1 = require("./HingeConstraint");
const HingeJoint2D_1 = require("./HingeJoint2D");
const ImageAsset_1 = require("./ImageAsset");
const JavaScript_1 = require("./JavaScript");
const Joint2D_1 = require("./Joint2D");
const JsonAsset_1 = require("./JsonAsset");
const Label_1 = require("./Label");
const LabelAtlas_1 = require("./LabelAtlas");
const LabelOutline_1 = require("./LabelOutline");
const LabelShadow_1 = require("./LabelShadow");
const Layout_1 = require("./Layout");
const Light_1 = require("./Light");
const Line_1 = require("./Line");
const Mask_1 = require("./Mask");
const Material_1 = require("./Material");
const Mesh_1 = require("./Mesh");
const MeshCollider_1 = require("./MeshCollider");
const MeshRenderer_1 = require("./MeshRenderer");
const ModelLightmapSettings_1 = require("./ModelLightmapSettings");
const MissingScript_1 = require("./MissingScript");
const MotionStreak_1 = require("./MotionStreak");
const MouseJoint2D_1 = require("./MouseJoint2D");
const Node_1 = require("./Node");
const PageView_1 = require("./PageView");
const PageViewIndicator_1 = require("./PageViewIndicator");
const ParticleAsset_1 = require("./ParticleAsset");
const ParticleSystem_1 = require("./ParticleSystem");
const ParticleSystem2D_1 = require("./ParticleSystem2D");
const PhysicsMaterial_1 = require("./PhysicsMaterial");
const PlaneCollider_1 = require("./PlaneCollider");
const PointToPointConstraint_1 = require("./PointToPointConstraint");
const PolygonCollider2D_1 = require("./PolygonCollider2D");
const Prefab_1 = require("./Prefab");
const PrefabInfo_1 = require("./PrefabInfo");
const Primitive_1 = require("./Primitive");
const PrivateNode_1 = require("./PrivateNode");
const ProgressBar_1 = require("./ProgressBar");
const RawAsset_1 = require("./RawAsset");
const RelativeJoint2D_1 = require("./RelativeJoint2D");
const RenderFlow_1 = require("./RenderFlow");
const RenderPipeline_1 = require("./RenderPipeline");
const RenderStage_1 = require("./RenderStage");
const RenderTexture_1 = require("./RenderTexture");
const RenderableComponent_1 = require("./RenderableComponent");
const RichText_1 = require("./RichText");
const RigidBody_1 = require("./RigidBody");
const RigidBody2D_1 = require("./RigidBody2D");
const SafeArea_1 = require("./SafeArea");
const Scene_1 = require("./Scene");
const SceneAsset_1 = require("./SceneAsset");
const Script_1 = require("./Script");
const ScrollBar_1 = require("./ScrollBar");
const ScrollView_1 = require("./ScrollView");
const ShadowFlow_1 = require("./ShadowFlow");
const ShadowStage_1 = require("./ShadowStage");
const SimplexCollider_1 = require("./SimplexCollider");
const Skeleton_1 = require("./Skeleton");
const SkeletalAnimation_1 = require("./SkeletalAnimation");
const SkinnedMeshBatchRenderer_1 = require("./SkinnedMeshBatchRenderer");
const SkinnedMeshRenderer_1 = require("./SkinnedMeshRenderer");
const SkinnedMeshUnit_1 = require("./SkinnedMeshUnit");
const Slider_1 = require("./Slider");
const SliderJoint2D_1 = require("./SliderJoint2D");
const SphereCollider_1 = require("./SphereCollider");
const SphereLight_1 = require("./SphereLight");
const SpotLight_1 = require("./SpotLight");
const SpringJoint2D_1 = require("./SpringJoint2D");
const Sprite_1 = require("./Sprite");
const SpriteAtlas_1 = require("./SpriteAtlas");
const SpriteFrame_1 = require("./SpriteFrame");
const SubContextView_1 = require("./SubContextView");
const TTFFont_1 = require("./TTFFont");
const TextAsset_1 = require("./TextAsset");
const Texture2D_1 = require("./Texture2D");
const TextureCube_1 = require("./TextureCube");
const TiledLayer_1 = require("./TiledLayer");
const TiledMap_1 = require("./TiledMap");
const TiledMapAsset_1 = require("./TiledMapAsset");
const TiledObjectGroup_1 = require("./TiledObjectGroup");
const TiledTile_1 = require("./TiledTile");
const TiledUserNodeData_1 = require("./TiledUserNodeData");
const Toggle_1 = require("./Toggle");
const ToggleContainer_1 = require("./ToggleContainer");
const TypeScript_1 = require("./TypeScript");
const UIComponent_1 = require("./UIComponent");
const UICoordinateTracker_1 = require("./UICoordinateTracker");
const UIMeshRenderer_1 = require("./UIMeshRenderer");
const UIOpacity_1 = require("./UIOpacity");
const UIRenderable_1 = require("./UIRenderable");
const UIReorderComponent_1 = require("./UIReorderComponent");
const UIStaticBatch_1 = require("./UIStaticBatch");
const UITransform_1 = require("./UITransform");
const UniformCurveValueAdapter_1 = require("./UniformCurveValueAdapter");
const VideoClip_1 = require("./VideoClip");
const VideoPlayer_1 = require("./VideoPlayer");
const ViewGroup_1 = require("./ViewGroup");
const WebView_1 = require("./WebView");
const WheelJoint2D_1 = require("./WheelJoint2D");
const Widget_1 = require("./Widget");
const AnimationCurve_1 = require("./AnimationCurve");
const Keyframe_1 = require("./Keyframe");
const AlphaKey_1 = require("./AlphaKey");
const Gradient_1 = require("./Gradient");
const GradientRange_1 = require("./GradientRange");
const Burst_1 = require("./Burst");
const ShapeModule_1 = require("./ShapeModule");
const ColorOvertimeModule_1 = require("./ColorOvertimeModule");
const SizeOvertimeModule_1 = require("./SizeOvertimeModule");
const VelocityOvertimeModule_1 = require("./VelocityOvertimeModule");
const ForceOvertimeModule_1 = require("./ForceOvertimeModule");
const LimitVelocityOvertimeModule_1 = require("./LimitVelocityOvertimeModule");
const RotationOvertimeModule_1 = require("./RotationOvertimeModule");
const TextureAnimationModule_1 = require("./TextureAnimationModule");
const ColorKey_1 = require("./ColorKey");
const TrailModule_1 = require("./TrailModule");
const base_1 = require("../common/base");
const SpSkeleton_1 = require("./SpSkeleton");
const StudioComponent_1 = require("./StudioComponent");
const StudioWidget_1 = require("./StudioWidget");
const utlis_1 = require("../common/utlis");
const CCCLASS_LIST = {
    'cc.Animation': Animation_1.Animation,
    'cc.AnimationClip': AnimationClip_1.AnimationClip,
    'cc.AnimationCurve': AnimationCurve_1.AnimationCurve,
    'cc.Asset': Asset_1.Asset,
    'cc.AlphaKey': AlphaKey_1.AlphaKey,
    'cc.AudioClip': AudioClip_1.AudioClip,
    'cc.AudioSource': AudioSource_1.AudioSource,
    'cc.Burst': Burst_1.Burst,
    'cc.Button': Button_1.Button,
    'cc.BaseNode': BaseNode_1.BaseNode,
    'cc.Billboard': Billboard_1.Billboard,
    'cc.BitmapFont': BitmapFont_1.BitmapFont,
    'cc.BoxCollider2D': BoxCollider2D_1.BoxCollider2D,
    'cc.BlockInputEvents': BlockInputEvents_1.BlockInputEvents,
    'cc.BufferAsset': BufferAsset_1.BufferAsset,
    'cc.BoxCollider': BoxCollider_1.BoxCollider,
    'cc.ColorKey': ColorKey_1.ColorKey,
    'cc.Camera': Camera_1.Camera,
    'cc.Canvas': Canvas_1.Canvas,
    'cc.CapsuleCollider': CapsuleCollider_1.CapsuleCollider,
    'cc.CircleCollider2D': CircleCollider2D_1.CircleCollider2D,
    'cc.Collider': Collider_1.Collider,
    'cc.Collider2D': Collider2D_1.Collider2D,
    'cc.CompPrefabInfo': CompPrefabInfo_1.CompPrefabInfo,
    'cc.CompactValueTypeArray': CompactValueTypeArray_1.CompactValueTypeArray,
    'cc.Component': Component_1.Component,
    'cc.ComponentModifier': ComponentModifier_1.ComponentModifier,
    'cc.ConeCollider': ConeCollider_1.ConeCollider,
    'cc.ConstantForce': ConstantForce_1.ConstantForce,
    'cc.Constraint': Constraint_1.Constraint,
    'cc.CubicSplineNumberValue': CubicSplineNumberValue_1.CubicSplineNumberValue,
    'cc.CubicSplineValueClass': CubicSplineValueClass_1.CubicSplineValueClass,
    'cc.CurveRange': CurveRange_1.CurveRange,
    'cc.CurveValueAdapter': CurveValueAdapter_1.CurveValueAdapter,
    'cc.CylinderCollider': CylinderCollider_1.CylinderCollider,
    'cc.ColorOvertimeModule': ColorOvertimeModule_1.ColorOvertimeModule,
    'cc.DirectionalLight': DirectionalLight_1.DirectionalLight,
    'cc.DistanceJoint2D': DistanceJoint2D_1.DistanceJoint2D,
    'cc.EditBox': EditBox_1.EditBox,
    'cc.EffectAsset': EffectAsset_1.EffectAsset,
    'cc.EventHandler': EventHandler_1.EventHandler,
    'cc.FixedJoint2D': FixedJoint2D_1.FixedJoint2D,
    'cc.Font': Font_1.Font,
    'cc.ForwardFlow': ForwardFlow_1.ForwardFlow,
    'cc.ForwardPipeline': ForwardPipeline_1.ForwardPipeline,
    'cc.ForwardStage': ForwardStage_1.ForwardStage,
    'cc.ForceOvertimeModule': ForceOvertimeModule_1.ForceOvertimeModule,
    'cc.Graphics': Graphics_1.Graphics,
    'cc.Gradient': Gradient_1.Gradient,
    'cc.GradientRange': GradientRange_1.GradientRange,
    'cc.HierachyModifier': HierachyModifier_1.HierachyModifier,
    'cc.HingeConstraint': HingeConstraint_1.HingeConstraint,
    'cc.HingeJoint2D': HingeJoint2D_1.HingeJoint2D,
    'cc.ImageAsset': ImageAsset_1.ImageAsset,
    'cc.JavaScript': JavaScript_1.JavaScript,
    'cc.Joint2D': Joint2D_1.Joint2D,
    'cc.JsonAsset': JsonAsset_1.JsonAsset,
    'cc.Keyframe': Keyframe_1.Keyframe,
    'cc.Label': Label_1.Label,
    'cc.LabelAtlas': LabelAtlas_1.LabelAtlas,
    'cc.LabelOutline': LabelOutline_1.LabelOutline,
    'cc.LabelShadow': LabelShadow_1.LabelShadow,
    'cc.Layout': Layout_1.Layout,
    'cc.Light': Light_1.Light,
    'cc.Line': Line_1.Line,
    'cc.LimitVelocityOvertimeModule': LimitVelocityOvertimeModule_1.LimitVelocityOvertimeModule,
    'cc.Mask': Mask_1.Mask,
    'cc.Material': Material_1.Material,
    'cc.Mesh': Mesh_1.Mesh,
    'cc.MeshCollider': MeshCollider_1.MeshCollider,
    'cc.MeshRenderer': MeshRenderer_1.MeshRenderer,
    'cc.ModelLightmapSettings': ModelLightmapSettings_1.ModelLightmapSettings,
    'cc.MissingScript': MissingScript_1.MissingScript,
    'cc.MotionStreak': MotionStreak_1.MotionStreak,
    'cc.MouseJoint2D': MouseJoint2D_1.MouseJoint2D,
    'cc.Node': Node_1.Node,
    'cc.PageView': PageView_1.PageView,
    'cc.PageViewIndicator': PageViewIndicator_1.PageViewIndicator,
    'cc.ParticleAsset': ParticleAsset_1.ParticleAsset,
    'cc.ParticleSystem': ParticleSystem_1.ParticleSystem,
    'cc.ParticleSystem2D': ParticleSystem2D_1.ParticleSystem2D,
    'cc.PhysicsMaterial': PhysicsMaterial_1.PhysicsMaterial,
    'cc.PlaneCollider': PlaneCollider_1.PlaneCollider,
    'cc.PointToPointConstraint': PointToPointConstraint_1.PointToPointConstraint,
    'cc.PolygonCollider2D': PolygonCollider2D_1.PolygonCollider2D,
    'cc.Prefab': Prefab_1.Prefab,
    'cc.PrefabInfo': PrefabInfo_1.PrefabInfo,
    'cc.Primitive': Primitive_1.Primitive,
    'cc.PrivateNode': PrivateNode_1.PrivateNode,
    'cc.ProgressBar': ProgressBar_1.ProgressBar,
    'cc.RawAsset': RawAsset_1.RawAsset,
    'cc.RenderFlow': RenderFlow_1.RenderFlow,
    'cc.RenderStage': RenderStage_1.RenderStage,
    'cc.RichText': RichText_1.RichText,
    'cc.RigidBody': RigidBody_1.RigidBody,
    'cc.RigidBody2D': RigidBody2D_1.RigidBody2D,
    'cc.RenderTexture': RenderTexture_1.RenderTexture,
    'cc.RenderPipeline': RenderPipeline_1.RenderPipeline,
    'cc.RelativeJoint2D': RelativeJoint2D_1.RelativeJoint2D,
    'cc.RenderableComponent': RenderableComponent_1.RenderableComponent,
    'cc.RotationOvertimeModule': RotationOvertimeModule_1.RotationOvertimeModule,
    'cc.ShapeModule': ShapeModule_1.ShapeModule,
    'cc.SafeArea': SafeArea_1.SafeArea,
    'cc.Scene': Scene_1.Scene,
    'cc.SceneAsset': SceneAsset_1.SceneAsset,
    'cc.Script': Script_1.Script,
    'cc.Scrollbar': ScrollBar_1.Scrollbar,
    'cc.ScrollView': ScrollView_1.ScrollView,
    'cc.ShadowFlow': ShadowFlow_1.ShadowFlow,
    'cc.ShadowStage': ShadowStage_1.ShadowStage,
    'cc.SimplexCollider': SimplexCollider_1.SimplexCollider,
    'cc.Skeleton': Skeleton_1.Skeleton,
    'cc.SkeletalAnimation': SkeletalAnimation_1.SkeletalAnimation,
    'cc.SkinnedMeshBatchRenderer': SkinnedMeshBatchRenderer_1.SkinnedMeshBatchRenderer,
    'cc.SkinnedMeshRenderer': SkinnedMeshRenderer_1.SkinnedMeshRenderer,
    'cc.SkinnedMeshUnit': SkinnedMeshUnit_1.SkinnedMeshUnit,
    'cc.Slider': Slider_1.Slider,
    'cc.SliderJoint2D': SliderJoint2D_1.SliderJoint2D,
    'cc.SphereCollider': SphereCollider_1.SphereCollider,
    'cc.SphereLight': SphereLight_1.SphereLight,
    'cc.SpotLight': SpotLight_1.SpotLight,
    'cc.SpringJoint2D': SpringJoint2D_1.SpringJoint2D,
    'cc.Sprite': Sprite_1.Sprite,
    'cc.SpriteAtlas': SpriteAtlas_1.SpriteAtlas,
    'cc.SpriteFrame': SpriteFrame_1.SpriteFrame,
    'cc.SubContextView': SubContextView_1.SubContextView,
    'cc.SizeOvertimeModule': SizeOvertimeModule_1.SizeOvertimeModule,
    'cc.TTFFont': TTFFont_1.TTFFont,
    'cc.TextAsset': TextAsset_1.TextAsset,
    'cc.Texture2D': Texture2D_1.Texture2D,
    'cc.TextureCube': TextureCube_1.TextureCube,
    'cc.TiledLayer': TiledLayer_1.TiledLayer,
    'cc.TiledMap': TiledMap_1.TiledMap,
    'cc.TiledMapAsset': TiledMapAsset_1.TiledMapAsset,
    'cc.TiledObjectGroup': TiledObjectGroup_1.TiledObjectGroup,
    'cc.TiledTile': TiledTile_1.TiledTile,
    'cc.TiledUserNodeData': TiledUserNodeData_1.TiledUserNodeData,
    'cc.Toggle': Toggle_1.Toggle,
    'cc.ToggleContainer': ToggleContainer_1.ToggleContainer,
    'cc.TypeScript': TypeScript_1.TypeScript,
    'cc.TextureAnimationModule': TextureAnimationModule_1.TextureAnimationModule,
    'cc.TrailModule': TrailModule_1.TrailModule,
    'cc.UIComponent': UIComponent_1.UIComponent,
    'cc.UICoordinateTracker': UICoordinateTracker_1.UICoordinateTracker,
    'cc.UIMeshRenderer': UIMeshRenderer_1.UIMeshRenderer,
    'cc.UIOpacity': UIOpacity_1.UIOpacity,
    'cc.UIRenderable': UIRenderable_1.UIRenderable,
    'cc.UIReorderComponent': UIReorderComponent_1.UIReorderComponent,
    'cc.UIStaticBatch': UIStaticBatch_1.UIStaticBatch,
    'cc.UITransform': UITransform_1.UITransform,
    'cc.UniformCurveValueAdapter': UniformCurveValueAdapter_1.UniformCurveValueAdapter,
    'cc.VideoClip': VideoClip_1.VideoClip,
    'cc.VideoPlayer': VideoPlayer_1.VideoPlayer,
    'cc.ViewGroup': ViewGroup_1.ViewGroup,
    'cc.VelocityOvertimeModule': VelocityOvertimeModule_1.VelocityOvertimeModule,
    'cc.WebView': WebView_1.WebView,
    'cc.WheelJoint2D': WheelJoint2D_1.WheelJoint2D,
    'cc.Widget': Widget_1.Widget,
    'dragonBones.ArmatureDisplay': ArmatureDisplay_1.ArmatureDisplay,
    'sp.Skeleton': SpSkeleton_1.Sp_Skeleton,
    'cc.StudioComponent': StudioComponent_1.StudioComponent,
    'cc.StudioWidget': StudioWidget_1.StudioWidget,
};
const RENAME_COMPONENT = {
    'cc.BoxCollider3D': 'cc.BoxCollider',
    'cc.BoxCollider': 'cc.BoxCollider2D',
    'cc.PhysicsBoxCollider': 'cc.BoxCollider2D',
    'cc.CircleCollider': 'cc.CircleCollider2D',
    'cc.PhysicsCircleCollider': 'cc.CircleCollider2D',
    'cc.Collider': 'cc.Collider2D',
    'cc.PhysicsCollider': 'cc.Collider2D',
    'cc.PhysicsChainCollider': 'cc.Collider2D',
    'cc.Collider3D': 'cc.Collider',
    'cc.DistanceJoint': 'cc.DistanceJoint2D',
    'cc.ClickEvent': 'cc.EventHandler',
    'cc.MouseJoint': 'cc.MouseJoint2D',
    'cc.WheelJoint': 'cc.WheelJoint2D',
    'cc.PolygonCollider': 'cc.PolygonCollider2D',
    'cc.PhysicsPolygonCollider': 'cc.PolygonCollider2D',
    'cc.ParticleSystem': 'cc.ParticleSystem2D',
    'cc.ParticleSystem3D': 'cc.ParticleSystem',
    'cc.Joint': 'cc.Joint2D',
    'cc.RigidBody': 'cc.RigidBody2D',
    'cc.RigidBody3D': 'cc.RigidBody',
    'cc.SphereCollider3D': 'cc.SphereCollider',
    'cc.RenderComponent': 'cc.UIRenderable',
    'cc.SkeletonAnimation': 'cc.SkeletalAnimation',
    'cc.StudioWidget': 'cc.Widget',
};
class MigrateManager {
    static migrate(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const element2D = json2D[index];
            let type = element2D.__type__ || element2D[0].__type__; // 粒子存的是数组
            if (type === 'cc.Light') {
                switch (element2D._type) {
                    case 0:
                        type = 'cc.DirectionalLight';
                        break;
                    case 1:
                        type = 'cc.PointLight';
                        break;
                    case 2:
                        type = 'cc.SpotLight';
                        break;
                    case 3: // 环境不支持，已导入到场景中，而且实现也不一样
                        break;
                }
            }
            const renameTyep = RENAME_COMPONENT[type];
            if (renameTyep) {
                type = renameTyep;
            }
            // @ts-ignore
            const CCClass = CCCLASS_LIST[type];
            if (CCClass) {
                return yield CCClass.apply(index, json2D, json3D);
            }
            else {
                if (type.startsWith('cc.')) {
                    if (!MigrateManager.logs.includes(type)) {
                        MigrateManager.logs.push(type);
                    }
                    // console.log('未适配类型：' + type + ' ' + index);
                }
                let source = {};
                for (const key in element2D) {
                    let value = element2D[key];
                    if (value && value.__uuid__) {
                        value.__uuid__ = yield base_1.ImporterBase.getUuid(value.__uuid__);
                    }
                    else if (key === '_srcBlendFactor' || key === '_dstBlendFactor') {
                        value = (0, utlis_1.getBlendFactor2DTo3D)(value);
                        if (!source._color) {
                            source._color = (0, utlis_1.getColor)(json2D[element2D.node.__id__]);
                        }
                    }
                    source[key] = value;
                }
                let content = JSON.stringify(source, undefined, 2);
                const __uuids__ = content.match(/(?<=__uuid__": ")(.*)(?=")/g) || [];
                for (let uuid of __uuids__) {
                    const oldUuid = uuid;
                    uuid = (yield base_1.ImporterBase.getUuid(uuid));
                    content = content.replace(oldUuid, uuid);
                }
                source = JSON.parse(content);
                json3D.splice(index, 1, source);
                return source;
            }
        });
    }
}
exports.MigrateManager = MigrateManager;
MigrateManager.logs = [];
