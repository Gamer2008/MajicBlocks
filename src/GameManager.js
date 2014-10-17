/**
 * Created by huaiyao on 14-10-3.
 */
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