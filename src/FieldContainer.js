/**
 * Created by huaiyao on 14-10-3.
 */
 var StepType = {};
StepType.Normal = 0;
StepType.Back = 1;
StepType.Next = 2;

var FieldContainer = cc.Layer.extend({
    gameManager:null,
    field:null,
    fieldsSteps:[],
    BLUE_ID:1,
    ORANGE_ID: 2,
    BLACK_ID:3,
    PURPLE_ID:4,
    _moveClipsNames:null,
    figures:[],
    _numMove:0,
    _touchListener:null,
    _oldPos:cc.p(0,0),

    _arrayResult:[],
    _currentStep:null,
    _currentStepType : StepType.Normal,
    _beWin:false,

    ctor:function (field, gameManager){
        this._super();
        this.init(field, gameManager);
    },
    init:function (field, gameManager) {

        this.gameManager = gameManager;
        this.field = field;
        this.fieldsSteps = [];
        this._arrayResult = [];
        this._currentStep = null;
        this.batnNode = new cc.SpriteBatchNode(res.p_BlockGame_png);
        this.addChild(this.batnNode);
        this.addSaveStep();

        this._moveClipsNames = {};
        this._moveClipsNames["" + this.BLUE_ID] = "tile_a_";
        this._moveClipsNames["" + this.ORANGE_ID] = "tile_c_";
        this._moveClipsNames["" + this.BLACK_ID] = "tile_black_";
        this._moveClipsNames["" + this.PURPLE_ID] = "tile_b_";
        this.figures = [];
        this._moveComplete = true;
        this._numMove = 0;
        this.findFigures();
        this.drawBlackCells();
        this.setPosition(cc.p(-30,-30));
        this.initTouch();

        cc.log(this.gameManager.beGetResult);
        if(this.gameManager.beGetResult) {
            this.goNext();
            return;
        }
    },

    initTouch:function () {
        this._mouseDown = false;
        this._step = false;
        this.MOUSE_X_Y_DIFF_MIN = 5;
        this.MOUSE_PATH_MIN = 3;

        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan.bind(this),
            onTouchMoved: this._onTouchMoved.bind(this),
            onTouchEnded: this._onTouchEnded.bind(this),
            onTouchCancelled: this._onTouchCancelled.bind(this)
        });

        var locListener = this._touchListener;
        cc.eventManager.addListener(locListener, this);
    },
    _onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var touchlocation = touch.getLocation();
        var location = target.convertToNodeSpace(touchlocation);
        this._mouseDown = true;
        this._step = true;
        this._oldPos.x = location.x;
        this._oldPos.y = location.y;
        return true;
    },

    _onTouchMoved: function (touch, event) {

        if (this._mouseDown && (this._step && this._moveComplete)) {
            var target = event.getCurrentTarget();
            var touchlocation = touch.getLocation();
            var location = target.convertToNodeSpace(touchlocation);
            var nowMouseX = location.x;
            var nowMouseY = location.y;
            var pathX = Math.abs(nowMouseX - this._oldPos.x);
            var pathY = Math.abs(nowMouseY - this._oldPos.y);
            if (Math.abs(pathX - pathY) < this.MOUSE_X_Y_DIFF_MIN || pathX < this.MOUSE_PATH_MIN && pathY < this.MOUSE_PATH_MIN) {
                this._oldPos.x = nowMouseX;
                this._oldPos.y = nowMouseY;
                return
            }


            this._step = false;
            this._numMove = 0;
            this._moveComplete = false;
            if (pathX > pathY)
                if (nowMouseX > this._oldPos.x) this.step(1, 0);
                else this.step(-1, 0);
            else if (nowMouseY > this._oldPos.y) this.step(0, -1);
            else this.step(0, 1);
            this._oldPos.x = nowMouseX;
            this._oldPos.y = nowMouseY
        }
    },

    _onTouchEnded:function(touch, event){
        this._mouseDown = false
    },
    _onTouchCancelled:function(touch, event){
        this._mouseDown = false
    },
    findFigures:function () {
        var figure = new FigureBlocks(this.field, this.gameManager, this);
        var x = 0;
        var y = 0;
        for (x = 0; x < this.gameManager.FIELD_WIDTH; x++)
            for (y = 0; y < this.gameManager.FIELD_HEIGHT; y++)
                if (!this.cellOnFigere(x, y))
                    if (figure.findAllCells(x, y)) {
                        this.figures.push(figure);
                        this.addChild(figure);
                        var figure = new FigureBlocks(this.field, this.gameManager, this)
                    }
    },
    cellOnFigere:function (x, y) {
        for (var i = 0; i < this.figures.length; i++)
            if (this.figures[i].isCellFigure(x, y)) return true;
        return false
    },
    drawBlackCells:function () {
        this.drawOne(this.BLACK_ID)
    },
    testDrawFiled:function () {
        this.removeAllChildren();
        this.drawOne(this.BLACK_ID);
        this.drawOne(this.BLUE_ID);
        this.drawOne(this.ORANGE_ID);
        this.drawOne(this.PURPLE_ID)
    },
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
    getPosition:function(x,y,type){
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

                px += 2;
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
                px += 3;
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
        this.batnNode.addChild(spr);
        spr.setAnchorPoint(0,1);

        spr.setPosition(this.getPosition(x,y,type));

       // var spr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, this._moveClipsNames["" + drawId] + XY + "_" + X1Y + "_" + X1Y1 + "_" + XY1);
        return spr
    },
    getTileId:function (x, y) {
        if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return 0;
        return this.field[x][y]
    },
    getFigureByCell:function (cellX, cellY) {
        for (var i = 0; i < this.figures.length; i++)
            if (this.figures[i].isCellFigure(cellX, cellY)) return this.figures[i];
        console.log("OMFG figures = NULL )) cellX = " + cellX + " cellY = " + cellY);
        return null
    },

    goNext:function(){
        var nextStpe = cc.p(0,0);
        if(this._arrayResult.length == 0){
            if(this._currentStep == null){
                nextStpe = this.getNextStpe(null,null);
            }
            else{
                nextStpe = this.getNextStpe(this._currentStep,null);
            }
            if(nextStpe == null) {
                cc.log("***************no result");
                return;
            }
            this._currentStep = nextStpe;
            this.step(this._currentStep.x,this._currentStep.y);
        }
        else{
            var stepFormer = this._arrayResult[this._arrayResult.length - 1];

            if(this._currentStep == null){
                nextStpe = this.getNextStpe(null,stepFormer);
            }
            else{
                nextStpe = this.getNextStpe(this._currentStep,stepFormer);
            }

            if(nextStpe == null) {
                this.deleteStep();
                this._currentStep = this._arrayResult.pop();
                //this.logResult();
                this.goNext();
                return;
            }

            this._currentStep = nextStpe;
            this.step(this._currentStep.x,this._currentStep.y);

        }
    },

    step:function (toX, toY) {
        for (var i = 0; i < this.figures.length; i++) this.figures[i].step(toX, toY);
        var circle = false;
        while (true) {
            circle = false;
            for (var i = 0; i < this.figures.length; i++)
                if (this.figures[i].postStep()) circle = true;
            if (!circle) break
        }
        for (var i = 0; i < this.figures.length; i++) this.figures[i].preGo();
        var goOne = false;

        for (i = 0; i < this.figures.length; i++)
            if (this.figures[i].go(toX, toY)) goOne = true;
        if (goOne) {
            MusicManager.playStep();
            this.gameManager.addStep();
            //cc.log("*********getStepNum" + this.gameManager.getStep());
            this.addSaveStep();
            this._currentStepType = StepType.Next;

        }
        else{
            if(this.gameManager.beGetResult){
                this._currentStepType = StepType.Normal;
            }
        }
    },
    checkFigureConnection:function () {
        var connect = false;
        for (var i = 0; i < this.figures.length; i++)
            for (var j = i + 1; j < this.figures.length; j++)
                if (this.figures[i].connectToFigure(this.figures[j])) connect = true;
        if (connect) {
            for (var i = 0; i < this.figures.length; i++)
                if (this.figures[i].connecting) {
                    this.removeChild(this.figures[i]);
                    this.figures.splice(i, 1);
                    i--
                }
            this.findFigures();
            if (!this.checkWin()) {
                MusicManager.playConnect();
            }

            if(this.gameManager.beGetResult){
                this.scheduleOnce(this.hhh,testTime);
            }
            return;
        }
        if(this.gameManager.beGetResult){
            this.scheduleOnce(this.hhh,testTime);
        }

    },

    hhh:function(){

        if(this._currentStepType == StepType.Next){
/*
            if(this._beWin){
                this._arrayResult.push(this._currentStep);
                this.logResult();
                return ;
            }
            else{
                if(this.gameManager.getStep() >= this.gameManager.numStar){

                }
                else{
                    this._arrayResult.push(this._currentStep);
                    this.logResult();
                    this._currentStep = null;
                }
            }
*/
            this._arrayResult.push(this._currentStep);
            //this.logResult();
            this._currentStep = null;

            if(this._beWin)
            {
                this.logResult();
                var answer = [];
                for(var index = 0 ; index <this._arrayResult.length;index++ ){
                    answer.push([this._arrayResult[index].x,this._arrayResult[index].y])
                }
                var str = JSON.stringify(answer);
                cc.sys.localStorage.setItem("level" + this.gameManager.levelId ,str);
                ccs.actionManager.releaseActions();
                this.gameManager.goToNextLevel();
                return;
            }
            if(!this._beWin && this.gameManager.getStep() >= this.gameManager.numStar){
                this._currentStep = this._arrayResult.pop();
                this.deleteStep();
                this.scheduleOnce(this.goNext,testTime);
                return ;
            }

        }

        this.goNext();
    },
    checkWin:function () {
        var numFigures = {};
        numFigures["" + this.BLUE_ID] = 0;
        numFigures["" + this.ORANGE_ID] = 0;
        numFigures["" + this.BLACK_ID] = 0;
        numFigures["" + this.PURPLE_ID] = 0;
        for (var i = 0; i < this.figures.length; i++)
            numFigures["" + this.figures[i].cellId] ++;
        for (var i in numFigures)
            if (numFigures[i] > 1)
                return false;

        this._beWin = true;
        this.gameManager.setGameOver();
        cc.log("WIN!!!");
        this.gameManager.showWin();
        //dp_submitScore(-1, (this.gameManager.levelId + 1));
        return true
    },
    moveComplete:function () {
        this._numMove++;
        if (this._numMove == this.figures.length) {
            this._moveComplete = true;
            this._numMove = 0;
            this.checkFigureConnection()
        }
    },
    addSaveStep:function () {
        var copyArray = [];
        for (var i = 0; i < this.field.length; i++) copyArray.push(this.field[i].slice(0));
        this.fieldsSteps.push(copyArray);
        this.traceSteps()
    },
    deleteStep:function () {
        if (this.gameManager.getStep() > 0) {
            var fieldOld = this.fieldsSteps[this.gameManager.getStep() - 1];
            for (var i = 0; i < fieldOld.length; i++)
                for (var j = 0; j < fieldOld[i].length; j++) this.field[i][j] = fieldOld[i][j];
            this.fieldsSteps.pop();
            console.log(this.fieldsSteps.length);
            this.gameManager.setStep(this.gameManager.getStep() - 1);
            for (var i = 0; i < this.figures.length; i++) this.removeChild(this.figures[i]);
            this.figures.length = 0;
            this.findFigures()
        }
        this.traceSteps()
    },
    getNextStpe:function(step,former){
        var result = cc.p(0,0);
        if(step == null) return cc.p(1,0);

        var x = step.x;
        var y = step.y;
        if(x == 1 && y == 0){
            result.x = -1;
            result.y = 0;
        }
        else if(x == -1 && y == 0){
            result.x = 0;
            result.y = 1;
        }
        else if(x == 0 && y == 1){
            result.x = 0;
            result.y = -1;
        }

        else return null;

        if (former == null) return result;

        if(result.x ==  1 && former.x == -1) return this.getNextStpe(result,former);
        if(result.x ==  -1 && former.x == 1) return this.getNextStpe(result,former);
        if(result.y ==  1 && former.y == -1) return this.getNextStpe(result,former);
        if(result.y ==  -1 && former.y == 1) return this.getNextStpe(result,former);

        return result;
    },

    logResult:function(){
        var  s = "";
        for(var index = 0 ; index < this._arrayResult.length;index ++)
        {
            s +=("[" + this._arrayResult[index].x + "," + this._arrayResult[index].y + "]");
        }

        cc.log(s);
    },
    traceSteps:function() {
    }
});
