var GRID_WIDTH = 9;
var GRID_HEIGHT = 9;
function GameModel(){
    this.cells = null;
    this.cellBgs = null;
}

GameModel.prototype.init = function(){
    this.cells = [];
    for(var i = 1;i<=GRID_WIDTH;i++){
        this.cells[i] = [];
        for(var j = 1;j <= GRID_HEIGHT;j++){
            this.cells[i][j] = new CellModel();
            this.cells[i][j].init();
        }
    }
}

GameModel.prototype.initWithData = function(data){
    // to do
} 

GameModel.prototype.checkPoint = function(x,y){
    var queue = [];
    var vis = [];
    vis[x * 9 + y] = true;
    queue.push(cc.p(x,y));
    var front = 0;
    while(front < queue.length){
        var forward = [cc.p(0,-1), cc.p(0,1), cc.p(1,0), cc.p(-1,0)];
        var point = queue[front];
        var cellModel = this.cells[point.x][point.y];
        front++;
        for(var i = 0;i < 4;i++){
            var tmpX = point.x + forward[i].x;
            var tmpY = point.y + forward[i].y;
            if(tmpX < 1 || tmpX >9 || tmpY < 1 || tmpY > 9 || vis[tmpX * 9 + tmpY]){
                continue;
            }
            if(cellModel.type == this.cells[tmpX][tmpY].type){
                vis[tmpX * 9 + tmpY] = true;
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

global.GameModel = GameModel;