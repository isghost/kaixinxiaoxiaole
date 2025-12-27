System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, GameModelTest;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "16fce9lOkpA7a2vuhmMkDMZ", "GameModelTest", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass
      } = _decorator);

      _export("GameModelTest", GameModelTest = (_dec = ccclass('GameModelTest'), _dec(_class = class GameModelTest extends Component {}) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // cc.Class({
      //     extends: cc.Component,
      // 
      //     properties: {
      //         // foo: {
      //         //    default: null,      // The default value will be used only when the component attaching
      //         //                           to a node for the first time
      //         //    url: cc.Texture2D,  // optional, default is typeof default
      //         //    serializable: true, // optional, default is true
      //         //    visible: true,      // optional, default is true
      //         //    displayName: 'Foo', // optional
      //         //    readonly: false,    // optional, default is false
      //         // },
      //         // ...
      //     },
      // 
      //     // use this for initialization
      //     // onLoad: function () {
      //     //     var gameModel = new GameModel();
      //     //     gameModel.init();
      //     //     gameModel.printInfo();
      //     //     for(var i = 1;i<=9;i++){
      //     //         for(var j = 1;j<=9;j++){
      //     //             console.log(gameModel.checkPoint(i,j).join(" ,"));
      //     //         }
      //     //     }
      //     // },
      // 
      //     // called every frame, uncomment this function to activate update callback
      //     // update: function (dt) {
      // 
      //     // },
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ec6789c69a89c81fc57425b0479bc5fd551bf998.js.map