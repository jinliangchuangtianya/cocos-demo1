
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    gameRestart(){
        cc.director.loadScene('game-scene');
    }

    // update (dt) {},
});
