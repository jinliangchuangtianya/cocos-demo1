

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.others = [];
    },
    onCollisionEnter(other, self){
       
        if(other.node.name == 'enemy'){
             this.others.push(other.node);
        }
        
     },
     onCollisionExit(other, self){
       if(other.node.name == 'enemy'){
             for(let i=0; i< this.others.length; i++){
                 if(this.others[i].index == other.node.index){
                     this.others.splice(i, 1);
                     break;
                 }
             }
         }
     },

    update (dt) {
        //console.log( this.others)
    },
});
