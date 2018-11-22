let playerConfig = window.playerConfig
cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default:null,
            type:cc.Node
        },
        delayTime:2
    },
    onLoad () {
        this.currentTime = 0;
        this.timer = false;
        this.node.on('touchstart',()=>{
            if(this.timer == false){
                if(this.player.getComponent('Player').setState(playerConfig.sprintState) == false || this.player.getComponent('Player').supply_down_speed) return;
                this.timer = true;
                this.currentTime = 0;
                this.node.opacity = 0;
                let action = cc.fadeIn(this.delayTime);
                this.node.runAction(action);
            }
        })
    },
    update (dt) {
        if( this.timer ){
            this.currentTime += dt;
            this.node.getComponent(cc.ProgressBar).progress = this.currentTime / this.delayTime;
            if(this.currentTime >= this.delayTime){
                this.timer = false;
            }
        }
    },
});
