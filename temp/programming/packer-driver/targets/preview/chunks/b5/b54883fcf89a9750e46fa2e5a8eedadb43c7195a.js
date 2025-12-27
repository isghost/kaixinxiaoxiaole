System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd;

  /**
   * 合并
   * @param rowPoints
   * @param colPoints
   */

  /**
   * 减法
   * @param points
   * @param exclusivePoint
   */
  function mergePointArray(rowPoints, colPoints) {
    var result = rowPoints.concat();
    colPoints = colPoints.filter(function (colEle) {
      var repeat = false;
      result.forEach(function (rowEle) {
        if (colEle.equals(rowEle)) {
          repeat = true;
        }
      }, this);
      return !repeat;
    }, this);
    result.push(...colPoints);
    return result;
  }

  function exclusivePoint(points, exclusivePoint) {
    var result = new Array();

    for (var point of points) {
      if (!point.equals(exclusivePoint)) {
        result.push(point);
      }
    }

    return result;
  }

  _export({
    mergePointArray: mergePointArray,
    exclusivePoint: exclusivePoint
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5a4d0rEszhGNqSG/EcGQQi5", "ModelUtils", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b54883fcf89a9750e46fa2e5a8eedadb43c7195a.js.map