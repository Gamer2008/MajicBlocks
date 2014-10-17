/**
 * Created by huaiyao on 14-10-3.
 */
var FigureBlocks = cc.Node.extend({

    ctor:function (field, gameManager, fieldContainer){
        this._super();
        this.init(field, gameManager, fieldContainer);
    },
    init :function (field, gameManager, fieldContainer) {
        this._super();
        this.gameManager = gameManager;
        this.field = field;
        this.fieldContainer = fieldContainer;
        this._moveClipsNames = this.fieldContainer._moveClipsNames;
        this.cells = [];
        this.figuresStep = [];
        this.connecting = false;
        this.tweenMove = null;
        this.MOVE_TIME = 320;
        this.MOVE_CLOSE_PATH = this.gameManager.CELL_SIZE / 10
    },
    setCells :function (cells) {
        this.cells = cells
    },
    findAllCells :function (x, y) {
        this.cells.length = 0;
        if (this.field[x][y] == 0 || this.field[x][y] == this.fieldContainer.BLACK_ID) return false;
        this.cellId = this.field[x][y];
        this.addCell(x, y);
        this.drawOne(this.cellId);
        return true
    },
    testFigure :function () {
        var str = "" + this.cellId + "    ";
        for (var i = 0; i < this.cells.length; i++) str += "" + this.cells[i].x + " " + this.cells[i].y + "     ";
        console.log(str)
    },
    addCell :function (x, y) {
        if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return;
        if (this.field[x][y] != this.cellId) return;
        if (!this.isCellFigure(x, y)) {
            this.cells.push(cc.p(x, y));
            this.addCell(x - 1, y);
            this.addCell(x + 1, y);
            this.addCell(x, y - 1);
            this.addCell(x, y + 1)
        }
    },
    isCellFigure :function (x, y) {
        var i = 0;
        for (i = 0; i < this.cells.length; i++)
            if (this.cells[i].x == x && y == this.cells[i].y) return true;
        return false
    },
    /*
    drawOne :function (drawId) {
        var x = -1;
        var y = -1;
        for (x = -1; x < this.gameManager.FIELD_WIDTH; x++)
            for (y = -1; y < this.gameManager.FIELD_HEIGHT; y++) {
                var spr = this.getSprTile(x, y, drawId);
                if (spr != null) {
                    spr.x = this.gameManager.CELL_SIZE * x;
                    spr.y = this.gameManager.CELL_SIZE * y;
                    this.addChild(spr)
                }
            }
        this.casheAllTTTT()
    },
    casheAllTTTT :function () {},
    getSprTile :function (x, y, drawId) {
        var XY = this.getTileId(x, y);
        var X1Y = this.getTileId(x + 1, y);
        var X1Y1 = this.getTileId(x + 1, y + 1);
        var XY1 = this.getTileId(x, y + 1);
        if (XY != drawId) XY = 0;
        else XY = 1;
        if (X1Y != drawId) X1Y = 0;
        else X1Y = 1;
        if (X1Y1 != drawId) X1Y1 = 0;
        else X1Y1 = 1;
        if (XY1 != drawId) XY1 = 0;
        else XY1 = 1;
        if (XY == 0 && (X1Y == 0 && (X1Y1 == 0 && XY1 == 0))) return null;
        var spr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, this._moveClipsNames["" + drawId] + XY + "_" + X1Y + "_" + X1Y1 + "_" + XY1);
        spr.stop();
        return spr
    },
    */

    drawOne:function (drawId) {
        var x = -1;
        var y = -1;
        for (x = -1; x < this.gameManager.FIELD_WIDTH; x++)
            for (y = -1; y < this.gameManager.FIELD_HEIGHT; y++) {
                var spr = this.getSprTile(x, y, drawId);
                if (spr != null) {


                    //spr.setPosition(this.getPosition(0,0));
                }
            }
    },

    //type  1:LT  2:RT 3:LB 4:RB 5:T 6:B 7:L 8:R 9Other
    getRealPosition:function(x,y,type){
        var px = this.gameManager.CELL_SIZE * (x + 1);
        var py = this.gameManager.CELL_SIZE * (this.gameManager.FIELD_HEIGHT - y);
        var offx = 3;
        var offy = 3;
        //return cc.p(px,py);
        switch (type){
            case 1:
            {
                px += -2;
                py += 2;
                break;
            }
            case 2:
            {
                px += this.gameManager.CELL_SIZE / 2 ;

                px += 2;
                py += 2;

                break;
            }
            case 3:
            {
                py -= this.gameManager.CELL_SIZE / 2 ;

                px += -2;
                py += -2;
                break;
            }
            case 4:
            {
                px += this.gameManager.CELL_SIZE / 2 ;
                py -= this.gameManager.CELL_SIZE / 2 ;

                px += 1;
                py += -2;
                break;
            }
            case 5:
            {
                px -= offx;
                py += 2;
                break;
            }
            case 6:
            {
                py -= this.gameManager.CELL_SIZE / 2 ;
                px -= offx;
                py += -2;
                break;
            }
            case 7:
            {
                py += offy;
                px -= 2;
                break;
            }
            case 8:
            {
                py += offy;
                px += this.gameManager.CELL_SIZE / 2 ;
                px += 2;
                break;
            }
            case 9:
            {
                px -= 3;
                py += 3;
                break;
            }
        }
        return cc.p(px,py);
    },

    getSprTile:function (x, y, drawId) {
        var XY = this.getTileId(x, y);
        var X1Y = this.getTileId(x + 1, y);
        var X1Y1 = this.getTileId(x + 1, y + 1);
        var XY1 = this.getTileId(x, y + 1);
        if (XY != drawId) XY = 0;
        else XY = 1;
        if (X1Y != drawId) X1Y = 0;
        else X1Y = 1;
        if (X1Y1 != drawId) X1Y1 = 0;
        else X1Y1 = 1;
        if (XY1 != drawId) XY1 = 0;
        else XY1 = 1;
        if (XY == 0 && (X1Y == 0 && (X1Y1 == 0 && XY1 == 0))) return null;
        var spriteName = this._moveClipsNames["" + drawId] + XY + "_" + X1Y + "_" + X1Y1 + "_" + XY1 + "_000.png";

        var spr = new cc.Sprite("#" + spriteName);
        //type  1:LT  2:RT 3:LB 4:RB 5:T 6:B 7:L 8:R 9Other
        var type = 9;
        if(XY != 0 && X1Y == 0 && XY1 == 0 && X1Y1 == 0) type = 1;
        else if(XY == 0 && X1Y != 0 && XY1 == 0 && X1Y1 == 0) type = 2;
        else if(XY == 0 && X1Y == 0 && XY1 != 0 && X1Y1 == 0) type = 3;
        else if(XY == 0 && X1Y == 0 && XY1 == 0 && X1Y1 != 0) type = 4;
        else if(X1Y1 == 0 && XY1 == 0) type = 5;
        else if(XY == 0 && X1Y == 0) type = 6;
        else if(X1Y == 0 && X1Y1 == 0) type = 7;
        else if(XY == 0 && XY1 == 0) type = 8;
        this.addChild(spr);
        spr.setAnchorPoint(0,1);
        spr.setPosition(this.getRealPosition(x,y,type));

        // var spr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, this._moveClipsNames["" + drawId] + XY + "_" + X1Y + "_" + X1Y1 + "_" + XY1);
        return spr
    },

    getTileId :function (x, y) {
        if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return 0;
        if (this.isCellFigure(x, y)) return this.field[x][y];
        return 0
    },
    step :function (toX, toY) {
        this.step_id = this.gameManager.STEP_CLOSE;
        this.figuresStep.length = 0;
        var cellsFigures = [];
        for (var i = 0; i < this.cells.length; i++) {
            var step = this.stepCell(i, toX, toY);
            if (step == this.gameManager.STEP_CLOSE) return this.gameManager.STEP_CLOSE;
            if (step == this.gameManager.STEP_CLOSE_FIGURE) cellsFigures.push( cc.p(this.cells[i].x + toX, this.cells[i].y + toY))
        }
        if (cellsFigures.length == 0) {
            this.step_id = this.gameManager.STEP_OPEN;
            return this.gameManager.STEP_OPEN
        }
        for (var i = 0; i < cellsFigures.length; i++) this.addFigureStep(this.fieldContainer.getFigureByCell(cellsFigures[i].x, cellsFigures[i].y));
        this.step_id = this.gameManager.STEP_CLOSE_FIGURE;
        return this.gameManager.STEP_CLOSE_FIGURE
    },
    addFigureStep :function (figure) {
        if (figure == null) return;
        for (var i = 0; i < this.figuresStep.length; i++)
            if (this.figuresStep[i].id == figure.id) return;
        this.figuresStep.push(figure)
    },
    stepCell :function (i, toX, toY) {
        var newX = this.cells[i].x + toX;
        var newY = this.cells[i].y + toY;
        if (newX <= -1 || (newY <= -1 || (newX >= this.gameManager.FIELD_WIDTH || newY >= this.gameManager.FIELD_HEIGHT))) return this.gameManager.STEP_CLOSE;
        var cellStepId = this.field[newX][newY];
        if (cellStepId == 0 || cellStepId == this.cellId) return this.gameManager.STEP_OPEN;
        if (cellStepId == this.fieldContainer.BLACK_ID) return this.gameManager.STEP_CLOSE;
        return this.gameManager.STEP_CLOSE_FIGURE
    },
    postStep :function () {
        if (this.step_id == this.gameManager.STEP_CLOSE_FIGURE)
            for (var i = 0; i < this.figuresStep.length; i++)
                if (this.figuresStep[i].step_id == this.gameManager.STEP_CLOSE) {
                    this.step_id = this.gameManager.STEP_CLOSE;
                    return true
                }
        return false
    },
    preGo :function () {
        if (this.step_id == this.gameManager.STEP_CLOSE) return;
        for (var i = 0; i < this.cells.length; i++) this.field[this.cells[i].x][this.cells[i].y] = 0
    },
    go :function (toX, toY) {
        if (this.step_id == this.gameManager.STEP_CLOSE) {

            if(this.gameManager.beGetResult)
            {
                this.scheduleOnce(this.moveComplete,testTime);
                //this.moveComplete();
                return false;
            }

            var tagPosition = cc.p(this.getPositionX() + toX * this.MOVE_CLOSE_PATH,this.getPositionY()  - toY * this.MOVE_CLOSE_PATH);
            var moveTo = new cc.MoveTo(0.1,tagPosition);
            var backmove = new cc.MoveTo(0.1,this.getPosition());
            var goto = new cc.easeQuarticActionInOut(moveTo);
            var back = new cc.easeQuarticActionInOut(backmove);
            var callBack = cc.callFunc(this.moveComplete,this);
            this.runAction(cc.sequence(moveTo,backmove,callBack));

            return false
        }
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].x += toX;
            this.cells[i].y += toY;
            this.field[this.cells[i].x][this.cells[i].y] = this.cellId
        }
        /*
        this.tweenMove = createjs.Tween.get(this).to({
            x: this.x + toX * this.gameManager.CELL_SIZE,
            y: this.y + toY * this.gameManager.CELL_SIZE
        }, this.MOVE_TIME, createjs.Ease.quartInOut).call(this.eventMoveComplete);
        */


        if(this.gameManager.beGetResult) {
            this.scheduleOnce(this.moveComplete,testTime);
            return true;
        }

        var tagPosition = cc.p(this.getPositionX() + toX * this.gameManager.CELL_SIZE,this.getPositionY()  - toY * this.gameManager.CELL_SIZE);
        var moveTo = new cc.MoveTo(0.2,tagPosition);
        var callBack = cc.callFunc(this.moveComplete,this);
        this.runAction(cc.sequence(moveTo,callBack));
        return true
    },
    moveComplete :function () {
        this.fieldContainer.moveComplete()
    },
    connectToFigure :function (figure) {
        if (figure.cellId == this.cellId)
            for (var i = 0; i < this.cells.length; i++) {
                if (figure.isCellFigure(this.cells[i].x + 1, this.cells[i].y)) {
                    this.connecting = true;
                    figure.connecting = true;
                    return true
                }
                if (figure.isCellFigure(this.cells[i].x - 1, this.cells[i].y)) {
                    this.connecting = true;
                    figure.connecting = true;
                    return true
                }
                if (figure.isCellFigure(this.cells[i].x, this.cells[i].y + 1)) {
                    this.connecting = true;
                    figure.connecting = true;
                    return true
                }
                if (figure.isCellFigure(this.cells[i].x, this.cells[i].y - 1)) {
                    this.connecting = true;
                    figure.connecting = true;
                    return true
                }
            }
        return false
    }
});
