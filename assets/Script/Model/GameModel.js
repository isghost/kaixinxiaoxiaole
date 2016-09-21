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

GameModel.prototype.checkPoint = function(x,y){
    var queue = [];
    var vis = [];
    vis[x + y * 9] = true;
    queue.push(cc.p(x,y));
    var front = 0;
    while(front < queue.length){
        var forward = [cc.p(0,-1), cc.p(0,1), cc.p(1,0), cc.p(-1,0)];
        var point = queue[front];
        var cellModel = this.cells[point.y][point.x];
        front++;
        if(!cellModel){
            continue;
        }
        for(var i = 0;i < 4;i++){
            var tmpX = point.x + forward[i].x;
            var tmpY = point.y + forward[i].y;
            if(tmpX < 1 || tmpX >9 
                || tmpY < 1 || tmpY > 9 
                || vis[tmpX + tmpY * 9] 
                || !this.cells[tmpY][tmpX]){
                continue;
            }
            if(cellModel.type == this.cells[tmpY][tmpX].type){
                vis[tmpX + tmpY * 9] = true;
                queue.push(cc.p(tmpX,tmpY));
            }
        }
    }
    return queue;
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
    if(result1.length < 3 && result2.length < 3){
        console.log("33333333333")
        this.exchangeCell(lastPos, pos);
        this.cells[pos.y][pos.x].moveToAndBack(lastPos);
        this.cells[lastPos.y][lastPos.x].moveToAndBack(pos);
        this.lastPos = pos;
        return false;
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
    this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
     while(checkPoint.length > 0){
        var tmpCheckPoint = [];
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
                this.changeModels.push(model);
                model.toDie(this.curTime);
                this.cells[result[j].y][result[j].x] = null;
            }
            this.curTime += ANITIME.DIE;
            this.down();
        }
        checkPoint = tmpCheckPoint;
    }
}
//
GameModel.prototype.down = function(){
     for(var i = 1;i<=GRID_WIDTH;i++){
        for(var j = 1;j <= GRID_HEIGHT;j++){
            if(this.cells[i][j] == null){
                var curRow = i;
                for(var k = curRow; k<=GRID_HEIGHT;k++){
                    if(this.cells[k][j]){
                        this.changeModels.push(this.cells[k][j]);
                        this.cells[curRow][j] = this.cells[k][j];
                        this.cells[k][j] = null;
                        this.cells[curRow][j].setXY(j, curRow);
                        this.cells[curRow][j].moveTo(cc.p(j, curRow), self.curTime);
                        curRow++; 
                    }
                }
                var count = 1;
                for(var k = curRow; k<=GRID_HEIGHT; k++){
                    this.cells[k][j] = new CellModel();
                    this.cells[k][j].init();
                    this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                    this.cells[k][j].setXY(j, k);
                    this.cells[k][j].moveTo(cc.p(j, curRow), self.curTime);
                    count++;
                    this.changeModels.push(this.cells[k][j]);
                }

            }
        }
    }
}

GameModel.prototype.cleanCmd = function(){
    for(var i = 1;i<=GRID_WIDTH;i++){
        for(var j = 1;j <= GRID_HEIGHT;j++){
          //  this.cells[i][j].cmd = [];
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