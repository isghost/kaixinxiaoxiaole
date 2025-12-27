import { Animation } from "./Animation";
import { AnimationClip } from "./AnimationClip";
import { Asset } from "./Asset";
import { AudioClip } from "./AudioClip";
import { AudioSource } from "./AudioSource";
import { ArmatureDisplay } from "./ArmatureDisplay";// dragonBones.ArmatureDisplay
import { BaseNode } from "./BaseNode";
import { Billboard } from "./Billboard";
import { BitmapFont } from "./BitmapFont";
import { BlockInputEvents } from "./BlockInputEvents";
import { BoxCollider } from "./BoxCollider";
import { BoxCollider2D } from "./BoxCollider2D";
import { BufferAsset } from "./BufferAsset";
import { Button } from "./Button";
import { Camera } from "./Camera";
import { Canvas } from "./Canvas";
import { CapsuleCollider } from "./CapsuleCollider";
import { CircleCollider2D } from "./CircleCollider2D";
import { Collider } from "./Collider";
import { Collider2D } from "./Collider2D";
import { CompPrefabInfo } from "./CompPrefabInfo";
import { CompactValueTypeArray } from "./CompactValueTypeArray";
import { Component } from "./Component";
import { ComponentModifier } from "./ComponentModifier";
import { ConeCollider } from "./ConeCollider";
import { ConstantForce } from "./ConstantForce";
import { Constraint } from "./Constraint";
import { CubicSplineNumberValue } from "./CubicSplineNumberValue";
import { CubicSplineValueClass } from "./CubicSplineValueClass";
import { CurveRange } from "./CurveRange";
import { CurveValueAdapter } from "./CurveValueAdapter";
import { CylinderCollider } from "./CylinderCollider";
import { DirectionalLight } from "./DirectionalLight";
import { DistanceJoint2D } from "./DistanceJoint2D";
import { EditBox } from "./EditBox";
import { EffectAsset } from "./EffectAsset";
import { EventHandler } from "./EventHandler";
import { FixedJoint2D } from "./FixedJoint2D";
import { Font } from "./Font";
import { ForwardFlow } from "./ForwardFlow";
import { ForwardPipeline } from "./ForwardPipeline";
import { ForwardStage } from "./ForwardStage";
import { Graphics } from "./Graphics";
import { HierachyModifier } from "./HierachyModifier";
import { HingeConstraint } from "./HingeConstraint";
import { HingeJoint2D } from "./HingeJoint2D";
import { ImageAsset } from "./ImageAsset";
import { JavaScript } from "./JavaScript";
import { Joint2D } from "./Joint2D";
import { JsonAsset } from "./JsonAsset";
import { Label } from "./Label";
import { LabelAtlas } from "./LabelAtlas";
import { LabelOutline } from "./LabelOutline";
import { LabelShadow } from "./LabelShadow";
import { Layout } from "./Layout";
import { Light } from "./Light";
import { Line } from "./Line";
import { Mask } from "./Mask";
import { Material } from "./Material";
import { Mesh } from "./Mesh";
import { MeshCollider } from "./MeshCollider";
import { MeshRenderer } from "./MeshRenderer";
import { ModelLightmapSettings } from "./ModelLightmapSettings";
import { MissingScript } from "./MissingScript";
import { MotionStreak } from "./MotionStreak";
import { MouseJoint2D } from "./MouseJoint2D";
import { Node } from "./Node";
import { PageView } from "./PageView";
import { PageViewIndicator } from "./PageViewIndicator";
import { ParticleAsset } from "./ParticleAsset";
import { ParticleSystem } from "./ParticleSystem";
import { ParticleSystem2D } from "./ParticleSystem2D";
import { PhysicsMaterial } from "./PhysicsMaterial";
import { PlaneCollider } from "./PlaneCollider";
import { PointToPointConstraint } from "./PointToPointConstraint";
import { PolygonCollider2D } from "./PolygonCollider2D";
import { Prefab } from "./Prefab";
import { PrefabInfo } from "./PrefabInfo";
import { Primitive } from "./Primitive";
import { PrivateNode } from "./PrivateNode";
import { ProgressBar } from "./ProgressBar";
import { RawAsset } from "./RawAsset";
import { RelativeJoint2D } from "./RelativeJoint2D";
import { RenderFlow } from "./RenderFlow";
import { RenderPipeline } from "./RenderPipeline";
import { RenderStage } from "./RenderStage";
import { RenderTexture } from "./RenderTexture";
import { RenderableComponent } from "./RenderableComponent";
import { RichText } from "./RichText";
import { RigidBody } from "./RigidBody";
import { RigidBody2D } from "./RigidBody2D";
import { SafeArea } from "./SafeArea";
import { Scene } from "./Scene";
import { SceneAsset } from "./SceneAsset";
import { Script } from "./Script";
import { Scrollbar } from "./ScrollBar";
import { ScrollView } from "./ScrollView";
import { ShadowFlow } from "./ShadowFlow";
import { ShadowStage } from "./ShadowStage";
import { SimplexCollider } from "./SimplexCollider";
import { Skeleton } from "./Skeleton";
import { SkeletalAnimation } from "./SkeletalAnimation";
import { SkinnedMeshBatchRenderer } from "./SkinnedMeshBatchRenderer";
import { SkinnedMeshRenderer } from "./SkinnedMeshRenderer";
import { SkinnedMeshUnit } from "./SkinnedMeshUnit";
import { Slider } from "./Slider";
import { SliderJoint2D } from "./SliderJoint2D";
import { SphereCollider } from "./SphereCollider";
import { SphereLight } from "./SphereLight";
import { SpotLight } from "./SpotLight";
import { SpringJoint2D } from "./SpringJoint2D";
import { Sprite } from "./Sprite";
import { SpriteAtlas } from "./SpriteAtlas";
import { SpriteFrame } from "./SpriteFrame";
import { SubContextView } from "./SubContextView";
import { TTFFont } from "./TTFFont";
import { TextAsset } from "./TextAsset";
import { Texture2D } from "./Texture2D";
import { TextureCube } from "./TextureCube";
import { TiledLayer } from "./TiledLayer";
import { TiledMap } from "./TiledMap";
import { TiledMapAsset } from "./TiledMapAsset";
import { TiledObjectGroup } from "./TiledObjectGroup";
import { TiledTile } from "./TiledTile";
import { TiledUserNodeData } from "./TiledUserNodeData";
import { Toggle } from "./Toggle";
import { ToggleContainer } from "./ToggleContainer";
import { TypeScript } from "./TypeScript";
import { UIComponent } from "./UIComponent";
import { UICoordinateTracker } from "./UICoordinateTracker";
import { UIMeshRenderer } from "./UIMeshRenderer";
import { UIOpacity } from "./UIOpacity";
import { UIRenderable } from "./UIRenderable";
import { UIReorderComponent } from "./UIReorderComponent";
import { UIStaticBatch } from "./UIStaticBatch";
import { UITransform } from "./UITransform";
import { UniformCurveValueAdapter } from "./UniformCurveValueAdapter";
import { VideoClip } from "./VideoClip";
import { VideoPlayer } from "./VideoPlayer";
import { ViewGroup } from "./ViewGroup";
import { WebView } from "./WebView";
import { WheelJoint2D } from "./WheelJoint2D";
import { Widget } from "./Widget";
import { AnimationCurve } from "./AnimationCurve";
import { Keyframe } from "./Keyframe";
import { AlphaKey } from "./AlphaKey";
import { Gradient } from "./Gradient";
import { GradientRange } from "./GradientRange";
import { Burst } from "./Burst";
import { ShapeModule } from "./ShapeModule";
import { ColorOvertimeModule } from "./ColorOvertimeModule";
import { SizeOvertimeModule } from "./SizeOvertimeModule";
import { VelocityOvertimeModule } from "./VelocityOvertimeModule";
import { ForceOvertimeModule } from "./ForceOvertimeModule";
import { LimitVelocityOvertimeModule } from "./LimitVelocityOvertimeModule";
import { RotationOvertimeModule } from "./RotationOvertimeModule";
import { TextureAnimationModule } from "./TextureAnimationModule";
import { ColorKey } from "./ColorKey";
import { TrailModule } from "./TrailModule";
import { ImporterBase } from "../common/base";
import { Sp_Skeleton } from "./SpSkeleton";
import { StudioComponent } from "./StudioComponent";
import { StudioWidget } from "./StudioWidget";
import { getBlendFactor2DTo3D, getColor } from "../common/utlis";

const CCCLASS_LIST = {
    'cc.Animation': Animation,
    'cc.AnimationClip': AnimationClip,
    'cc.AnimationCurve': AnimationCurve,
    'cc.Asset': Asset,
    'cc.AlphaKey': AlphaKey,
    'cc.AudioClip': AudioClip,
    'cc.AudioSource': AudioSource,
    'cc.Burst': Burst,
    'cc.Button': Button,
    'cc.BaseNode': BaseNode,
    'cc.Billboard': Billboard,
    'cc.BitmapFont': BitmapFont,
    'cc.BoxCollider2D': BoxCollider2D,
    'cc.BlockInputEvents': BlockInputEvents,
    'cc.BufferAsset': BufferAsset,
    'cc.BoxCollider': BoxCollider,
    'cc.ColorKey': ColorKey,
    'cc.Camera': Camera,
    'cc.Canvas': Canvas,
    'cc.CapsuleCollider': CapsuleCollider,
    'cc.CircleCollider2D': CircleCollider2D,
    'cc.Collider': Collider,
    'cc.Collider2D': Collider2D,
    'cc.CompPrefabInfo': CompPrefabInfo,
    'cc.CompactValueTypeArray': CompactValueTypeArray,
    'cc.Component': Component,
    'cc.ComponentModifier': ComponentModifier,
    'cc.ConeCollider': ConeCollider,
    'cc.ConstantForce': ConstantForce,
    'cc.Constraint': Constraint,
    'cc.CubicSplineNumberValue': CubicSplineNumberValue,
    'cc.CubicSplineValueClass': CubicSplineValueClass,
    'cc.CurveRange': CurveRange,
    'cc.CurveValueAdapter': CurveValueAdapter,
    'cc.CylinderCollider': CylinderCollider,
    'cc.ColorOvertimeModule': ColorOvertimeModule,
    'cc.DirectionalLight': DirectionalLight,
    'cc.DistanceJoint2D': DistanceJoint2D,
    'cc.EditBox': EditBox,
    'cc.EffectAsset': EffectAsset,
    'cc.EventHandler': EventHandler,
    'cc.FixedJoint2D': FixedJoint2D,
    'cc.Font': Font,
    'cc.ForwardFlow': ForwardFlow,
    'cc.ForwardPipeline': ForwardPipeline,
    'cc.ForwardStage': ForwardStage,
    'cc.ForceOvertimeModule': ForceOvertimeModule,
    'cc.Graphics': Graphics,
    'cc.Gradient': Gradient,
    'cc.GradientRange': GradientRange,
    'cc.HierachyModifier': HierachyModifier,
    'cc.HingeConstraint': HingeConstraint,
    'cc.HingeJoint2D': HingeJoint2D,
    'cc.ImageAsset': ImageAsset,
    'cc.JavaScript': JavaScript,
    'cc.Joint2D': Joint2D,
    'cc.JsonAsset': JsonAsset,
    'cc.Keyframe': Keyframe,
    'cc.Label': Label,
    'cc.LabelAtlas': LabelAtlas,
    'cc.LabelOutline': LabelOutline,
    'cc.LabelShadow': LabelShadow,
    'cc.Layout': Layout,
    'cc.Light': Light,
    'cc.Line': Line,
    'cc.LimitVelocityOvertimeModule': LimitVelocityOvertimeModule,
    'cc.Mask': Mask,
    'cc.Material': Material,
    'cc.Mesh': Mesh,
    'cc.MeshCollider': MeshCollider,
    'cc.MeshRenderer': MeshRenderer,
    'cc.ModelLightmapSettings': ModelLightmapSettings,
    'cc.MissingScript': MissingScript,
    'cc.MotionStreak': MotionStreak,
    'cc.MouseJoint2D': MouseJoint2D,
    'cc.Node': Node,
    'cc.PageView': PageView,
    'cc.PageViewIndicator': PageViewIndicator,
    'cc.ParticleAsset': ParticleAsset,
    'cc.ParticleSystem': ParticleSystem,
    'cc.ParticleSystem2D': ParticleSystem2D,
    'cc.PhysicsMaterial': PhysicsMaterial,
    'cc.PlaneCollider': PlaneCollider,
    'cc.PointToPointConstraint': PointToPointConstraint,
    'cc.PolygonCollider2D': PolygonCollider2D,
    'cc.Prefab': Prefab,
    'cc.PrefabInfo': PrefabInfo,
    'cc.Primitive': Primitive,
    'cc.PrivateNode': PrivateNode,
    'cc.ProgressBar': ProgressBar,
    'cc.RawAsset': RawAsset,
    'cc.RenderFlow': RenderFlow,
    'cc.RenderStage': RenderStage,
    'cc.RichText': RichText,
    'cc.RigidBody': RigidBody,
    'cc.RigidBody2D': RigidBody2D,
    'cc.RenderTexture': RenderTexture,
    'cc.RenderPipeline': RenderPipeline,
    'cc.RelativeJoint2D': RelativeJoint2D,
    'cc.RenderableComponent': RenderableComponent,
    'cc.RotationOvertimeModule': RotationOvertimeModule,
    'cc.ShapeModule': ShapeModule,
    'cc.SafeArea': SafeArea,
    'cc.Scene': Scene,
    'cc.SceneAsset': SceneAsset,
    'cc.Script': Script,
    'cc.Scrollbar': Scrollbar,
    'cc.ScrollView': ScrollView,
    'cc.ShadowFlow': ShadowFlow,
    'cc.ShadowStage': ShadowStage,
    'cc.SimplexCollider': SimplexCollider,
    'cc.Skeleton': Skeleton,
    'cc.SkeletalAnimation': SkeletalAnimation,
    'cc.SkinnedMeshBatchRenderer': SkinnedMeshBatchRenderer,
    'cc.SkinnedMeshRenderer': SkinnedMeshRenderer,
    'cc.SkinnedMeshUnit': SkinnedMeshUnit,
    'cc.Slider': Slider,
    'cc.SliderJoint2D': SliderJoint2D,
    'cc.SphereCollider': SphereCollider,
    'cc.SphereLight': SphereLight,
    'cc.SpotLight': SpotLight,
    'cc.SpringJoint2D': SpringJoint2D,
    'cc.Sprite': Sprite,
    'cc.SpriteAtlas': SpriteAtlas,
    'cc.SpriteFrame': SpriteFrame,
    'cc.SubContextView': SubContextView,
    'cc.SizeOvertimeModule': SizeOvertimeModule,
    'cc.TTFFont': TTFFont,
    'cc.TextAsset': TextAsset,
    'cc.Texture2D': Texture2D,
    'cc.TextureCube': TextureCube,
    'cc.TiledLayer': TiledLayer,
    'cc.TiledMap': TiledMap,
    'cc.TiledMapAsset': TiledMapAsset,
    'cc.TiledObjectGroup': TiledObjectGroup,
    'cc.TiledTile': TiledTile,
    'cc.TiledUserNodeData': TiledUserNodeData,
    'cc.Toggle': Toggle,
    'cc.ToggleContainer': ToggleContainer,
    'cc.TypeScript': TypeScript,
    'cc.TextureAnimationModule': TextureAnimationModule,
    'cc.TrailModule': TrailModule,
    'cc.UIComponent': UIComponent,
    'cc.UICoordinateTracker': UICoordinateTracker,
    'cc.UIMeshRenderer': UIMeshRenderer,
    'cc.UIOpacity': UIOpacity,
    'cc.UIRenderable': UIRenderable,
    'cc.UIReorderComponent': UIReorderComponent,
    'cc.UIStaticBatch': UIStaticBatch,
    'cc.UITransform': UITransform,
    'cc.UniformCurveValueAdapter': UniformCurveValueAdapter,
    'cc.VideoClip': VideoClip,
    'cc.VideoPlayer': VideoPlayer,
    'cc.ViewGroup': ViewGroup,
    'cc.VelocityOvertimeModule': VelocityOvertimeModule,
    'cc.WebView': WebView,
    'cc.WheelJoint2D': WheelJoint2D,
    'cc.Widget': Widget,
    'dragonBones.ArmatureDisplay': ArmatureDisplay,
    'sp.Skeleton': Sp_Skeleton,
    'cc.StudioComponent': StudioComponent,
    'cc.StudioWidget': StudioWidget,
};

const RENAME_COMPONENT: any = {
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

export class MigrateManager {
    static logs: string[] = [];

    static async migrate(index: number, json2D: any, json3D: any) {
        const element2D = json2D[index];
        let type = element2D.__type__ || element2D[0].__type__;// 粒子存的是数组

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
                case 3:// 环境不支持，已导入到场景中，而且实现也不一样
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
            return await CCClass.apply(index, json2D, json3D);
        }
        else {
            if (type.startsWith('cc.')) {
                if (!MigrateManager.logs.includes(type)) {
                    MigrateManager.logs.push(type);
                }
                // console.log('未适配类型：' + type + ' ' + index);
            }
            let source: any = {};
            for (const key in element2D) {
                let value = element2D[key];
                if (value && value.__uuid__) {
                    value.__uuid__ = await ImporterBase.getUuid(value.__uuid__);
                }
                else if (key === '_srcBlendFactor' || key === '_dstBlendFactor') {
                    value = getBlendFactor2DTo3D(value);
                    if (!source._color) {
                        source._color = getColor(json2D[element2D.node.__id__]);
                    }
                }
                source[key] = value;
            }
            let content = JSON.stringify(source, undefined, 2);
            const __uuids__ = content.match(/(?<=__uuid__": ")(.*)(?=")/g) || [];
            for (let uuid of __uuids__) {
                const oldUuid = uuid;
                uuid = await ImporterBase.getUuid(uuid) as string;
                content = content.replace(oldUuid, uuid);
            }
            source = JSON.parse(content);
            json3D.splice(index, 1, source);
            return source;
        }
    }
}
