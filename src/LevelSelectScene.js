/**
 * Created by jopi on 14-10-2.
 */

var LevelSelectScene = cc.Scene.extend({

    ctor:function() {
        this._super();
        this.init();
    },

    init:function(){
        this._super();
        this.levelSelectLayer = new LevelSelectLayer();
        this.addChild(this.levelSelectLayer);
    },


    onEnter:function () {
        this._super();
    },

    onExit:function(){
        this._super();
    }
});
