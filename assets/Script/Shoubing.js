let playerConfig = window.playerConfig
cc.Class({
    extends: cc.Component,

    properties: {
        disNode:{
            default:null,
            type:cc.Node
        },
        Player:{
            default:null,
            type:cc.Node
        }
    },

    onLoad () {
        this.node.on('touchstart', this.disStart, this);
        this.node.on('touchmove', this.disMove, this);
        this.node.on('touchend', this.disEnd, this);
        this.node.on('touchcancel', this.disEnd, this);

        this.prevPos = cc.v2(0, 0);
    },
    disStart(ev){
        this.prevPos = this.node.convertToNodeSpaceAR(ev.getLocation());
    },
    disMove(ev){
        let position = this.node.convertToNodeSpaceAR(ev.getLocation());
        if(Math.abs(position.x) < this.node.width/2){
            this.disNode.x = position.x;
        }
        if(Math.abs(position.y) < this.node.width/2){
            this.disNode.y = position.y;
        }
        this.Player.getComponent('Player').setState( playerConfig.runState, position );
        //this.Player.getComponent('Player').setDisEndPos(this.prevPos, position);
        this.prevPos = position;
    },
    disEnd(ev){
        this.disNode.position = cc.v2(0, 0);
        //this.Player.getComponent('Player').isPlayChange = true;
        this.Player.getComponent('Player').setState( playerConfig.defaultState );
    }

    // update (dt) {},
});
