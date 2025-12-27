System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, CellModel, mergePointArray, exclusivePoint, CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME, GameModel, _crd;

  function _reportPossibleCrUseOfCellModel(extras) {
    _reporterNs.report("CellModel", "./CellModel", _context.meta, extras);
  }

  function _reportPossibleCrUseOfmergePointArray(extras) {
    _reporterNs.report("mergePointArray", "../Utils/ModelUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfexclusivePoint(extras) {
    _reporterNs.report("exclusivePoint", "../Utils/ModelUtils", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCELL_TYPE(extras) {
    _reporterNs.report("CELL_TYPE", "./ConstValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCELL_BASENUM(extras) {
    _reporterNs.report("CELL_BASENUM", "./ConstValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCELL_STATUS(extras) {
    _reporterNs.report("CELL_STATUS", "./ConstValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGRID_WIDTH(extras) {
    _reporterNs.report("GRID_WIDTH", "./ConstValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGRID_HEIGHT(extras) {
    _reporterNs.report("GRID_HEIGHT", "./ConstValue", _context.meta, extras);
  }

  function _reportPossibleCrUseOfANITIME(extras) {
    _reporterNs.report("ANITIME", "./ConstValue", _context.meta, extras);
  }

  _export("default", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      CellModel = _unresolved_2.default;
    }, function (_unresolved_3) {
      mergePointArray = _unresolved_3.mergePointArray;
      exclusivePoint = _unresolved_3.exclusivePoint;
    }, function (_unresolved_4) {
      CELL_TYPE = _unresolved_4.CELL_TYPE;
      CELL_BASENUM = _unresolved_4.CELL_BASENUM;
      CELL_STATUS = _unresolved_4.CELL_STATUS;
      GRID_WIDTH = _unresolved_4.GRID_WIDTH;
      GRID_HEIGHT = _unresolved_4.GRID_HEIGHT;
      ANITIME = _unresolved_4.ANITIME;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cc442HaMlBE/ZKi7W/YUKwd", "GameModel", undefined);

      _export("default", GameModel = class GameModel {
        constructor() {
          this.cells = null;
          this.cellBgs = null;
          this.lastPos = cc.v2(-1, -1);
          this.cellTypeNum = 5;
          this.cellCreateType = []; // 升成种类只在这个数组里面查找
        }

        init(cellTypeNum) {
          this.cells = [];
          this.setCellTypeNum(cellTypeNum || this.cellTypeNum);

          for (var i = 1; i <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
            error: Error()
          }), GRID_WIDTH) : GRID_WIDTH); i++) {
            this.cells[i] = [];

            for (var j = 1; j <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
              error: Error()
            }), GRID_HEIGHT) : GRID_HEIGHT); j++) {
              this.cells[i][j] = new (_crd && CellModel === void 0 ? (_reportPossibleCrUseOfCellModel({
                error: Error()
              }), CellModel) : CellModel)();
            }
          } // this.mock();


          for (var i = 1; i <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
            error: Error()
          }), GRID_WIDTH) : GRID_WIDTH); i++) {
            for (var j = 1; j <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
              error: Error()
            }), GRID_HEIGHT) : GRID_HEIGHT); j++) {
              //已经被mock数据生成了
              if (this.cells[i][j].type != null) {
                continue;
              }

              var flag = true;

              while (flag) {
                flag = false;
                this.cells[i][j].init(this.getRandomCellType());
                var result = this.checkPoint(j, i)[0];

                if (result.length > 2) {
                  flag = true;
                }

                this.cells[i][j].setXY(j, i);
                this.cells[i][j].setStartXY(j, i);
              }
            }
          }
        }

        mock() {
          this.mockInit(5, 1, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).A);
          this.mockInit(5, 3, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).A);
          this.mockInit(4, 2, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).A);
          this.mockInit(3, 2, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).A);
          this.mockInit(5, 2, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).B);
          this.mockInit(6, 2, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).B);
          this.mockInit(7, 3, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).B);
          this.mockInit(8, 2, (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
            error: Error()
          }), CELL_TYPE) : CELL_TYPE).A);
        }

        mockInit(x, y, type) {
          this.cells[x][y].init(type);
          this.cells[x][y].setXY(y, x);
          this.cells[x][y].setStartXY(y, x);
        }

        initWithData(data) {// to do
        }
        /**
         *
         * @param x
         * @param y
         * @param recursive 是否递归查找
         * @returns {([]|string|*)[]}
         */


        checkPoint(x, y, recursive) {
          var rowResult = this.checkWithDirection(x, y, [cc.v2(1, 0), cc.v2(-1, 0)]);
          var colResult = this.checkWithDirection(x, y, [cc.v2(0, -1), cc.v2(0, 1)]);
          var samePoints = [];
          var newCellStatus = "";

          if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
              error: Error()
            }), CELL_STATUS) : CELL_STATUS).BIRD;
          } else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
              error: Error()
            }), CELL_STATUS) : CELL_STATUS).WRAP;
          } else if (rowResult.length >= 4) {
            newCellStatus = (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
              error: Error()
            }), CELL_STATUS) : CELL_STATUS).LINE;
          } else if (colResult.length >= 4) {
            newCellStatus = (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
              error: Error()
            }), CELL_STATUS) : CELL_STATUS).COLUMN;
          }

          if (rowResult.length >= 3) {
            samePoints = rowResult;
          }

          if (colResult.length >= 3) {
            samePoints = (_crd && mergePointArray === void 0 ? (_reportPossibleCrUseOfmergePointArray({
              error: Error()
            }), mergePointArray) : mergePointArray)(samePoints, colResult);
          }

          var result = [samePoints, newCellStatus, this.cells[y][x].type, cc.v2(x, y)]; // 检查一下消除的其他节点， 能不能生成更大范围的消除

          if (recursive && result.length >= 3) {
            var subCheckPoints = (_crd && exclusivePoint === void 0 ? (_reportPossibleCrUseOfexclusivePoint({
              error: Error()
            }), exclusivePoint) : exclusivePoint)(samePoints, cc.v2(x, y));

            for (var point of subCheckPoints) {
              var subResult = this.checkPoint(point.x, point.y, false);

              if (subResult[1] > result[1] || subResult[1] === result[1] && subResult[0].length > result[0].length) {
                result = subResult;
              }
            }
          }

          return result;
        }

        checkWithDirection(x, y, direction) {
          var queue = [];
          var vis = [];
          vis[x + y * 9] = true;
          queue.push(cc.v2(x, y));
          var front = 0;

          while (front < queue.length) {
            //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
            var point = queue[front];
            var cellModel = this.cells[point.y][point.x];
            front++;

            if (!cellModel) {
              continue;
            }

            for (var i = 0; i < direction.length; i++) {
              var tmpX = point.x + direction[i].x;
              var tmpY = point.y + direction[i].y;

              if (tmpX < 1 || tmpX > 9 || tmpY < 1 || tmpY > 9 || vis[tmpX + tmpY * 9] || !this.cells[tmpY][tmpX]) {
                continue;
              }

              if (cellModel.type === this.cells[tmpY][tmpX].type) {
                vis[tmpX + tmpY * 9] = true;
                queue.push(cc.v2(tmpX, tmpY));
              }
            }
          }

          return queue;
        }

        printInfo() {
          for (var i = 1; i <= 9; i++) {
            var printStr = "";

            for (var j = 1; j <= 9; j++) {
              printStr += this.cells[i][j].type + " ";
            }

            console.log(printStr);
          }
        }

        getCells() {
          return this.cells;
        } // controller调用的主要入口
        // 点击某个格子


        selectCell(pos) {
          this.changeModels = []; // 发生改变的model，将作为返回值，给view播动作

          this.effectsQueue = []; // 动物消失，爆炸等特效

          var lastPos = this.lastPos;
          var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);

          if (delta != 1) {
            //非相邻格子， 直接返回
            this.lastPos = pos;
            return [[], []];
          }

          var curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子

          var lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格式

          this.exchangeCell(lastPos, pos);
          var result1 = this.checkPoint(pos.x, pos.y)[0];
          var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
          this.curTime = 0; // 动画播放的当前时间

          this.pushToChangeModels(curClickCell);
          this.pushToChangeModels(lastClickCell);
          var isCanBomb = curClickCell.status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
            error: Error()
          }), CELL_STATUS) : CELL_STATUS).COMMON && // 判断两个是否是特殊的动物
          lastClickCell.status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
            error: Error()
          }), CELL_STATUS) : CELL_STATUS).COMMON || curClickCell.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
            error: Error()
          }), CELL_STATUS) : CELL_STATUS).BIRD || lastClickCell.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
            error: Error()
          }), CELL_STATUS) : CELL_STATUS).BIRD;

          if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
            //不会发生消除的情况
            this.exchangeCell(lastPos, pos);
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(pos);
            this.lastPos = cc.v2(-1, -1);
            return [this.changeModels];
          } else {
            this.lastPos = cc.v2(-1, -1);
            curClickCell.moveTo(lastPos, this.curTime);
            lastClickCell.moveTo(pos, this.curTime);
            var checkPoint = [pos, lastPos];
            this.curTime += (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
              error: Error()
            }), ANITIME) : ANITIME).TOUCH_MOVE;
            this.processCrush(checkPoint);
            return [this.changeModels, this.effectsQueue];
          }
        } // 消除


        processCrush(checkPoint) {
          var cycleCount = 0;

          while (checkPoint.length > 0) {
            var bombModels = [];

            if (cycleCount == 0 && checkPoint.length == 2) {
              //特殊消除
              var pos1 = checkPoint[0];
              var pos2 = checkPoint[1];
              var model1 = this.cells[pos1.y][pos1.x];
              var model2 = this.cells[pos2.y][pos2.x];

              if (model1.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).BIRD || model2.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).BIRD) {
                var bombModel = null;

                if (model1.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                  error: Error()
                }), CELL_STATUS) : CELL_STATUS).BIRD) {
                  model1.type = model2.type;
                  bombModels.push(model1);
                } else {
                  model2.type = model1.type;
                  bombModels.push(model2);
                }
              }
            }

            for (var i in checkPoint) {
              var pos = checkPoint[i];

              if (!this.cells[pos.y][pos.x]) {
                continue;
              }

              var [result, newCellStatus, newCellType, crushPoint] = this.checkPoint(pos.x, pos.y, true);

              if (result.length < 3) {
                continue;
              }

              for (var j in result) {
                var model = this.cells[result[j].y][result[j].x];
                this.crushCell(result[j].x, result[j].y, false, cycleCount);

                if (model.status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                  error: Error()
                }), CELL_STATUS) : CELL_STATUS).COMMON) {
                  bombModels.push(model);
                }
              }

              this.createNewCell(crushPoint, newCellStatus, newCellType);
            }

            this.processBomb(bombModels, cycleCount);
            this.curTime += (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
              error: Error()
            }), ANITIME) : ANITIME).DIE;
            checkPoint = this.down();
            cycleCount++;
          }
        } //生成新cell


        createNewCell(pos, status, type) {
          if (status == "") {
            return;
          }

          if (status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
            error: Error()
          }), CELL_STATUS) : CELL_STATUS).BIRD) {
            type = (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
              error: Error()
            }), CELL_TYPE) : CELL_TYPE).BIRD;
          }

          var model = new (_crd && CellModel === void 0 ? (_reportPossibleCrUseOfCellModel({
            error: Error()
          }), CellModel) : CellModel)();
          this.cells[pos.y][pos.x] = model;
          model.init(type);
          model.setStartXY(pos.x, pos.y);
          model.setXY(pos.x, pos.y);
          model.setStatus(status);
          model.setVisible(0, false);
          model.setVisible(this.curTime, true);
          this.changeModels.push(model);
        } // 下落


        down() {
          var newCheckPoint = [];

          for (var i = 1; i <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
            error: Error()
          }), GRID_WIDTH) : GRID_WIDTH); i++) {
            for (var j = 1; j <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
              error: Error()
            }), GRID_HEIGHT) : GRID_HEIGHT); j++) {
              if (this.cells[i][j] == null) {
                var curRow = i;

                for (var k = curRow; k <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                  error: Error()
                }), GRID_HEIGHT) : GRID_HEIGHT); k++) {
                  if (this.cells[k][j]) {
                    this.pushToChangeModels(this.cells[k][j]);
                    newCheckPoint.push(this.cells[k][j]);
                    this.cells[curRow][j] = this.cells[k][j];
                    this.cells[k][j] = null;
                    this.cells[curRow][j].setXY(j, curRow);
                    this.cells[curRow][j].moveTo(cc.v2(j, curRow), this.curTime);
                    curRow++;
                  }
                }

                var count = 1;

                for (var k = curRow; k <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                  error: Error()
                }), GRID_HEIGHT) : GRID_HEIGHT); k++) {
                  this.cells[k][j] = new (_crd && CellModel === void 0 ? (_reportPossibleCrUseOfCellModel({
                    error: Error()
                  }), CellModel) : CellModel)();
                  this.cells[k][j].init(this.getRandomCellType());
                  this.cells[k][j].setStartXY(j, count + (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                    error: Error()
                  }), GRID_HEIGHT) : GRID_HEIGHT));
                  this.cells[k][j].setXY(j, count + (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                    error: Error()
                  }), GRID_HEIGHT) : GRID_HEIGHT));
                  this.cells[k][j].moveTo(cc.v2(j, k), this.curTime);
                  count++;
                  this.changeModels.push(this.cells[k][j]);
                  newCheckPoint.push(this.cells[k][j]);
                }
              }
            }
          }

          this.curTime += (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
            error: Error()
          }), ANITIME) : ANITIME).TOUCH_MOVE + 0.3;
          return newCheckPoint;
        }

        pushToChangeModels(model) {
          if (this.changeModels.indexOf(model) != -1) {
            return;
          }

          this.changeModels.push(model);
        }

        cleanCmd() {
          for (var i = 1; i <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
            error: Error()
          }), GRID_WIDTH) : GRID_WIDTH); i++) {
            for (var j = 1; j <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
              error: Error()
            }), GRID_HEIGHT) : GRID_HEIGHT); j++) {
              if (this.cells[i][j]) {
                this.cells[i][j].cmd = [];
              }
            }
          }
        }

        exchangeCell(pos1, pos2) {
          var tmpModel = this.cells[pos1.y][pos1.x];
          this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
          this.cells[pos1.y][pos1.x].x = pos1.x;
          this.cells[pos1.y][pos1.x].y = pos1.y;
          this.cells[pos2.y][pos2.x] = tmpModel;
          this.cells[pos2.y][pos2.x].x = pos2.x;
          this.cells[pos2.y][pos2.x].y = pos2.y;
        } // 设置种类
        // Todo 改成乱序算法


        setCellTypeNum(num) {
          console.log("num = ", num);
          this.cellTypeNum = num;
          this.cellCreateType = [];
          var createTypeList = this.cellCreateType;

          for (var i = 1; i <= (_crd && CELL_BASENUM === void 0 ? (_reportPossibleCrUseOfCELL_BASENUM({
            error: Error()
          }), CELL_BASENUM) : CELL_BASENUM); i++) {
            createTypeList.push(i);
          }

          for (var _i = 0; _i < createTypeList.length; _i++) {
            var index = Math.floor(Math.random() * ((_crd && CELL_BASENUM === void 0 ? (_reportPossibleCrUseOfCELL_BASENUM({
              error: Error()
            }), CELL_BASENUM) : CELL_BASENUM) - _i)) + _i;

            createTypeList[_i], createTypeList[index] = createTypeList[index], createTypeList[_i];
          }
        } // 随要生成一个类型


        getRandomCellType() {
          var index = Math.floor(Math.random() * this.cellTypeNum);
          return this.cellCreateType[index];
        } // TODO bombModels去重


        processBomb(bombModels, cycleCount) {
          var _this = this;

          var _loop = function _loop() {
            var newBombModel = [];
            var bombTime = (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
              error: Error()
            }), ANITIME) : ANITIME).BOMB_DELAY;
            bombModels.forEach(function (model) {
              if (model.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).LINE) {
                for (var i = 1; i <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
                  error: Error()
                }), GRID_WIDTH) : GRID_WIDTH); i++) {
                  if (this.cells[model.y][i]) {
                    if (this.cells[model.y][i].status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                      error: Error()
                    }), CELL_STATUS) : CELL_STATUS).COMMON) {
                      newBombModel.push(this.cells[model.y][i]);
                    }

                    this.crushCell(i, model.y, false, cycleCount);
                  }
                }

                this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
              } else if (model.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).COLUMN) {
                for (var _i2 = 1; _i2 <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                  error: Error()
                }), GRID_HEIGHT) : GRID_HEIGHT); _i2++) {
                  if (this.cells[_i2][model.x]) {
                    if (this.cells[_i2][model.x].status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                      error: Error()
                    }), CELL_STATUS) : CELL_STATUS).COMMON) {
                      newBombModel.push(this.cells[_i2][model.x]);
                    }

                    this.crushCell(model.x, _i2, false, cycleCount);
                  }
                }

                this.addColBomb(this.curTime, cc.v2(model.x, model.y));
              } else if (model.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).WRAP) {
                var x = model.x;
                var y = model.y;

                for (var _i3 = 1; _i3 <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                  error: Error()
                }), GRID_HEIGHT) : GRID_HEIGHT); _i3++) {
                  for (var j = 1; j <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
                    error: Error()
                  }), GRID_WIDTH) : GRID_WIDTH); j++) {
                    var delta = Math.abs(x - j) + Math.abs(y - _i3);

                    if (this.cells[_i3][j] && delta <= 2) {
                      if (this.cells[_i3][j].status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                        error: Error()
                      }), CELL_STATUS) : CELL_STATUS).COMMON) {
                        newBombModel.push(this.cells[_i3][j]);
                      }

                      this.crushCell(j, _i3, false, cycleCount);
                    }
                  }
                }
              } else if (model.status == (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                error: Error()
              }), CELL_STATUS) : CELL_STATUS).BIRD) {
                var crushType = model.type;

                if (bombTime < (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
                  error: Error()
                }), ANITIME) : ANITIME).BOMB_BIRD_DELAY) {
                  bombTime = (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
                    error: Error()
                  }), ANITIME) : ANITIME).BOMB_BIRD_DELAY;
                }

                if (crushType == (_crd && CELL_TYPE === void 0 ? (_reportPossibleCrUseOfCELL_TYPE({
                  error: Error()
                }), CELL_TYPE) : CELL_TYPE).BIRD) {
                  crushType = this.getRandomCellType();
                }

                for (var _i4 = 1; _i4 <= (_crd && GRID_HEIGHT === void 0 ? (_reportPossibleCrUseOfGRID_HEIGHT({
                  error: Error()
                }), GRID_HEIGHT) : GRID_HEIGHT); _i4++) {
                  for (var _j = 1; _j <= (_crd && GRID_WIDTH === void 0 ? (_reportPossibleCrUseOfGRID_WIDTH({
                    error: Error()
                  }), GRID_WIDTH) : GRID_WIDTH); _j++) {
                    if (this.cells[_i4][_j] && this.cells[_i4][_j].type == crushType) {
                      if (this.cells[_i4][_j].status != (_crd && CELL_STATUS === void 0 ? (_reportPossibleCrUseOfCELL_STATUS({
                        error: Error()
                      }), CELL_STATUS) : CELL_STATUS).COMMON) {
                        newBombModel.push(this.cells[_i4][_j]);
                      }

                      this.crushCell(_j, _i4, true, cycleCount);
                    }
                  }
                } //this.crushCell(model.x, model.y);

              }
            }, _this);

            if (bombModels.length > 0) {
              _this.curTime += bombTime;
            }

            bombModels = newBombModel;
          };

          while (bombModels.length > 0) {
            _loop();
          }
        }
        /**
         * 
         * @param {开始播放的时间} playTime 
         * @param {*cell位置} pos 
         * @param {*第几次消除，用于播放音效} step 
         */


        addCrushEffect(playTime, pos, step) {
          this.effectsQueue.push({
            playTime,
            pos,
            action: "crush",
            step
          });
        }

        addRowBomb(playTime, pos) {
          this.effectsQueue.push({
            playTime,
            pos,
            action: "rowBomb"
          });
        }

        addColBomb(playTime, pos) {
          this.effectsQueue.push({
            playTime,
            pos,
            action: "colBomb"
          });
        }

        addWrapBomb(playTime, pos) {// TODO
        } // cell消除逻辑


        crushCell(x, y, needShake, step) {
          var model = this.cells[y][x];
          this.pushToChangeModels(model);

          if (needShake) {
            model.toShake(this.curTime);
          }

          var shakeTime = needShake ? (_crd && ANITIME === void 0 ? (_reportPossibleCrUseOfANITIME({
            error: Error()
          }), ANITIME) : ANITIME).DIE_SHAKE : 0;
          model.toDie(this.curTime + shakeTime);
          this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), step);
          this.cells[y][x] = null;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=dec491708107c063690793bea2881e9b9d406755.js.map