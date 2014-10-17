/**
 * Created by jopi on 14-10-2.
 */

var UserInfo = cc.Class.extend({
    _levelStars:[],

    _currentLevelIndex:0,

    loadInfo:function(){

        cc.log(jsb.fileUtils.getWritablePath());
        var str = cc.sys.localStorage.getItem("info");
        if(str == null || str == undefined || str == ""){
            this._levelStars.push(0);
            var levelNum = this.getTotalLevelNum();
            for(var index = 1 ; index < levelNum;index ++){
                this._levelStars.push(-1);
            }
        }
        else{
            var result = JSON.parse(str);
            this._levelStars = result._levelStars;
        }
    },

    getCurrentLevelIndex:function(){
        return this._currentLevelIndex;
    },
    setCurrentLevelIndex:function(index){
        this._currentLevelIndex = index;
        if(this._levelStars[this._currentLevelIndex] == -1){
            this._levelStars[this._currentLevelIndex] = 0;
        }
    },
    /**
     * 获取关卡星级
     * @param {Number} levelIndex
     * @returns {*}
     */
    getLevelStar:function(levelIndex){
       return this._levelStars[levelIndex];
    },

    /**
     *
     * @param {Number} levelIndex
     * @param {Number} starNum 星级
     */
    setLevelStar:function(levelIndex,starNum){
        this._levelStars[levelIndex] = starNum;
    },

    /**
     * 获取关卡总数
     * @returns {Number}
     */
    getTotalLevelNum:function(){
        return realLevelId.length;
    },

    /**
     * 获取关卡信息
     * @param {Number} levelIndex
     * @returns {*}
     */
    getLevelInfo:function(levelIndex){
        cc.log(levelIndex);
        cc.log(realLevelId[levelIndex] - 1);
        return blockLevels[realLevelId[levelIndex] - 1];
    },

    /**
     * 保存用户信息
     */
    saveUserInfo:function(){
        var info = new Object();
        info._levelStars = this._levelStars;
        var str = JSON.stringify(info);
        cc.sys.localStorage.setItem("info",str);
    }
})

var _currentUser = null;

/**
 *
 * @returns {UserInfo}
 */
UserInfo.getCurrentUser = function(){
    if(_currentUser == null){
        _currentUser = new UserInfo();
        _currentUser.loadInfo();
    }
    return _currentUser;
}