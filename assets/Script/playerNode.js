
cc.Class({
    extends: cc.Component,
    attackEnemy(arg){
       this.node.parent.getComponent('Player').attackEnemy(arg);
    },
    properties: {
       
    },
});
