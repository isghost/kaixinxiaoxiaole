function GameModel(){
    this.cells = null;
    this.cellBgs = null;
    this.lastPos = cc.p(-1, -1);
}

GameModel.prototype.init = function(){
    this.cells = [];
    for(var i = 1;i<=GRID_WIDTH;i++){
        this.cells[i] = [];
        for(var j = 1;j <= GRID_HEIGHT;j++){
            this.cells[i][j] = new CellModel();
        }
    }

    for(var i = 1;i<=GRID_WIDTH;i++){
        for(var j = 1;j <= GRID_HEIGHT;j++){
            let flag = true;
            while(flag){
                flag = false;
                this.cells[i][j].init();
                let result = this.checkPoint(j, i);
                if(result.length > 2){
                    flag = true;
                }
                this.cells[i][j].setXY(j, i);
                this.cells[i][j].setStartXY(j, i);
            }
        }
    }

}

GameModel.prototype.initWithData = function(data){
    // to do
} 

GameModel.prototype.checkPoint = function (x, y) {
    let checkWithDirection = function (x, y, direction) {
        let queue = [];
        let vis = [];
        vis[x + y * 9] = true;
        queue.push(cc.p(x, y));
        let front = 0;
        while (front < queue.length) {
            //let direction = [cc.p(0, -1), cc.p(0, 1), cc.p(1, 0), cc.p(-1, 0)];
            let point = queue[front];
            let cellModel = this.cells[point.y][point.x];
            front++;
            if (!cellModel) {
                continue;
            }
            for (let i = 0; i < direction.length; i++) {
                let tmpX = point.x + direction[i].x;
                let tmpY = point.y + direction[i].y;
                if (tmpX < 1 || tmpX > 9
                    || tmpY < 1 || tmpY > 9
                    || vis[tmpX + tmpY * 9]
                    || !this.cells[tmpY][tmpX]) {
                    continue;
                }
                if (cellModel.type == this.cells[tmpY][tmpX].type) {
                    vis[tmpX + tmpY * 9] = true;
                    queue.push(cc.p(tmpX, tmpY));
                }
            }
        }
        return queue;
    }
    let rowResult = checkWithDirection.call(this,x,y,[cc.p(1, 0), cc.p(-1, 0)]);
    let colResult = checkWithDirection.call(this,x,y,[cc.p(0, -1), cc.p(0, 1)]);
    let result = [];
    if(rowResult.length >= 3){
        result = rowResult;
    }
    if(colResult.length >= 3){
        let tmp = result.concat();
        colResult.forEach(function(newEle){
            let flag = false;
            tmp.forEach(function (oldEle) {
                if(newEle.x == oldEle.x && newEle.y == oldEle.y){
                    flag = true;
                }
            }, this);
            if(!flag){
                result.push(newEle);
            }
        }, this);
        console.log("result = ", result.length);
    }
    return result;
}

GameModel.prototype.printInfo = function(){
    for(var i = 1; i<=9 ;i++){
        var printStr = "";
        for(var j = 1; j<=9;j++){
            printStr += this.cells[i][j].type + " ";
        }
        console.log(printStr);
    }
}

GameModel.prototype.getCells = function(){
    return this.cells;
}

GameModel.prototype.selectCell =function(pos){
    this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
    var lastPos = this.lastPos;
    var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
    if(delta != 1){
        this.lastPos = pos;
        return false;
    }
    this.exchangeCell(lastPos, pos);
    var result1 = this.checkPoint(pos.x, pos.y);
    var result2 = this.checkPoint(lastPos.x, lastPos.y);
    this.curTime = 0; // 动画播放的当前时间
    console.log(result1.length, result2.length);
    this.pushToChangeModels(this.cells[pos.y][pos.x]);
    this.pushToChangeModels(this.cells[lastPos.y][lastPos.x]);
    if(result1.length < 3 && result2.length < 3){
        console.log("33333333333")
        this.exchangeCell(lastPos, pos);
        this.cells[pos.y][pos.x].moveToAndBack(lastPos);
        this.cells[lastPos.y][lastPos.x].moveToAndBack(pos);
        this.lastPos = pos;
        return this.changeModels;
    }
    else{
        this.lastPos = cc.p(-1,-1);
        this.cells[pos.y][pos.x].moveTo(pos, this.curTime);
        this.cells[lastPos.y][lastPos.x].moveTo(lastPos, this.curTime);
        var checkPoint = [pos, lastPos];
        this.curTime += ANITIME.TOUCH_MOVE;
        this.processCrush(checkPoint);
        return this.changeModels;
    }
}

GameModel.prototype.processCrush = function(checkPoint){
     while(checkPoint.length > 0){
        for(var i in checkPoint){
            var pos = checkPoint[i];
            if(!this.cells[pos.y][pos.x]){
                continue;
            }
            var result = this.checkPoint(pos.x, pos.y);
            if(result.length < 3){
                continue;
            }
            for(var j in result){
                var model = this.cells[result[j].y][result[j].x];
                this.pushToChangeModels(model);
                model.toDie(this.curTime);
                this.cells[result[j].y][result[j].x] = null;
            }
        }
        this.curTime += ANITIME.DIE;
        checkPoint = this.down();
    }
}
//
GameModel.prototype.down = function(){
    let newCheckPoint = [];
     for(var i = 1;i<=GRID_WIDTH;i++){
        for(var j = 1;j <= GRID_HEIGHT;j++){
            if(this.cells[i][j] == null){
                var curRow = i;
                for(var k = curRow; k<=GRID_HEIGHT;k++){
                    if(this.cells[k][j]){
                        this.pushToChangeModels(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                        this.cells[curRow][j] = this.cells[k][j];
                        this.cells[k][j] = null;
                        this.cells[curRow][j].setXY(j, curRow);
                        console.log("this.curTime = ", this.curTime);
                        this.cells[curRow][j].moveTo(cc.p(j, curRow), this.curTime);
                        curRow++; 
                    }
                }
                var count = 1;
                for(var k = curRow; k<=GRID_HEIGHT; k++){
                    this.cells[k][j] = new CellModel();
                    this.cells[k][j].init();
                    this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                    this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                    this.cells[k][j].moveTo(cc.p(j, k), this.curTime);
                    count++;
                    this.changeModels.push(this.cells[k][j]);
                    newCheckPoint.push(this.cells[k][j]);
                }

            }
        }
    }
    this.curTime += ANITIME.TOUCH_MOVE + 0.3
    return newCheckPoint;
}

GameModel.prototype.pushToChangeModels = function(model){
    if(isInArray(this.changeModels, model)){
        return ;
    }
    this.changeModels.push(model);
}

GameModel.prototype.cleanCmd = function(){
    for(var i = 1;i<=GRID_WIDTH;i++){
        for(var j = 1;j <= GRID_HEIGHT;j++){
            if(this.cells[i][j]){
                this.cells[i][j].cmd = [];
            }
        }
    }
}

GameModel.prototype.exchangeCell = function(pos1, pos2){
    var tmpModel = this.cells[pos1.y][pos1.x];
    this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
    this.cells[pos1.y][pos1.x].x = pos1.x;
    this.cells[pos1.y][pos1.x].y = pos1.y;
    this.cells[pos2.y][pos2.x] = tmpModel;
    this.cells[pos2.y][pos2.x].x = pos2.x;
    this.cells[pos2.y][pos2.x].y = pos2.y;
}
GameModel.prototype

global.GameModel = GameModel;