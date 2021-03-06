var Jok = Jok || {};
Jok.JokState = function () {
    createjs.Container.call(this);
    this.name = ""
};
Jok.JokState.prototype = Object.create(createjs.Container.prototype);
Jok.JokState.prototype.constructor = Jok.JokState;
Jok.JokState.prototype.dispose = function () {};
Jok.JokState.prototype.create = function () {};
Jok.JokState.prototype.update = function () {};
SplashScreenZibbo = function () {
    Jok.JokState.call(this)
};
SplashScreenZibbo.prototype = Object.create(Jok.JokState.prototype);
SplashScreenZibbo.prototype.constructor = SplashScreenZibbo;
SplashScreenZibbo.prototype.create = function () {
    console.log("SplashScreenZibbo.create");
    var container = new createjs.Container;
    this.addChild(container);
    this.shape = new createjs.Shape;
    this.shape.x = -(new Jok.JokG).width / 2;
    this.shape.y = -(new Jok.JokG).height / 2;
    this.shape.graphics.beginFill("rgba(255,255,255,1)").rect(0, 0, (new Jok.JokG).width, (new Jok.JokG).height);
    container.addChild(this.shape);
    var bmp = new createjs.Bitmap((new Jok.JokG).queue.getResult("zibboLogoBig"));
    bmp.x = -bmp.getBounds().width / 2;
    bmp.y = -bmp.getBounds().height / 2;
    container.addChild(bmp);
    console.log("bmp.x = " + bmp.x);
    this.timeBegin = createjs.Ticker.getTime();
    this.transScreen = true;
    container.on("click", createjs.proxy(ZibboUtils.logoAction, this));
    container.cursor = "pointer";
    if ((new Jok.JokG).showZibbo) {
        console.log("new Jok.JokG().showZibbo = " + (new Jok.JokG).showZibbo);
        var logoData = (new Jok.JokG).apiZibbo.Branding.getLogo();
        this.buttonLogo = new MyButtonBase(null, new createjs.Point(-204, 302), new createjs.Point(1, 1), "");
        this.buttonLogo.addBmpTTT(new createjs.Bitmap(logoData.image), true, logoData.width, logoData.height)
    }
};
SplashScreenZibbo.prototype.openUrl = function () {
    ZibboUtils.logoAction()
};
SplashScreenZibbo.prototype.update = function () {
    if (createjs.Ticker.getTime() - this.timeBegin > 4E3 && this.transScreen) {
        this.transScreen = false;
        (new Jok.JokG).jokEngine.transitionScreen(new MainMenu, null, null)
    }
};
ZibboUtils = function () {};
ZibboUtils.prototype.constructor = ZibboUtils;
ZibboUtils.walkAction = function () {
    ZibboUtils.buttonAction("walkthrough")
};
ZibboUtils.moreAction = function () {
    ZibboUtils.buttonAction("more_games")
};
ZibboUtils.logoAction = function () {
    ZibboUtils.buttonAction("logo")
};
ZibboUtils.buttonAction = function (nameButton) {
    var linkData = GameAPI.Branding.getLink(nameButton);
    console.log("ZibboUtils.buttonAction nameButton = " + nameButton + " linkData[action] =  " + linkData["action"]);
    if (linkData["action"] == null) ZibboUtils.openUrl("http://www.zibbo.com");
    else linkData["action"].apply(null)
};
ZibboUtils.openUrl = function (url) {
    url = url || "http://www.zibbo.com";
    var newWin = window.open(url, "_blank");
    newWin.focus()
};
MyButtonBase = function (actionFunc, pos, scaleBegin, nameAnimDown) {
    createjs.Container.call(this);
    this.actionFunc = actionFunc;
    this._actionDefault = null;
    this.x = pos.x;
    this.y = pos.y;
    this._scaleBegin = scaleBegin;
    this.scaleX = this._scaleBegin.x;
    this.scaleY = this._scaleBegin.y;
    if (nameAnimDown)
        if (nameAnimDown.length > 0) {
            this.sprDown = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, nameAnimDown);
            this.sprDown.stop();
            this.addChild(this.sprDown)
        }
    this.onWork();
    this.TIME_ANIM = 300;
    this.SCALE_ANIM = 1.11;
    this.tweenSize = null;
    this.eventScaleBegin = createjs.proxy(this.scaleBegin, this);
    this.eventScaleEnd = createjs.proxy(this.scaleEnd, this)
};
MyButtonBase.prototype = Object.create(createjs.Container.prototype);
MyButtonBase.prototype.constructor = MyButtonBase;
MyButtonBase.prototype.addBmpTTT = function (bmp, center, width, height) {
    console.log("bmp = " + bmp);
    console.log("MyButtonBase.prototype.addBmpTTT  width = " + width);
    if (width);
    else if (bmp.getBounds()) {
        width = bmp.getBounds().width;
        height = bmp.getBounds().height
    } else {
        width = 202;
        height = 50
    }
    if (center) {
        bmp.x = -width / 2;
        bmp.y = -height / 2
    }
    var hitArea = new createjs.Shape((new createjs.Graphics).beginFill("#000000").drawRect(bmp.x, bmp.y, width, height));
    this.hitArea = hitArea;
    this.addChild(bmp);
    console.log("this.addChild(bmp);")
};
MyButtonBase.prototype.initUp = function (nameAnimUp) {
    this.sprUp = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, nameAnimUp);
    this.sprUp.stop();
    this.addChild(this.sprUp)
};
MyButtonBase.prototype.action = function (evt) {
    if (this.tweenSize == null) {
        (new MusicManager).playMouse();
        if (this.actionFunc != null) this.actionFunc();
        this.tweenSize = createjs.Tween.get(this).to({
            scaleX: this._scaleBegin.x * this.SCALE_ANIM,
            scaleY: this._scaleBegin.y * this.SCALE_ANIM
        }, this.TIME_ANIM, createjs.Ease.quartInOut).call(this.eventScaleBegin)
    }
};
MyButtonBase.prototype.scaleBegin = function (evt) {
    this.tweenSize = createjs.Tween.get(this).to({
        scaleX: this._scaleBegin.x,
        scaleY: this._scaleBegin.y
    }, this.TIME_ANIM, createjs.Ease.quartInOut).call(this.eventScaleEnd)
};
MyButtonBase.prototype.scaleEnd = function (evt) {
    this.tweenSize = null
};
MyButtonBase.prototype.onSetAction = function (actionDefault) {
    this.offWork();
    this._actionDefault = actionDefault;
    this.onWork()
};
MyButtonBase.prototype.onWork = function () {
    if (!this.hasEventListener("click"))
        if (this._actionDefault != null) this.on("click", this._actionDefault);
        else this.eventAction = this.on("click", createjs.proxy(this.action, this));
    this.cursor = "pointer"
};
MyButtonBase.prototype.offWork = function () {
    console.log("MyButtonBase.prototype.offWork");
    if (this.hasEventListener("click")) this.off("click", this.eventAction);
    this.cursor = "arrow"
};
FieldContainer = function (field, gameManager) {
    createjs.Container.call(this);
    this.gameManager = gameManager;
    this.field = field;
    this.fieldsSteps = [];
    this.addSaveStep();
    this.x = -this.gameManager.FIELD_WIDTH / 2 * this.gameManager.CELL_SIZE + this.gameManager.CELL_SIZE;
    this.y = -207;
    this.BLUE_ID = 1;
    this.ORANGE_ID = 2;
    this.BLACK_ID = 3;
    this.PURPLE_ID = 4;
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
    this.initMouse()
};
FieldContainer.prototype = Object.create(createjs.Container.prototype);
FieldContainer.prototype.constructor = FieldContainer;
FieldContainer.prototype.initMouse = function () {
    this.stage = (new Jok.JokG).stage;
    this._mouseDown = false;
    this._step = false;
    this._oldPos = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
    this.onMouse();
    this.MOUSE_X_Y_DIFF_MIN = 5;
    this.MOUSE_PATH_MIN = 3
};
FieldContainer.prototype.offMouse = function () {
    this.stage.off("stagemousemove", this.eventMove);
    this.stage.off("stagemousedown", this.eventMouseDown);
    this.stage.off("stagemouseup", this.eventMouseUp)
};
FieldContainer.prototype.onMouse = function () {
    this.eventMove = this.stage.on("stagemousemove", createjs.proxy(this.cccMouseMove, this));
    this.eventMouseDown = this.stage.on("stagemousedown", createjs.proxy(this.cccMouseDown, this));
    this.eventMouseUp = this.stage.on("stagemouseup", createjs.proxy(this.cccMouseUp, this))
};
FieldContainer.prototype.cccMouseMove = function (evt) {
    if (this._mouseDown && (this._step && this._moveComplete)) {
        var nowMouseX = this.stage.mouseX;
        var nowMouseY = this.stage.mouseY;
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
        else if (nowMouseY > this._oldPos.y) this.step(0, 1);
        else this.step(0, -1);
        this._oldPos.x = nowMouseX;
        this._oldPos.y = nowMouseY
    }
};
FieldContainer.prototype.cccMouseDown = function (evt) {
    this._mouseDown = true;
    this._step = true;
    this._oldPos.x = this.stage.mouseX;
    this._oldPos.y = this.stage.mouseY
};
FieldContainer.prototype.cccMouseUp = function (evt) {
    this._mouseDown = false
};
FieldContainer.prototype.findFigures = function () {
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
};
FieldContainer.prototype.cellOnFigere = function (x, y) {
    for (var i = 0; i < this.figures.length; i++)
        if (this.figures[i].isCellFigure(x, y)) return true;
    return false
};
FieldContainer.prototype.drawBlackCells = function () {
    this.drawOne(this.BLACK_ID)
};
FieldContainer.prototype.testDrawFiled = function () {
    this.removeAllChildren();
    this.drawOne(this.BLACK_ID);
    this.drawOne(this.BLUE_ID);
    this.drawOne(this.ORANGE_ID);
    this.drawOne(this.PURPLE_ID)
};
FieldContainer.prototype.drawOne = function (drawId) {
    var x = -1;
    var y = -1;
    var container = new createjs.Container;
    this.addChild(container);
    for (x = -1; x < this.gameManager.FIELD_WIDTH; x++)
        for (y = -1; y < this.gameManager.FIELD_HEIGHT; y++) {
            var spr = this.getSprTile(x, y, drawId);
            if (spr != null) {
                spr.x = this.gameManager.CELL_SIZE * x;
                spr.y = this.gameManager.CELL_SIZE * y;
                container.addChild(spr)
            }
        }
};
FieldContainer.prototype.getSprTile = function (x, y, drawId) {
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
};
FieldContainer.prototype.getTileId = function (x, y) {
    if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return 0;
    return this.field[x][y]
};
FieldContainer.prototype.getFigureByCell = function (cellX, cellY) {
    for (var i = 0; i < this.figures.length; i++)
        if (this.figures[i].isCellFigure(cellX, cellY)) return this.figures[i];
    console.log("OMFG figures = NULL )) cellX = " + cellX + " cellY = " + cellY);
    return null
};
FieldContainer.prototype.step = function (toX, toY) {
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
        (new MusicManager).playStep();
        this.gameManager.gui.starBar.addStep();
        this.addSaveStep()
    }
};
FieldContainer.prototype.checkFigureConnection = function () {
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
        if (!this.checkWin())(new MusicManager).playConnect()
    }
};
FieldContainer.prototype.checkWin = function () {
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
    this.gameManager.setGameOver();
    console.log("WIN!!!");
    dp_submitScore(-1, (this.gameManager.levelId + 1));
    return true
};
FieldContainer.prototype.moveComplete = function () {
    this._numMove++;
    if (this._numMove == this.figures.length) {
        this._moveComplete = true;
        this.checkFigureConnection()
    }
};
FieldContainer.prototype.addSaveStep = function () {
    var copyArray = [];
    for (var i = 0; i < this.field.length; i++) copyArray.push(this.field[i].slice(0));
    this.fieldsSteps.push(copyArray);
    this.traceSteps()
};
FieldContainer.prototype.deleteStep = function () {
    if (this.gameManager.gui.starBar.stepNow > 0) {
        var fieldOld = this.fieldsSteps[this.gameManager.gui.starBar.stepNow - 1];
        for (var i = 0; i < fieldOld.length; i++)
            for (var j = 0; j < fieldOld[i].length; j++) this.field[i][j] = fieldOld[i][j];
        this.fieldsSteps.pop();
        console.log(this.fieldsSteps.length);
        this.gameManager.gui.starBar.stepNow = this.gameManager.gui.starBar.stepNow - 2;
        this.gameManager.gui.starBar.addStep();
        for (var i = 0; i < this.figures.length; i++) this.removeChild(this.figures[i]);
        this.figures.length = 0;
        this.findFigures()
    }
    this.traceSteps()
};
FieldContainer.prototype.traceSteps = function () {};
FigureBlocks = function (field, gameManager, fieldContainer) {
    createjs.Container.call(this);
    this.gameManager = gameManager;
    this.field = field;
    this.fieldContainer = fieldContainer;
    this._moveClipsNames = this.fieldContainer._moveClipsNames;
    this.cells = [];
    this.id = (new Jok.JokG).getNewid();
    this.figuresStep = [];
    this.connecting = false;
    this.tweenMove = null;
    this.eventMoveComplete = createjs.proxy(this.moveComplete, this);
    this.MOVE_TIME = 320;
    this.MOVE_CLOSE_PATH = this.gameManager.CELL_SIZE / 10
};
FigureBlocks.prototype = Object.create(createjs.Container.prototype);
FigureBlocks.prototype.constructor = FigureBlocks;
FigureBlocks.prototype.setCells = function (cells) {
    this.cells = cells
};
FigureBlocks.prototype.findAllCells = function (x, y) {
    this.cells.length = 0;
    if (this.field[x][y] == 0 || this.field[x][y] == this.fieldContainer.BLACK_ID) return false;
    this.cellId = this.field[x][y];
    this.addCell(x, y);
    this.drawOne(this.cellId);
    return true
};
FigureBlocks.prototype.testFigure = function () {
    var str = "" + this.cellId + "    ";
    for (var i = 0; i < this.cells.length; i++) str += "" + this.cells[i].x + " " + this.cells[i].y + "     ";
    console.log(str)
};
FigureBlocks.prototype.addCell = function (x, y) {
    if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return;
    if (this.field[x][y] != this.cellId) return;
    if (!this.isCellFigure(x, y)) {
        this.cells.push(new createjs.Point(x, y));
        this.addCell(x - 1, y);
        this.addCell(x + 1, y);
        this.addCell(x, y - 1);
        this.addCell(x, y + 1)
    }
};
FigureBlocks.prototype.isCellFigure = function (x, y) {
    var i = 0;
    for (i = 0; i < this.cells.length; i++)
        if (this.cells[i].x == x && y == this.cells[i].y) return true;
    return false
};
FigureBlocks.prototype.drawOne = function (drawId) {
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
};
FigureBlocks.prototype.casheAllTTTT = function () {};
FigureBlocks.prototype.getSprTile = function (x, y, drawId) {
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
};
FigureBlocks.prototype.getTileId = function (x, y) {
    if (x <= -1 || (y <= -1 || (x >= this.gameManager.FIELD_WIDTH || y >= this.gameManager.FIELD_HEIGHT))) return 0;
    if (this.isCellFigure(x, y)) return this.field[x][y];
    return 0
};
FigureBlocks.prototype.step = function (toX, toY) {
    this.step_id = this.gameManager.STEP_CLOSE;
    this.figuresStep.length = 0;
    var cellsFigures = [];
    for (var i = 0; i < this.cells.length; i++) {
        var step = this.stepCell(i, toX, toY);
        if (step == this.gameManager.STEP_CLOSE) return this.gameManager.STEP_CLOSE;
        if (step == this.gameManager.STEP_CLOSE_FIGURE) cellsFigures.push(new createjs.Point(this.cells[i].x + toX, this.cells[i].y + toY))
    }
    if (cellsFigures.length == 0) {
        this.step_id = this.gameManager.STEP_OPEN;
        return this.gameManager.STEP_OPEN
    }
    for (var i = 0; i < cellsFigures.length; i++) this.addFigureStep(this.fieldContainer.getFigureByCell(cellsFigures[i].x, cellsFigures[i].y));
    this.step_id = this.gameManager.STEP_CLOSE_FIGURE;
    return this.gameManager.STEP_CLOSE_FIGURE
};
FigureBlocks.prototype.addFigureStep = function (figure) {
    if (figure == null) return;
    for (var i = 0; i < this.figuresStep.length; i++)
        if (this.figuresStep[i].id == figure.id) return;
    this.figuresStep.push(figure)
};
FigureBlocks.prototype.stepCell = function (i, toX, toY) {
    var newX = this.cells[i].x + toX;
    var newY = this.cells[i].y + toY;
    if (newX <= -1 || (newY <= -1 || (newX >= this.gameManager.FIELD_WIDTH || newY >= this.gameManager.FIELD_HEIGHT))) return this.gameManager.STEP_CLOSE;
    var cellStepId = this.field[newX][newY];
    if (cellStepId == 0 || cellStepId == this.cellId) return this.gameManager.STEP_OPEN;
    if (cellStepId == this.fieldContainer.BLACK_ID) return this.gameManager.STEP_CLOSE;
    return this.gameManager.STEP_CLOSE_FIGURE
};
FigureBlocks.prototype.postStep = function () {
    if (this.step_id == this.gameManager.STEP_CLOSE_FIGURE)
        for (var i = 0; i < this.figuresStep.length; i++)
            if (this.figuresStep[i].step_id == this.gameManager.STEP_CLOSE) {
                this.step_id = this.gameManager.STEP_CLOSE;
                return true
            }
    return false
};
FigureBlocks.prototype.preGo = function () {
    if (this.step_id == this.gameManager.STEP_CLOSE) return;
    for (var i = 0; i < this.cells.length; i++) this.field[this.cells[i].x][this.cells[i].y] = 0
};
FigureBlocks.prototype.go = function (toX, toY) {
    if (this.step_id == this.gameManager.STEP_CLOSE) {
        this.tweenMove = createjs.Tween.get(this).to({
            x: this.x + toX * this.MOVE_CLOSE_PATH,
            y: this.y + toY * this.MOVE_CLOSE_PATH
        }, this.MOVE_TIME / 2, createjs.Ease.quartInOut).to({
            x: this.x,
            y: this.y
        }, this.MOVE_TIME / 2, createjs.Ease.quartInOut).call(this.eventMoveComplete);
        return false
    }
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i].x += toX;
        this.cells[i].y += toY;
        this.field[this.cells[i].x][this.cells[i].y] = this.cellId
    }
    this.tweenMove = createjs.Tween.get(this).to({
        x: this.x + toX * this.gameManager.CELL_SIZE,
        y: this.y + toY * this.gameManager.CELL_SIZE
    }, this.MOVE_TIME, createjs.Ease.quartInOut).call(this.eventMoveComplete);
    return true
};
FigureBlocks.prototype.moveComplete = function (tween) {
    this.fieldContainer.moveComplete()
};
FigureBlocks.prototype.connectToFigure = function (figure) {
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
};
GameManager = function () {
    Jok.JokState.call(this);
    this.FIELD_WIDTH = 10;
    this.FIELD_HEIGHT = 10;
    this.CELL_SIZE = 60.9;
    this.levelId = 51;
    this.STEP_OPEN = 0;
    this.STEP_CLOSE = 1;
    this.STEP_CLOSE_FIGURE = 2
};
GameManager.prototype = Object.create(Jok.JokState.prototype);
GameManager.prototype.constructor = GameManager;
GameManager.prototype.create = function () {
    this.loadLevel();
    console.log("GameManager.create");
    var background = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "allField_1_mc");
    this.addChild(background);
    this.gui = new GuiBlock(this);
    this.fieldContainer = new FieldContainer(this.field, this);
    this.addChild(this.fieldContainer);
    this.addChild(this.gui);
    if (this.levelId == 0) this.addChild(new HelpDialog(this))
};
GameManager.prototype.dispose = function () {
    this.fieldContainer.offMouse();
    this.gui.offButton()
};
GameManager.prototype.loadLevel = function () {
    this.field = [];
    for (var i = 0; i < this.FIELD_WIDTH; i++) {
        this.field[i] = [];
        for (var j = 0; j < this.FIELD_HEIGHT; j++) this.field[i][j] = 0
    }
    var idLevelsTT = [];
    idLevelsTT.push(1);
    idLevelsTT.push(2);
    idLevelsTT.push(4);
    idLevelsTT.push(12);
    idLevelsTT.push(48);
    idLevelsTT.push(8);
    idLevelsTT.push(10);
    idLevelsTT.push(14);
    idLevelsTT.push(3);
    idLevelsTT.push(11);
    idLevelsTT.push(5);
    idLevelsTT.push(25);
    idLevelsTT.push(15);
    idLevelsTT.push(30);
    idLevelsTT.push(6);
    idLevelsTT.push(34);
    idLevelsTT.push(16);
    idLevelsTT.push(47);
    idLevelsTT.push(7);
    idLevelsTT.push(27);
    idLevelsTT.push(40);
    idLevelsTT.push(19);
    idLevelsTT.push(51);
    idLevelsTT.push(35);
    idLevelsTT.push(13);
    idLevelsTT.push(43);
    idLevelsTT.push(38);
    idLevelsTT.push(22);
    idLevelsTT.push(23);
    idLevelsTT.push(39);
    idLevelsTT.push(49);
    idLevelsTT.push(36);
    idLevelsTT.push(20);
    idLevelsTT.push(52);
    idLevelsTT.push(17);
    idLevelsTT.push(50);
    idLevelsTT.push(21);
    idLevelsTT.push(32);
    idLevelsTT.push(31);
    idLevelsTT.push(26);
    idLevelsTT.push(37);
    idLevelsTT.push(33);
    idLevelsTT.push(29);
    idLevelsTT.push(45);
    idLevelsTT.push(28);
    idLevelsTT.push(44);
    idLevelsTT.push(18);
    idLevelsTT.push(42);
    idLevelsTT.push(9);
    idLevelsTT.push(24);
    idLevelsTT.push(46);
    idLevelsTT.push(41);
    var xmlLevels = (new Jok.JokG).queue.getResult("gameLevels_1");
    var level = xmlLevels.getElementsByTagName("Level")[idLevelsTT[this.levelId] - 1].getElementsByTagName("tiles")[0].getAttribute("id");
    this.numStar = parseInt(xmlLevels.getElementsByTagName("Level")[idLevelsTT[this.levelId] - 1].getAttribute("numStar"));
    var idNow = 0;
    for (var i = 0; i < this.FIELD_WIDTH; i++)
        for (var j = 0; j < this.FIELD_HEIGHT; j++) {
            this.field[i][j] = parseInt(level[idNow]);
            idNow++
        }
};
GameManager.prototype.restart = function () {
    var gameManager = new GameManager;
    gameManager.levelId = this.levelId;
    (new Jok.JokG).jokEngine.transitionScreen(gameManager, null, null)
};
GameManager.prototype.setPause = function () {
    this.addChild(new PauseDialog(this))
};
GameManager.prototype.toLevelSelect = function () {
    (new Jok.JokG).jokEngine.transitionScreen(new LevelSelectMenu, null, null)
};
GameManager.prototype.setGameOver = function () {
    this.addChild(new GameOverDialog(this))
};
MusicManager = function () {
    var callee = arguments.callee;
    if (callee.instance) return callee.instance;
    this._mute = false;
    this._globalMute = false;
    this._paused = false;
    var isWebAudio = createjs.Sound.activePlugin instanceof createjs.WebAudioPlugin;
    console.log("this.isWebAudio = " + createjs.Sound.activePlugin);
    this._soundSupport = isWebAudio || !isWebAudio && (!createjs.Sound.BrowserDetect.isIOS && !createjs.Sound.BrowserDetect.isAndroid);
    console.log("this._soundSupport = " + this._soundSupport);
    this.musicInstance = createjs.Sound.createInstance("mus_1");
    this.enableSound = false;
    this.eventMouseDown = (new Jok.JokG).stage.on("stagemousedown", createjs.proxy(this.cccMouseDown, this));
    var hidden = "hidden";
    var eventVisable = createjs.proxy(this.onchangeVisable, this);
    if (hidden in document) {
        console.log("mus_1 = " + document.hidden);
        if (document.hidden == true) this._globalMute = true;
        document.addEventListener("visibilitychange", eventVisable)
    } else if ((hidden = "mozHidden") in document) {
        console.log("mus_2 = " + document.mozHidden);
        if (document.mozHidden == true) this._globalMute = true;
        document.addEventListener("mozvisibilitychange", eventVisable)
    } else if ((hidden = "webkitHidden") in document) {
        console.log("mus_3 = " + document.webkitHidden);
        if (document.webkitHidden == true) this._globalMute = true;
        document.addEventListener("webkitvisibilitychange", eventVisable)
    } else if ((hidden = "msHidden") in document) {
        console.log("mus_4 = " + document.msHidden);
        if (document.hidden == true) this._globalMute = true;
        document.addEventListener("msvisibilitychange", eventVisable)
    } else if ("onfocusin" in document) {
        console.log("mus_5 = " +
            document.onfocusin);
        document.onfocusin = document.onfocusout = eventVisable
    } else {
        console.log("mus_6");
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = eventVisable
    }
    callee.instance = this
};
MusicManager.prototype.constructor = MusicManager;
MusicManager.prototype.onchangeVisable = function (evt) {
    this._globalMute = !this._globalMute;
    console.log("onchangeVisable this._globalMute = " + this._globalMute);
    if (this._globalMute) {
        if (!this._mute && this.enableSound) {
            this._paused = true;
            this.musicInstance.pause()
        }
    } else if (!this._mute && this.enableSound) this.playMusic()
};
MusicManager.prototype.cccMouseDown = function (evt) {
    console.log("this.enableSound  = " + this._globalMute);
    this.enableSound = true;
    (new Jok.JokG).stage.off("stagemousedown", this.eventMouseDown);
    this.playMusic()
};
MusicManager.prototype.playMusic = function () {
    if (!this._mute && (this.enableSound && !this._globalMute))
        if (this._paused) this.musicInstance.resume();
        else this.musicInstance.play({
            loop: -1,
            interrupt: createjs.Sound.INTERRUPT_ANY
        })
};
MusicManager.prototype.playSound = function (name, volume) {
    if (!this._mute && (this.enableSound && (this._soundSupport && !this._globalMute))) createjs.Sound.play(name, {
        volume: volume
    })
};
MusicManager.prototype.getMute = function () {
    return this._mute
};
MusicManager.prototype.setMute = function (value) {
    this._mute = value;
    if (this._mute) {
        this._paused = true;
        this.musicInstance.pause()
    } else this.playMusic()
};
MusicManager.prototype.playStar = function () {
    this.playSound("starSound", 1)
};
MusicManager.prototype.playMouse = function () {
    this.playSound("mouseClick", 1)
};
MusicManager.prototype.playWin = function () {
    this.playSound("winSound", 0.5)
};
MusicManager.prototype.playStep = function () {
    this.playSound("stepSound_1", 0.25)
};
MusicManager.prototype.playConnect = function () {
    this.playSound("connectSound", 0.4)
};
PreloadState = function () {
    Jok.JokState.call(this)
};
PreloadState.prototype = Object.create(Jok.JokState.prototype);
PreloadState.prototype.constructor = PreloadState;
PreloadState.prototype.create = function () {
    console.log("PreloadState.prototype.create");
    (new Jok.JokG).showZibbo = true;
    this.queue = (new Jok.JokG).queue;
    var manifest = [{
        src: "zibbo/Zibbo_logo_rgb-01.png",
        id: "zibboLogoBig"
    }];
    this.initAllEvent = this.queue.on("complete", createjs.proxy(this.initAll, this));
    this.queue.setMaxConnections(5);
    this.queue.loadManifest(manifest)
};
PreloadState.prototype.initAll = function (event) {
    console.log("PreloadState.initAll");
    this.queue.off("complete", this.initAllEvent);
    this._apiLoad = false;
    this._gameLoad = false;
    this.initFont();
    this.initBackground();
    this.initCookie();
    (new Jok.JokG).MAX_LEVEL = 52;
    var registeTT = [createjs.WebAudioPlugin, createjs.HTMLAudioPlugin];
    if (createjs.Sound.BrowserDetect.isFirefox) registeTT = [createjs.HTMLAudioPlugin];
    createjs.Sound.registerPlugins(registeTT);
    console.log("createjs.Sound.isReady() = " + createjs.Sound.isReady());
    this.queue = (new Jok.JokG).queue;
    createjs.Sound.alternateExtensions = ["m4a"];
    this.queue.installPlugin(createjs.Sound);
    var manifest = [{
        src: "imagesPack/BlockGame.png",
        id: "gameImg_1"
    }, {
        src: "imagesPack/BlockGame.json",
        id: "gameImgJson_1",
        type: createjs.LoadQueue.JSON
    }, {
        src: "text.json",
        id: "text_1",
        type: createjs.LoadQueue.JSON
    }, {
        src: "HelpAnim/allAnim.xml",
        id: "gameImgXml_1",
        type: createjs.LoadQueue.XML
    }, {
        src: "levels/bin/Levels.xml",
        id: "gameLevels_1",
        type: createjs.LoadQueue.XML
    }, {
        src: "audio/music/mus_1.ogg",
        id: "mus_1",
        type: createjs.LoadQueue.SOUND
    }, {
        src: "font/font.png",
        id: "fontImg_1"
    }, {
        src: "font/font.fnt",
        id: "fontDataXml_1",
        type: createjs.LoadQueue.XML
    }, {
        src: "audio/sound/mouse_1.ogg",
        id: "mouseClick",
        type: createjs.LoadQueue.SOUND
    }, {
        src: "audio/sound/StarUp_2.ogg",
        id: "starSound",
        type: createjs.LoadQueue.SOUND
    }, {
        src: "audio/sound/StarMenu.ogg",
        id: "winSound",
        type: createjs.LoadQueue.SOUND
    }, {
        src: "audio/sound/rotate_1.ogg",
        id: "stepSound_1",
        type: createjs.LoadQueue.SOUND
    }, {
        src: "audio/sound/connect.ogg",
        id: "connectSound",
        type: createjs.LoadQueue.SOUND
    }];
    this.queue.on("progress", createjs.proxy(this.handleProgress, this));
    this.queue.on("complete", createjs.proxy(this.handleComplete, this));
    this.queue.on("fileload", createjs.proxy(this.handleFileLoad, this));
    this.queue.setMaxConnections(5);
    this.queue.loadManifest(manifest);
    GameAPI.loadAPI(createjs.proxy(this.apiLoad, this))
};
PreloadState.prototype.initFont = function () {};
PreloadState.prototype.initCookie = function () {
    if (typeof window.localStorage != "undefined")
        if (window.localStorage.getItem("levelComplete") == null) window.localStorage.setItem("levelComplete", 1)
};
PreloadState.prototype.initBackground = function () {
    var shape = new createjs.Shape;
    shape.x = -(new Jok.JokG).width / 2;
    shape.y = -(new Jok.JokG).height / 2;
    shape.graphics.beginFill("rgba(255,255,255,1)").rect(0, 0, (new Jok.JokG).width, (new Jok.JokG).height);
    this.addChild(shape);
    this.PROGRESS_BAR_WIDTH = 580;
    this.PROGRESS_BAR_HEIGHT = 36;
    this.Y_BAR = 200;
    this.barShape = new createjs.Shape;
    this.barShape.x = -this.PROGRESS_BAR_WIDTH / 2;
    this.barShape.y = -this.PROGRESS_BAR_HEIGHT / 2 + this.Y_BAR;
    this.addChild(this.barShape);
    shape = new createjs.Shape;
    shape.x = -this.PROGRESS_BAR_WIDTH / 2;
    shape.y = -this.PROGRESS_BAR_HEIGHT / 2 + this.Y_BAR;
    shape.graphics.beginStroke("rgba(221,33,113,1)").setStrokeStyle(3).drawRoundRect(0, 0, this.PROGRESS_BAR_WIDTH, this.PROGRESS_BAR_HEIGHT, 5);
    this.addChild(shape);
    var bmp = new createjs.Bitmap((new Jok.JokG).queue.getResult("zibboLogoBig"));
    bmp.x = -bmp.getBounds().width / 2;
    bmp.y = -bmp.getBounds().height / 2;
    this.addChild(bmp);
    bmp.on("click", createjs.proxy(this.openUrl, this))
};
PreloadState.prototype.handleProgress = function (event) {
    this.barShape.graphics.beginFill("rgba(219,71,132,1)").drawRoundRect(0, 0, this.PROGRESS_BAR_WIDTH * event.progress, this.PROGRESS_BAR_HEIGHT, 5)
};
PreloadState.prototype.handleFileLoad = function (event) {};
PreloadState.prototype.handleComplete = function (event) {
    console.log("handleComplete");
    this._gameLoad = true;
    if (this._apiLoad && this._gameLoad) this.allLoadComplete()
};
PreloadState.prototype.apiLoad = function (api) {
    console.log("GameAPI version " + GameAPI.version + " loaded!");
    this._apiLoad = true;
    (new Jok.JokG).apiZibbo = api;
    var links = api.Branding.listLinks();
    console.log("links.length = " + links.length);
    for (var tttttt in links) {
        console.log("i = " + tttttt);
        console.log("logoData[i] = " + links[tttttt])
    }
    console.log("apiLoadttt = ");
    if (this._apiLoad && this._gameLoad) this.allLoadComplete()
};
PreloadState.prototype.openUrl = function () {
    ZibboUtils.logoAction()
};
PreloadState.prototype.allLoadComplete = function () {
    console.log("PreloadState.prototype.allLoadComplete");
    new MusicManager;
    console.log("new MusicManager();");
    (new Jok.JokG).text.init(this.queue.getResult("text_1"));
    console.log('new Jok.JokG().text.init(this.queue.getResult("text_1"));');
    (new Jok.JokG).animLoader.loadAnim(this.queue.getResult("gameImgXml_1"), this.queue.getResult("gameImgJson_1"), this.queue.getResult("gameImg_1"));
    console.log('new Jok.JokG().animLoader.loadAnim(this.queue.getResult("gameImgXml_1"), this.queue.getResult("gameImgJson_1"), this.queue.getResult("gameImg_1"));');
    (new Jok.JokG).animLoader.loadBitmapFont(this.queue.getResult("fontDataXml_1"), this.queue.getResult("fontImg_1"));
    console.log('ew Jok.JokG().animLoader.loadBitmapFont(this.queue.getResult("fontDataXml_1"), this.queue.getResult("fontImg_1"));');
    (new Jok.JokG).jokEngine.switchState(new SplashScreenZibbo)
};
GuiBlock = function (gameManager) {
    createjs.Container.call(this);
    this.y = -315;
    this.gameManager = gameManager;
    var addToX = 85;
    this.buttonPause = new MyButtonBase(createjs.proxy(this.pauseAction, this), new createjs.Point(-270, 0), new createjs.Point(1, 1), "buttonBase_mc");
    this.buttonPause.initUp("buttonStop_mc");
    this.addChild(this.buttonPause);
    this.buttonRestart = new MyButtonBase(createjs.proxy(this.restartAction, this), new createjs.Point(this.buttonPause.x + addToX, 0), new createjs.Point(1, 1), "buttonBase_mc");
    this.buttonRestart.initUp("buttonRestart_mc");
    this.addChild(this.buttonRestart);
    this.buttonUndo = new MyButtonBase(createjs.proxy(this.removeStepAction, this), new createjs.Point(this.buttonRestart.x + addToX, 0), new createjs.Point(1, 1), "buttonBase_mc");
    this.buttonUndo.initUp("buttonUndo_mc");
    this.addChild(this.buttonUndo);
    this.initStarBar(gameManager.numStar);
    var txt = new createjs.BitmapText("Level " + (gameManager.levelId + 1), (new Jok.JokG).animLoader.fontSheet);
    txt.scaleX = txt.scaleY = 0.4;
    txt.x = (new Jok.JokG).width / 2 - txt.getBounds().width * txt.scaleX - 5;
    txt.y = -24 / 2 - 20;
    this.addChild(txt);
    if ((new Jok.JokG).showZibbo) {
        var config = {};
        config["type"] = ".png";
        config["width"] = 202;
        config["height"] = 50;
        var logoData = (new Jok.JokG).apiZibbo.Branding.getLogo(config);
        this.buttonLogo = new MyButtonBase(createjs.proxy(ZibboUtils.logoAction, this), new createjs.Point(250, 15), new createjs.Point(0.9, 0.9), "");
        this.buttonLogo.onSetAction(logoData.action);
        this.buttonLogo.addBmpTTT(new createjs.Bitmap(logoData.image), true, logoData.width, logoData.height);
        this.addChild(this.buttonLogo)
    }
};
GuiBlock.prototype = Object.create(createjs.Container.prototype);
GuiBlock.prototype.constructor = GuiBlock;
GuiBlock.prototype.moreAction = function (evt) {
    ZibboUtils.buttonAction("more_games")
};
GuiBlock.prototype.offButton = function () {
    this.buttonPause.offWork();
    this.buttonRestart.offWork();
    if (this.buttonLogo) this.buttonLogo.offWork()
};
GuiBlock.prototype.onButton = function () {
    this.buttonPause.onWork();
    this.buttonRestart.onWork();
    if (this.buttonLogo) this.buttonLogo.onWork()
};
GuiBlock.prototype.pauseAction = function () {
    this.gameManager.setPause()
};
GuiBlock.prototype.restartAction = function () {
    this.gameManager.restart()
};
GuiBlock.prototype.removeStepAction = function () {
    this.gameManager.fieldContainer.deleteStep()
};
GuiBlock.prototype.initStarBar = function (numStar) {
    this.starBar = new StarBar(numStar);
    this.addChild(this.starBar)
};
LevelButton = function (pos, scaleBegin, idLevel, open) {
    MyButtonBase.call(this, null, pos, scaleBegin, "LevelSelectButton_mc");
    this.idLevel = idLevel;
    this.initStar();
    this._open = open;
    if (!open) this.sprDown.currentAnimationFrame = 1;
    var levelText = new createjs.BitmapText("" + this.idLevel, (new Jok.JokG).animLoader.fontSheet);
    levelText.scaleX = levelText.scaleY = 0.6;
    levelText.y = -levelText.getBounds().height / 2 * levelText.scaleX - 17;
    levelText.x = -levelText.getBounds().width / 2 * levelText.scaleX;
    this.addChild(levelText);
    this.actionFunc = createjs.proxy(this.levelAction, this)
};
LevelButton.prototype = Object.create(MyButtonBase.prototype);
LevelButton.prototype.constructor = LevelButton;
LevelButton.prototype.initStar = function () {
    this.sprDown.stop();
    var numStar = 0;
    if (typeof window.localStorage != "undefined") {
        if (window.localStorage.getItem("levelStar" + this.idLevel) == null) window.localStorage.setItem("levelStar" + this.idLevel, 0);
        numStar = window.localStorage.getItem("levelStar" + this.idLevel)
    }
    var ttPos = 30;
    for (var i = 0; i < 3; i++) {
        var spr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "LevelMenuStar_mc");
        spr.x = -ttPos + ttPos * i;
        spr.y = 30;
        spr.stop();
        if (i < numStar) spr.currentAnimationFrame = 1;
        else spr.currentAnimationFrame = 0;
        this.addChild(spr)
    }
};
LevelButton.prototype.levelAction = function () {
    if (this._open) {
        var gameManager = new GameManager;
        gameManager.levelId = this.idLevel - 1;
        (new Jok.JokG).jokEngine.transitionScreen(gameManager, null, null)
    }
};
SoundButton = function (pos, scaleBegin) {
    MyButtonBase.call(this, null, pos, scaleBegin, "MainMenuButton_1_mc");
    this.initUp("ButtonMusic_mc");
    if ((new MusicManager).getMute()) this.sprUp.currentAnimationFrame = 1;
    this.actionFunc = createjs.proxy(this.soundAction, this)
};
SoundButton.prototype = Object.create(MyButtonBase.prototype);
SoundButton.prototype.constructor = SoundButton;
SoundButton.prototype.soundAction = function () {
    (new MusicManager).setMute(!(new MusicManager).getMute());
    if ((new MusicManager).getMute()) this.sprUp.currentAnimationFrame = 1;
    else this.sprUp.currentAnimationFrame = 0
};
StarBar = function (numStar) {
    createjs.Container.call(this);
    this.x = 60;
    this.y = 0;
    this.txtColor = "#FFF";
    this.MASK_SIZE = 237.15;
    this.barMask = new createjs.Shape;
    this.barMask.x = -this.MASK_SIZE / 2;
    this.barMask.y = -25 / 2;
    this.barMask.graphics.beginFill("rgba(255,255,255,1)").rect(0, 0, this.MASK_SIZE, 25);
    this.starNum = 3;
    this.stepNow = 0;
    this.numStarThree = numStar;
    this.numStarTwo = Math.ceil(this.numStarThree * 0.4) + numStar;
    this.numStarOne = Math.ceil(this.numStarTwo * 0.5) + this.numStarTwo;
    this.numStarAll = this.numStarOne + 1;
    console.log("this.numStarThree = " +
        this.numStarThree);
    console.log("this.numStarTwo = " + this.numStarTwo);
    console.log("this.numStarOne = " + this.numStarOne);
    console.log("this.numStarAll = " + this.numStarAll);
    this.initStars();
    var sprDown = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "scoreBar_1_mc");
    this.addChild(sprDown);
    this.barSpr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "scoreBar_2_mc");
    this.barSpr.mask = this.barMask;
    this.addChild(this.barSpr);
    var sprUp = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "scoreBar_3_mc");
    this.addChild(sprUp);
    this.stepTxt = new createjs.BitmapText("0", (new Jok.JokG).animLoader.fontSheet);
    this.stepTxt.scaleX = this.stepTxt.scaleY = 0.35;
    this.stepTxt.x = 0;
    this.stepTxt.y = -this.stepTxt.getBounds().height / 2 + 20;
    this.addChild(this.stepTxt)
};
StarBar.prototype = Object.create(createjs.Container.prototype);
StarBar.prototype.constructor = StarBar;
StarBar.prototype.initStars = function () {
    var addX = 0;
    this.starTree = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "star_3_mc");
    this.starTree.stop();
    this.starTree.y = -25;
    this.starTree.x = -this.MASK_SIZE / 2 + this.MASK_SIZE * (this.numStarThree / this.numStarAll) + addX;
    this.addChild(this.starTree);
    this.starTwoo = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "star_2_mc");
    this.starTwoo.y = this.starTree.y;
    this.starTwoo.stop();
    this.starTwoo.x = -this.MASK_SIZE / 2 + this.MASK_SIZE * (this.numStarTwo / this.numStarAll) +
        addX;
    this.addChild(this.starTwoo);
    this.starOne = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "star_1_mc");
    this.starOne.y = this.starTree.y;
    this.starOne.stop();
    this.starOne.x = -this.MASK_SIZE / 2 + this.MASK_SIZE * (this.numStarOne / this.numStarAll) + addX;
    this.addChild(this.starOne);
    this.initStarsText(this.numStarThree);
    this.initStarsText(this.numStarTwo);
    this.initStarsText(this.numStarOne)
};
StarBar.prototype.initStarsText = function (numb) {
    var addX = 0;
    var sizeFont = 20;
    var posY = 25;
    var starTreeText = new createjs.BitmapText("" + numb, (new Jok.JokG).animLoader.fontSheet);
    starTreeText.scaleX = starTreeText.scaleY = 0.3;
    starTreeText.y = posY - starTreeText.getBounds().height / 2 * starTreeText.scaleX;
    starTreeText.x = -this.MASK_SIZE / 2 + this.MASK_SIZE * (numb / this.numStarAll) - starTreeText.getBounds().width / 2 * starTreeText.scaleX + addX;
    this.addChild(starTreeText)
};
StarBar.prototype.addStep = function () {
    if (this.stepNow == this.numStarThree) {
        this.starTree.currentAnimationFrame = 1;
        this.starNum--
    } else if (this.stepNow == this.numStarTwo) {
        this.starTwoo.currentAnimationFrame = 1;
        this.starNum--
    } else if (this.stepNow == this.numStarOne) {
        this.starOne.currentAnimationFrame = 1;
        this.starNum--
    }
    this.stepNow++;
    this.stepTxt.text = "" + this.stepNow;
    if (this.stepNow >= this.numStarAll) this.barMask.x = 9999;
    else this.barMask.x = -this.MASK_SIZE / 2 + this.MASK_SIZE * (this.stepNow / this.numStarAll)
};
CreditsDialog = function (mainMenu) {
    createjs.Container.call(this);
    this.mainMenu = mainMenu;
    this.mainMenu.offButton();
    var color = "#000";
    var font = " Verdana";
    var shapeRect = new createjs.Shape;
    shapeRect.x = -(new Jok.JokG).width / 2;
    shapeRect.y = -(new Jok.JokG).height / 2;
    shapeRect.graphics.beginFill("rgba(255,255,255,0.5)").rect(0, 0, (new Jok.JokG).width, (new Jok.JokG).height);
    this.addChild(shapeRect);
    var txt = new createjs.Text((new Jok.JokG).text.getText("developed"), "36px" + font, color);
    txt.x = -txt.getBounds().width / 2;
    txt.y = -260;
    this.addChild(txt);
    var txt_1 = new createjs.Text((new Jok.JokG).text.getText("aizat"), "36px" + font, color);
    txt_1.x = -txt_1.getBounds().width / 2;
    txt_1.y = txt.y + 55;
    this.addChild(txt_1);
    var txt_2 = new createjs.Text((new Jok.JokG).text.getText("email"), "36px" + font, color);
    txt_2.x = -txt_2.getBounds().width / 2;
    txt_2.y = txt_1.y + 80;
    this.addChild(txt_2);
    this.alpha = 0;
    createjs.Tween.get(this).to({
        alpha: 1
    }, 400, createjs.Ease.quadOut);
    this.eventMouseDown = (new Jok.JokG).stage.on("stagemousedown", createjs.proxy(this.cccMouseDown, this))
};
CreditsDialog.prototype = Object.create(createjs.Container.prototype);
CreditsDialog.prototype.constructor = CreditsDialog;
CreditsDialog.prototype.cccMouseDown = function (evt) {
    (new Jok.JokG).stage.off("stagemousedown", this.eventMouseDown);
    this.mainMenu.onButton();
    if (this.parent) this.parent.removeChild(this)
};
GameDialogBase = function (gameManager) {
    createjs.Container.call(this);
    this.gameManager = gameManager;
    gameManager.gui.offButton();
    gameManager.fieldContainer.offMouse();
    var shapeRect = new createjs.Shape;
    shapeRect.x = -(new Jok.JokG).width / 2;
    shapeRect.y = -(new Jok.JokG).height / 2;
    shapeRect.graphics.beginFill("rgba(0,0,0,0.45)").rect(0, 0, (new Jok.JokG).width, (new Jok.JokG).height);
    this.addChild(shapeRect);
    this.addChild(new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "FrameDialogBase_mc"));
    this.alpha = 0;
    createjs.Tween.get(this).to({
        alpha: 1
    }, 400, createjs.Ease.quadOut).call(createjs.proxy(this.alphaEnd, this))
};
GameDialogBase.prototype = Object.create(createjs.Container.prototype);
GameDialogBase.prototype.constructor = GameDialogBase;
GameDialogBase.prototype.restartAction = function () {
    this.gameManager.restart()
};
GameDialogBase.prototype.backAction = function () {
    this.gameManager.toLevelSelect()
};
GameDialogBase.prototype.onAll = function () {
    this.gameManager.gui.onButton();
    this.gameManager.fieldContainer.onMouse()
};
GameDialogBase.prototype.alphaEnd = function () {};
GameDialogBase.prototype.moreAction = function (evt) {
    if ((new Jok.JokG).showZibbo) ZibboUtils.buttonAction("more_games")
};
GameOverDialog = function (gameManager) {
    GameDialogBase.call(this, gameManager);
    (new MusicManager).playWin();
    var button = new MyButtonBase(createjs.proxy(this.playAction, this), new createjs.Point(157, 69), new createjs.Point(0.9, 0.9), "MainMenuButton_1_mc");
    button.initUp("ButtonPlay_mc");
    this.addChild(button);
    var scaleTT = 0.6;
    button = new MyButtonBase(createjs.proxy(this.backAction, this), new createjs.Point(-19, 90), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("ButtonBack_mc");
    this.addChild(button);
    button = new MyButtonBase(createjs.proxy(this.restartAction, this), new createjs.Point(-180, 90), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("buttonRestart_2_mc");
    this.addChild(button);
    this.idAdd = 0;
    if (typeof window.localStorage != "undefined") {
        var numLevelComplete = window.localStorage.getItem("levelComplete");
        if (this.gameManager.levelId + 1 >= numLevelComplete) window.localStorage.setItem("levelComplete", this.gameManager.levelId + 2);
        numLevelComplete = window.localStorage.getItem("levelStar" +
            (this.gameManager.levelId + 1));
        console.log("numLevelComplete =" + numLevelComplete);
        if (this.gameManager.gui.starBar.starNum > numLevelComplete) window.localStorage.setItem("levelStar" + (this.gameManager.levelId + 1), this.gameManager.gui.starBar.starNum)
    }
    if ((new Jok.JokG).showZibbo) {
        var config = {};
        config["type"] = ".png";
        config["width"] = 202;
        config["height"] = 50;
        var logoData = (new Jok.JokG).apiZibbo.Branding.getLogo(config);
        this.buttonLogo = new MyButtonBase(createjs.proxy(ZibboUtils.logoAction, this), new createjs.Point(0, 960 / 2 + 50), new createjs.Point(1, 1), "");
        this.buttonLogo.onSetAction(logoData.action);
        this.buttonLogo.addBmpTTT(new createjs.Bitmap(logoData.image), true, logoData.width, logoData.height);
        this.addChild(this.buttonLogo)
    }
    this._oldMute = (new MusicManager).getMute();
    if ((new Jok.JokG).showZibbo) {
        console.log("GameAPI = " + GameAPI);
        console.log("GameAPI.GameBreak = " + GameAPI.GameBreak);
        console.log("adsTT = " + GameAPI.GameBreak.request(createjs.proxy(this.adsBegin, this), createjs.proxy(this.adsEnd, this)))
    }
};
GameOverDialog.prototype = Object.create(GameDialogBase.prototype);
GameOverDialog.prototype.constructor = GameOverDialog;
GameOverDialog.prototype.playAction = function (evt) {
    if (this.gameManager.levelId + 1 < (new Jok.JokG).MAX_LEVEL) {
        var gameManager = new GameManager;
        gameManager.levelId = this.gameManager.levelId + 1;
        (new Jok.JokG).jokEngine.transitionScreen(gameManager, null, null)
    } else this.gameManager.toLevelSelect()
};
GameOverDialog.prototype.adsBegin = function () {
    console.log("showAds");
    if (!this._oldMute)(new MusicManager).setMute(true)
};
GameOverDialog.prototype.adsEnd = function () {
    console.log("adsEnd");
    if ((new MusicManager).getMute() != this._oldMute)(new MusicManager).setMute(this._oldMute)
};
GameOverDialog.prototype.alphaEnd = function () {
    if (this.buttonLogo) createjs.Tween.get(this.buttonLogo).to({
        y: 300
    }, 2500, createjs.Ease.elasticOut);
    var starX = 157;
    var starY = -65;
    var numStar = this.gameManager.gui.starBar.starNum;
    for (var i = 0; i < 3; i++)
        if (this.idAdd == i) {
            var spr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "starGameOver_mc");
            spr.x = -starX + starX * i;
            spr.y = starY;
            spr.stop();
            if (i < numStar) {
                spr.currentAnimationFrame = 0;
                spr.scaleX = spr.scaleY = 0;
                createjs.Tween.get(spr).to({
                    scaleX: 1,
                    scaleY: 1
                }, 1500, createjs.Ease.elasticOut);
                (new MusicManager).playStar()
            } else {
                spr.currentAnimationFrame = 1;
                spr.alpha = 0;
                createjs.Tween.get(spr).to({
                    alpha: 1
                }, 800, createjs.Ease.quadOut)
            }
            this.addChild(spr)
        }
    this.idAdd++;
    if (this.idAdd < 3) createjs.Tween.get(this).to({
        x: this.x
    }, 500, createjs.Ease.linear).call(createjs.proxy(this.alphaEnd, this))
};
HelpDialog = function (gameManager) {
    createjs.Container.call(this);
    this.gameManager = gameManager;
    this.field = this.gameManager.field;
    this.finger = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "Finger_mc");
    this.addChild(this.finger);
    this.SCALE_BEGIN = 1.5;
    this.Y_BEGIN = 200;
    this.Y_END = 100;
    this.X_END = 200;
    this.finger.y = this.Y_BEGIN;
    this.finger.stop();
    this.finger.scaleX = this.finger.scaleY = this.SCALE_BEGIN;
    this.finger.alpha = 0;
    this.tween = createjs.Tween.get(this.finger, {
        loop: true
    }).to({
        x: -this.X_END,
        y: this.Y_END,
        alpha: 1,
        scaleX: 1,
        scaleY: 1
    }, 500, createjs.Ease.quadOut).call(createjs.proxy(this.stepHelp_1, this)).wait(750).to({
        x: this.X_END
    }, 900, createjs.Ease.quadInOut).wait(750).call(createjs.proxy(this.stepHelp_2, this)).to({
        scaleX: this.SCALE_BEGIN,
        scaleY: this.SCALE_BEGIN,
        y: this.Y_END + 50,
        alpha: 0
    }, 500, createjs.Ease.quadInOut).to({
        x: 0,
        y: this.Y_BEGIN
    }, 1500, createjs.Ease.quadInOut)
};
HelpDialog.prototype = Object.create(createjs.Container.prototype);
HelpDialog.prototype.constructor = GameDialogBase;
HelpDialog.prototype.stepHelp_1 = function () {
    this.finger.currentAnimationFrame = 1;
    this.checkDelete()
};
HelpDialog.prototype.stepHelp_2 = function () {
    this.finger.currentAnimationFrame = 0;
    this.checkDelete()
};
HelpDialog.prototype.checkDelete = function () {
    if (this.field[3][3] == 0) {
        if (this.parent) this.parent.removeChild(this);
        createjs.Tween.removeTweens(this.finger)
    }
};
LevelSelectMenu = function () {
    Jok.JokState.call(this)
};
LevelSelectMenu.prototype = Object.create(Jok.JokState.prototype);
LevelSelectMenu.prototype.constructor = LevelSelectMenu;
LevelSelectMenu.prototype.create = function () {
    this.MAX_LEVEL_ID = Math.floor((new Jok.JokG).MAX_LEVEL / 20);
    this._nowLevelId = 0;
    var background = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "MainMenuBack_mc");
    this.addChild(background);
    this.buttonBack = new MyButtonBase(createjs.proxy(this.backsAction, this), new createjs.Point(-(new Jok.JokG).width / 2 + 64, 300), new createjs.Point(0.67, 0.67), "MainMenuButton_1_mc");
    this.buttonBack.initUp("ButtonBack_mc");
    this.addChild(this.buttonBack);
    this.buttonLevelBack = new MyButtonBase(createjs.proxy(this.buttonLevelBackAction, this), new createjs.Point(-(new Jok.JokG).width / 2 + 40, 0), new createjs.Point(1, 1), "ButtonLevel_mc");
    this.buttonLevelBack.sprDown.stop();
    this.buttonLevelBack.sprDown.currentAnimationFrame = 1;
    this.addChild(this.buttonLevelBack);
    this.buttonLevelNext = new MyButtonBase(createjs.proxy(this.buttonLevelNextAction, this), new createjs.Point(-this.buttonLevelBack.x, 0), new createjs.Point(-1, 1), "ButtonLevel_mc");
    this.buttonLevelNext.sprDown.stop();
    this.addChild(this.buttonLevelNext);
    if ((new Jok.JokG).showZibbo) {
        var config = {};
        config["type"] = ".png";
        config["width"] = 202;
        config["height"] = 50;
        console.log("new Jok.JokG().showZibbo = " + (new Jok.JokG).showZibbo);
        var logoData = (new Jok.JokG).apiZibbo.Branding.getLogo(config);
        console.log("logoData.image = " + logoData.image);
        this.buttonLogo = new MyButtonBase(createjs.proxy(ZibboUtils.logoAction, this), new createjs.Point(213, 311), new createjs.Point(1, 1), "");
        this.buttonLogo.onSetAction(logoData.action);
        this.buttonLogo.addBmpTTT(new createjs.Bitmap(logoData.image), true, logoData.width, logoData.height);
        this.addChild(this.buttonLogo)
    }
    this.drawLevelButtons()
};
LevelSelectMenu.prototype.backsAction = function (evt) {
    (new Jok.JokG).jokEngine.transitionScreen(new MainMenu, null, null)
};
LevelSelectMenu.prototype.moreAction = function (evt) {
    ZibboUtils.buttonAction("more_games")
};
LevelSelectMenu.prototype.buttonLevelBackAction = function (evt) {
    if (this._nowLevelId <= 0) return;
    this.buttonLevelNext.sprDown.currentAnimationFrame = 0;
    this._nowLevelId--;
    if (this._nowLevelId == 0) this.buttonLevelBack.sprDown.currentAnimationFrame = 1;
    this.drawLevelButtons()
};
LevelSelectMenu.prototype.buttonLevelNextAction = function (evt) {
    if (this._nowLevelId >= this.MAX_LEVEL_ID) return;
    this.buttonLevelBack.sprDown.currentAnimationFrame = 0;
    this._nowLevelId++;
    if (this._nowLevelId == this.MAX_LEVEL_ID) this.buttonLevelNext.sprDown.currentAnimationFrame = 1;
    this.drawLevelButtons()
};
LevelSelectMenu.prototype.drawLevelButtons = function () {
    if (this._levelButtonsContainer) this._levelButtonsContainer.removeAllChildren();
    else {
        this._levelButtonsContainer = new createjs.Container;
        this.addChild(this._levelButtonsContainer)
    }
    var yBegin = 100;
    var yTo = 712 - yBegin - 140;
    yTo = yTo / 4;
    var xBegin = 140;
    var xTo = ((new Jok.JokG).width - xBegin - xBegin) / 3;
    xBegin -= (new Jok.JokG).width / 2;
    yBegin -= 712 / 2;
    var levelAdd = this._nowLevelId * 20 + 1;
    var numLevelComplete = 1;
    if (typeof window.localStorage != "undefined") numLevelComplete = window.localStorage.getItem("levelComplete");
    for (var i = 0; i < 5; i++)
        for (var j = 0; j < 4; j++) {
            if ((new Jok.JokG).MAX_LEVEL >= levelAdd) {
                var levelButton = new LevelButton(new createjs.Point(xBegin + xTo * j, yBegin + yTo * i), new createjs.Point(1, 1), levelAdd, numLevelComplete >= levelAdd);
                this._levelButtonsContainer.addChild(levelButton)
            }
            levelAdd++
        }
};
MainMenu = function () {
    Jok.JokState.call(this)
};
MainMenu.prototype = Object.create(Jok.JokState.prototype);
MainMenu.prototype.constructor = MainMenu;
MainMenu.prototype.create = function () {
    var background = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "MainMenuBack_mc");
    this.addChild(background);
    this.buttonMusic = new SoundButton(new createjs.Point((new Jok.JokG).width / 2 - 100, 280), new createjs.Point(0.67, 0.67));
    this.addChild(this.buttonMusic);
    this.eventCredits = createjs.proxy(this.creditsAction, this);
    this.buttonCredits = new MyButtonBase(this.eventCredits, new createjs.Point((new Jok.JokG).width / 2 - 45, -315), new createjs.Point(1, 1), "buttonBase_mc");
    this.buttonCredits.initUp("ButtonCredits_mc");
    this.addChild(this.buttonCredits);
    this.eventPlay = createjs.proxy(this.playAction, this);
    this.buttonPlay = new MyButtonBase(this.eventPlay, new createjs.Point(0, 10), new createjs.Point(1, 1), "MainMenuButton_1_mc");
    this.buttonPlay.initUp("ButtonPlay_mc");
    this.addChild(this.buttonPlay);
    this.buttonMore = new MyButtonBase(createjs.proxy(ZibboUtils.moreAction, this), new createjs.Point(0, 170), new createjs.Point(0.67, 0.67), "MainMenuButton_1_mc");
    this.buttonMore.initUp("ButtonMoreGames_mc");
    this.addChild(this.buttonMore);
    if ((new Jok.JokG).showZibbo) {
        var config = {};
        config["type"] = ".png";
        config["width"] = 202;
        config["height"] = 50;
        var logoData = (new Jok.JokG).apiZibbo.Branding.getLogo();
        console.log("logoData = " + logoData);
        for (var tttttt in logoData) {
            console.log("i = " + tttttt);
            console.log("logoData[i] = " + logoData[tttttt])
        }
        this.buttonLogo = new MyButtonBase(createjs.proxy(ZibboUtils.logoAction, this), new createjs.Point(-204, 302), new createjs.Point(1, 1), "");
        this.buttonLogo.onSetAction(logoData.action);
        this.buttonLogo.addBmpTTT(new createjs.Bitmap(logoData.image), true, logoData.width, logoData.height);
        this.addChild(this.buttonLogo)
    }
    this.buttonPlay.scaleX = this.buttonPlay.scaleY = 0;
    createjs.Tween.get(this.buttonPlay).to({
        scaleX: 1,
        scaleY: 1
    }, 1800, createjs.Ease.elasticOut);
    var minnnn = 390;
    var titleSpr = new createjs.Sprite(Jok.JokG().animLoader.spriteSheet, "MainMenuTitle_mc");
    titleSpr.y = -((new Jok.JokG).height - minnnn) / 2 + (new Jok.JokG).height / 2 - minnnn;
    this.addChild(titleSpr);
    titleSpr.scaleX = titleSpr.scaleY = 0;
    createjs.Tween.get(titleSpr).to({
        scaleX: 1,
        scaleY: 1
    }, 2500, createjs.Ease.elasticOut)
};
MainMenu.prototype.onButton = function () {
    this.buttonCredits.onWork();
    this.buttonPlay.onWork();
    this.buttonMusic.onWork();
    this.buttonMore.onWork();
    if (this.buttonLogo) this.buttonLogo.onWork()
};
MainMenu.prototype.offButton = function () {
    this.buttonCredits.offWork();
    this.buttonPlay.offWork();
    this.buttonMusic.offWork();
    this.buttonMore.offWork();
    if (this.buttonLogo) this.buttonLogo.offWork()
};
MainMenu.prototype.logoAction = function (evt) {
    if ((new Jok.JokG).showZibbo) ZibboUtils.buttonAction("logo")
};
MainMenu.prototype.moreAction = function (evt) {
    if ((new Jok.JokG).showZibbo) ZibboUtils.buttonAction("more_games")
};
MainMenu.prototype.creditsAction = function (evt) {
    this.addChild(new CreditsDialog(this))
};
MainMenu.prototype.playAction = function (evt) {
    (new Jok.JokG).jokEngine.transitionScreen(new LevelSelectMenu, null, null)
};
PauseDialog = function (gameManager) {
    GameDialogBase.call(this, gameManager);
    var button = new MyButtonBase(createjs.proxy(this.playAction, this), new createjs.Point(0, -51), new createjs.Point(0.9, 0.9), "MainMenuButton_1_mc");
    button.initUp("ButtonPlay_mc");
    this.addChild(button);
    var scaleTT = 0.6;
    var posY = 90;
    var posX = 170;
    button = new MyButtonBase(createjs.proxy(this.backAction, this), new createjs.Point(0, posY), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("ButtonBack_mc");
    this.addChild(button);
    button = new MyButtonBase(createjs.proxy(this.restartAction, this), new createjs.Point(-posX, posY), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("buttonRestart_2_mc");
    this.addChild(button);
    button = new SoundButton(new createjs.Point(posX, posY), new createjs.Point(scaleTT, scaleTT));
    this.addChild(button);
    button = new MyButtonBase(createjs.proxy(ZibboUtils.moreAction, this), new createjs.Point(-180, -67), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("ButtonMoreGames_mc");
    this.addChild(button);
    button = new MyButtonBase(createjs.proxy(ZibboUtils.walkAction, this), new createjs.Point(180, -67), new createjs.Point(scaleTT, scaleTT), "MainMenuButton_1_mc");
    button.initUp("ButtonWalk_mc");
    this.addChild(button)
};
PauseDialog.prototype = Object.create(GameDialogBase.prototype);
PauseDialog.prototype.constructor = PauseDialog;
PauseDialog.prototype.walkAction = function (evt) {
    if ((new Jok.JokG).showZibbo) ZibboUtils.buttonAction("walkthrough")
};
PauseDialog.prototype.playAction = function (evt) {
    createjs.Tween.get(this).to({
        alpha: 0
    }, 400, createjs.Ease.quadOut).call(createjs.proxy(this.playActionEnd, this))
};
PauseDialog.prototype.playActionEnd = function (evt) {
    if (this.parent) this.parent.removeChild(this);
    this.onAll()
};
Jok.JokAnimLoader = function () {
    this.data = null
};
Jok.JokAnimLoader.prototype.constructor = Jok.JokAnimLoader;
Jok.JokAnimLoader.prototype.loadAnim = function (xmlArchorData, jsonFrameData, image) {
    console.log("xmlArchorData = " + xmlArchorData);
    console.log("jsonFrameData = " + jsonFrameData);
    console.log("image = " + image);
    console.log("image.srs = " + image.src);
    console.log("image.getContext = " + image.getContext);
    console.log("image.data = " + image.data);
    console.log("jsonFrameData.frames[0].filename = " + jsonFrameData.frames[0].frame.x);
    var allNode = 0;
    var lastName;
    console.log("Jok.JokAnimLoader.prototype.loadAnim  1");
    this.spriteSheetData = {
        framerate: 24,
        images: [image],
        frames: [],
        animations: {}
    };
    var idFrame = 0;
    console.log("Jok.JokAnimLoader.prototype.loadAnim  2");
    while (true) {
        var parametr = xmlArchorData.getElementsByTagName("Parametr")[allNode];
        if (parametr) {
            lastName = parametr.getAttribute("n");
            var oneFrameNum = 0;
            while (true) {
                var oneFrame = parametr.getElementsByTagName("info")[oneFrameNum];
                if (oneFrame) {
                    var xStr = -parseInt(oneFrame.getAttribute("x"));
                    var yStr = -parseInt(oneFrame.getAttribute("y"));
                    var rect = this.getFrameData(jsonFrameData, this.getFrameName(lastName, oneFrameNum));
                    this.spriteSheetData.frames.push([rect.x, rect.y, rect.w, rect.h, 0, xStr, rect.h - yStr]);
                    oneFrameNum++;
                    idFrame++
                } else break
            }
            this.spriteSheetData.animations[lastName] = [idFrame - oneFrameNum, idFrame - 1];
            allNode++
        } else break
    }
    console.log("Jok.JokAnimLoader.prototype.loadAnim  3");
    this.spriteSheet = new createjs.SpriteSheet(this.spriteSheetData);
    console.log("Jok.JokAnimLoader.prototype.loadAnim  4")
};
Jok.JokAnimLoader.prototype.getFrameName = function (nameFrame, numFrame) {
    var name = "000" + numFrame;
    name = name.substr(name.length - 3, 3);
    return nameFrame + "_" + name + ".png"
};
Jok.JokAnimLoader.prototype.getFrameData = function (jsonFrameData, nameFrame) {
    var i = 0;
    while (jsonFrameData.frames[i]) {
        if (jsonFrameData.frames[i].filename == nameFrame) return {
            x: parseInt(jsonFrameData.frames[i].frame.x),
            y: parseInt(jsonFrameData.frames[i].frame.y),
            w: parseInt(jsonFrameData.frames[i].frame.w),
            h: parseInt(jsonFrameData.frames[i].frame.h)
        };
        i++
    }
    return null
};
Jok.JokAnimLoader.prototype.loadBitmapFont = function (xmlFontData, image) {
    var dataCharId = {};
    dataCharId[65] = "A";
    dataCharId[66] = "B";
    dataCharId[67] = "C";
    dataCharId[68] = "D";
    dataCharId[69] = "E";
    dataCharId[70] = "F";
    dataCharId[71] = "G";
    dataCharId[72] = "H";
    dataCharId[73] = "I";
    dataCharId[74] = "J";
    dataCharId[75] = "K";
    dataCharId[76] = "L";
    dataCharId[77] = "M";
    dataCharId[78] = "N";
    dataCharId[79] = "O";
    dataCharId[80] = "P";
    dataCharId[81] = "Q";
    dataCharId[82] = "R";
    dataCharId[83] = "S";
    dataCharId[84] = "T";
    dataCharId[85] = "U";
    dataCharId[86] = "V";
    dataCharId[87] = "W";
    dataCharId[88] = "X";
    dataCharId[89] = "Y";
    dataCharId[90] = "Z";
    dataCharId[47] = "/";
    dataCharId[48] = "0";
    dataCharId[49] = "1";
    dataCharId[50] = "2";
    dataCharId[51] = "3";
    dataCharId[52] = "4";
    dataCharId[53] = "5";
    dataCharId[54] = "6";
    dataCharId[55] = "7";
    dataCharId[56] = "8";
    dataCharId[57] = "9";
    var allNode = 0;
    this.fontData = {
        images: [image],
        frames: [],
        animations: {}
    };
    var idFrame = 0;
    while (true) {
        var parametr = xmlFontData.getElementsByTagName("chars")[0];
        parametr = parametr.getElementsByTagName("char")[allNode];
        if (parametr) {
            var id = parseInt(parametr.getAttribute("id"));
            var x = parseInt(parametr.getAttribute("x"));
            var y = parseInt(parametr.getAttribute("y"));
            var width = parseInt(parametr.getAttribute("width"));
            var height = parseInt(parametr.getAttribute("height"));
            var xoffset = parseInt(parametr.getAttribute("xoffset"));
            var yoffset = parseInt(parametr.getAttribute("yoffset"));
            if (width > 0 && height > 0) {
                xoffset = yoffset = 0;
                this.fontData.frames.push([x, y, width, height, 0, xoffset, yoffset]);
                this.fontData.animations[dataCharId[id]] = {
                    "frames": [idFrame]
                };
                idFrame++
            }
            allNode++
        } else break
    }
    console.log("allNode = " + allNode);
    this.fontSheet = new createjs.SpriteSheet(this.fontData)
};
Jok.JokEngine = function (nameCanvas) {
    console.log("Jok.JokEngine");
    this.state = null;
    (new Jok.JokG).init(nameCanvas, this);
    this.stage = (new Jok.JokG).stage;
    this.asd = 55;
    this.fpsLabel = new createjs.Text("-- fps", "bold 14px Arial", "#000");
    this.fpsLabel.x = 10 - (new Jok.JokG).width / 2;
    this.fpsLabel.y = 20 - 712 / 2
};
Jok.JokEngine.prototype.constructor = Jok.JokEngine;
Jok.JokEngine.prototype.initState = function (aState) {
    console.log("Jok.JokEngine.prototype.initState");
    this.switchState(aState);
    if (!createjs.Ticker.hasEventListener("tick")) {
        this.tickEvent = createjs.proxy(this.tick, this);
        createjs.Ticker.on("tick", this.tickEvent)
    }
};
Jok.JokEngine.prototype.transitionScreen = function (aState, funcBegin, funcEnd) {
    (new Jok.JokTransitionScreenBase).init(funcBegin, funcEnd, aState, 1E3)
};
Jok.JokEngine.prototype.switchState = function (aState) {
    if (this.state) {
        this.stage.removeChild(this.state);
        this.state.dispose()
    }
    this.state = aState;
    this.state.create();
    this.stage.addChildAt(this.state, 0)
};
Jok.JokEngine.prototype.tick = function (event) {
    this.state.update();
    this.fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    this.stage.update(event)
};
Jok.JokG = function () {
    var callee = arguments.callee;
    if (callee.instance) return callee.instance;
    this.queue = new createjs.LoadQueue(true, "assets/");
    this.animLoader = new Jok.JokAnimLoader;
    this._idNow = 0;
    this.text = new Jok.JokTextData;
    callee.instance = this
};
Jok.JokG.prototype.constructor = Jok.JokG;
Jok.JokG.prototype.getNewid = function () {
    return this._idNow++
};
Jok.JokG.prototype.init = function (nameCanvas, jokEngine) {
    console.log("Jok.JokG.prototype.init");
    this.canvas = this.createGameCanvas(nameCanvas);
    this.stage = new createjs.Stage(this.canvas);
    this.stage.autoClear = false;
    this.stage.enableMouseOver(15);
    this.jokEngine = jokEngine;
    this.resize();
    var resizeFunc = createjs.proxy(this.resize, this);
    window.addEventListener("resize", resizeFunc, false);
    window.addEventListener("viewportchange", resizeFunc, false);
    window.addEventListener("viewportready", resizeFunc, false);
    createjs.Touch.enable(this.stage);
    createjs.Ticker.setFPS(30);
    this.fonts = {};
    console.log("this.jokEngine = " + this.jokEngine)
};
Jok.JokG.prototype.createGameCanvas = function (nameCanvas) {
    console.log("Jok.JokG.prototype.createGameCanvas");
    var container = document.getElementById(nameCanvas);
    return container
};
Jok.JokG.prototype.addFont = function (nameIdFont, nameFont) {
    this.fonts[nameIdFont] = nameFont
};
Jok.JokG.prototype.resize = function () {
    console.log("Jok.JokG.prototype.resize");
    var GAME_WIDTH = 640;
    var GAME_MIN_HEIGHT = 712;
    var GAME_MAX_HEIGHT = 960;
    var widthWindow = window.innerWidth;
    var heightWindow = window.innerHeight;
    var portainLockCanvas = document.getElementById("portraitLock");
    if (!this.isLandscape()) {
        portainLockCanvas.style.display = "none";
        (new Jok.JokG).canvas.style.display = "block"
    } else {
        portainLockCanvas.style.display = "block";
        (new Jok.JokG).canvas.style.display = "none"
    }
    var scale = Math.min(widthWindow / GAME_WIDTH, heightWindow / GAME_MIN_HEIGHT);
    var canvas = (new Jok.JokG).canvas;
    canvas.width = GAME_WIDTH;
    canvas.height = Math.min(Math.floor(heightWindow / scale), GAME_MAX_HEIGHT);
    var scaleWidth = Math.floor(canvas.width * scale);
    var scaleHeight = Math.floor(canvas.height * scale);
    canvas.style.width = scaleWidth + "px";
    canvas.style.height = scaleHeight + "px";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.stage.x = this.width / 2;
    this.stage.y = this.height / 2;
    var parent = canvas.parentElement;
    parent.style.width = scaleWidth + "px";
    parent.style.height = scaleHeight + "px";
    var v = (widthWindow - scaleWidth) / 2;
    parent.style.left = v + "px";
    var w = (heightWindow - scaleHeight) / 2;
    parent.style.top = w + "px"
};
Jok.JokG.prototype.isLandscape = function () {
    console.log("Jok.JokG.prototype.isLandscape");
    if (createjs.Sound.BrowserDetect.isIOS || (createjs.Sound.BrowserDetect.isAndroid || createjs.Sound.BrowserDetect.isBlackberry)) return window.innerWidth > window.innerHeight && window.innerWidth <= 640;
    return false
};
Jok.JokTextData = function () {
    this.text = null;
    this._noText = "textNotFound"
};
Jok.JokTextData.prototype.constructor = Jok.JokTextData;
Jok.JokTextData.prototype.init = function (jsonText) {
    this.text = jsonText;
    console.log(this.text)
};
Jok.JokTextData.prototype.getText = function (idText) {
    if (this.text != null) {
        var i = 0;
        while (true) {
            var textTT = this.text.texts[i];
            if (textTT) {
                if (textTT.id == idText) return textTT.text
            } else break;
            i++
        }
        return this._noText
    }
    return "this.text=null"
};
Jok.JokTransitionScreenBase = function () {
    createjs.Container.call(this);
    this.shape = new createjs.Shape;
    this.shape.x = -(new Jok.JokG).width / 2;
    this.shape.y = -(new Jok.JokG).height / 2;
    this.shape.graphics.beginFill("rgba(255,255,255,1)").rect(0, 0, (new Jok.JokG).width, (new Jok.JokG).height);
    this.addChild(this.shape);
    this.eventTween = createjs.proxy(this.endTeen, this)
};
Jok.JokTransitionScreenBase.prototype = Object.create(createjs.Container.prototype);
Jok.JokTransitionScreenBase.prototype.constructor = Jok.JokTransitionScreenBase;
Jok.JokTransitionScreenBase.prototype.init = function (FBegin, FEnd, state, time) {
    this._state = state;
    this._funcBegin = FBegin;
    this._funcEnd = FEnd;
    (new Jok.JokG).stage.addChild(this);
    this.alpha = 0;
    this._time = time / 2;
    createjs.Tween.get(this).to({
        alpha: 1
    }, this._time, createjs.Ease.quadOut).call(this.eventTween)
};
Jok.JokTransitionScreenBase.prototype.endTeen = function (evt) {
    if (this.alpha > 0.9) {
        createjs.Tween.get(this).to({
            alpha: 0
        }, this._time, createjs.Ease.quadOut).call(this.eventTween);
        if (this._funcBegin != null) this._funcBegin();
        (new Jok.JokG).jokEngine.switchState(this._state)
    } else {
        (new Jok.JokG).stage.removeChild(this);
        if (this._funcEnd != null) this._funcEnd()
    }
};