

cc.Class({
    extends: cc.Component,
    properties: {
       flyMusic:{
           default:null,
           type:cc.AudioClip
       },
       player:{
            default:null,
            type:cc.Node
       },
       button:{
           default:null,
           type:cc.Node
       }
    },


    onLoad () {
       
    },

    start () {

    },
    starteGame(){
        this.button.destroy();
        let anim = this.node.getComponent(cc.Animation);
        let playAnim = this.player.getComponent(cc.Animation);
        anim.play('fly');
        playAnim.play('playFly');
        //播放声音
        cc.audioEngine.setEffectsVolume(0.2);
        let flyID = cc.audioEngine.playEffect(this.flyMusic, false);
        cc.audioEngine.setFinishCallback(flyID, function(){
             cc.director.loadScene("game-scene");
        })
        
    }
    // update (dt) {},
});
