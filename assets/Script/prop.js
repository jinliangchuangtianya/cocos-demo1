let EnemyConfig = window.EnemyConfig

cc.Class({
    extends: cc.Component,
    playMusic(){
        cc.audioEngine.playEffect(this.boxMusic, false);
    },
    properties: {
       propName : '',
       supply:{
           default:null,
           type:cc.Prefab
       },
       blastStateMusic:{
            default:null,
            type:cc.AudioClip
        },
        boxMusic:{
            default:null,
            type:cc.AudioClip
        }
    },

    onLoad () {

        this.isCollis = false;
        this.anim = this.node.getComponent(cc.Animation);
        if(this.propName == 'bomb'){
            this.animBombing = this.anim.getAnimationState('bombing'); 
            this.animBombing.onStop = this.desNode.bind(this);
        }
        else if(this.propName == 'box'){
            this.boxbing = this.anim.getAnimationState('box'); 
            this.boxbing.onStop = this.desNode.bind(this);
        }
       
        
        this.fadeInNode()

        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;  

        this.node.opacity = 0;
        this._mapSize = this.node.parent.getContentSize();
        this.node.position = this.setPropPos();

        this.isDesNode = false;
        
    },

    start () {
        //this.node.opacity = 255;
    },
    fadeInNode(){
        let fadeIn = cc.fadeIn(5);
        let finished = cc.callFunc(function(){
            this.isCollis = true;
        }, this);

        let seq = cc.sequence(fadeIn, finished);
        this.node.runAction(seq);
    },
     //随机生成boss位置
     setPropPos(){
        let dis = (Math.random() - 0.5) > 0 ? 1 : -1;
        let X =   dis * (Math.random() *  this._mapSize.width/2);
        let Y =  dis * (Math.random() *  this._mapSize.height/2);
        if((this._mapSize.width/2 - Math.abs(X)) < EnemyConfig.max_distance_level){
            if(X<0){
                X = -(this._mapSize.width/2 - EnemyConfig.max_distance_level);
            }   
            else{
                X = this._mapSize.width/2 - EnemyConfig.max_distance_level;
            }
           
        }
        if((this._mapSize.height/2 - Math.abs(Y))< EnemyConfig.max_distance_vertical){
            if(Y < 0){
                Y = -(this._mapSize.height/2 - EnemyConfig.max_distance_vertical);
            }
            else{
                Y = this._mapSize.height/2 - EnemyConfig.max_distance_vertical;
            }
        }
        if(this.node.isOpenBox){
            let pos = this.node.isOpenBox;
            this.node.isOpenBox = undefined;
            return pos;
        }
        return cc.v2(X,Y)
    },
    onCollisionEnter(other, self){
        if(!this.isCollis) return;
        this.isDesNode = true;
        this.emitAttack(other);
       
    },
    onCollisionStay: function (other, self) {
        if(!this.isCollis || this.isDesNode) return;
        this.isDesNode = true;
        this.emitAttack(other)
    },
    emitAttack(other){
        if(this.propName == 'bomb'){
            cc.audioEngine.playEffect(this.blastStateMusic, false)
            this.anim.play('bombing');
            let attack = this.node.parent.getComponent('map').leve.bombAttck;
            other.node.getComponent('Player').beAttack(attack);
            
        }
        else if(this.propName == 'mogu'){
            let state =  other.node.getComponent('Player').playerConfig.supply_state.supply_down 
            other.node.getComponent('Player').addState(state);
            this.desNode();
        }
    },
    //播放box盒子打开动画
    playBoxOpen(){
        this.anim.play('box');
    },
    desNode(){
        if(this.propName == 'box'){
            this.createProp();
        }
        this.node.destroy();
    },
    createProp(){
        let random = Math.random();
        if(random > 0.2){
            let random = Math.random();
            if(random > 0.7){
                this.node.parent.getComponent('map').createEnemy(this.node.position);
            }
           else{
               let supply =  cc.instantiate(this.supply); 
               supply.parent = this.node.parent;
               supply.position = this.node.position;
           }
        }
    }
    // update (dt) {},
});
