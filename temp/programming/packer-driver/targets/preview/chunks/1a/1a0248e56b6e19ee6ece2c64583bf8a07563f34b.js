System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f9088esGbNBtJmNaJsz0Gq4", "ConstValue", undefined);

      _export("CELL_TYPE", CELL_TYPE = {
        EMPTY: 0,
        A: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        F: 6,
        BIRD: 7
      });

      _export("CELL_BASENUM", CELL_BASENUM = 6);

      _export("CELL_STATUS", CELL_STATUS = {
        COMMON: 0,
        CLICK: "click",
        LINE: "line",
        COLUMN: "column",
        WRAP: "wrap",
        BIRD: "bird"
      });

      _export("GRID_WIDTH", GRID_WIDTH = 9);

      _export("GRID_HEIGHT", GRID_HEIGHT = 9);

      _export("CELL_WIDTH", CELL_WIDTH = 70);

      _export("CELL_HEIGHT", CELL_HEIGHT = 70);

      _export("GRID_PIXEL_WIDTH", GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH);

      _export("GRID_PIXEL_HEIGHT", GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT); // ********************   时间表  animation time **************************


      _export("ANITIME", ANITIME = {
        TOUCH_MOVE: 0.3,
        DIE: 0.2,
        DOWN: 0.5,
        BOMB_DELAY: 0.3,
        BOMB_BIRD_DELAY: 0.7,
        DIE_SHAKE: 0.4 // 死前抖动

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1a0248e56b6e19ee6ece2c64583bf8a07563f34b.js.map