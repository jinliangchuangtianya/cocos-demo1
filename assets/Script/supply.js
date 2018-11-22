
cc.Class({
    extends: cc.Component,

    properties: {
        supplys:{
            default:[],
            type: cc.SpriteFrame
        },
        minTime : 10,
        maxTime : 20
    },


    onLoad () {
        let random = Math.floor(Math.random()*(this.maxTime - this.minTime + 1) + this.minTime);
        this.scheduleOnce(function() {
            this.node.destroy();
        }, random);


        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //manager.enabledDebugDraw = true;

        this.random = Math.floor(Math.random()*this.supplys.length);
        this.getComponent(cc.Sprite).spriteFrame = this.supplys[ this.random];
    },
    onCollisionEnter(other, self) {
        other.node.getComponent('Player').addState(this.random);
        this.node.destroy();
    }
    // update (dt) {},
});
