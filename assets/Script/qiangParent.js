
cc.Class({
    extends: cc.Component,

    properties: {
        sprintFrames:{
            default:[],
            type:cc.SpriteFrame
        },
        qiangState:{
            default:null,
            type:cc.AudioClip
        }
    },
     onLoad () {
        this.node.zIndex = 101;
        this._mapSize = this.node.parent.getContentSize();
        this.node.position = this.setPropPos();
        this.node.opacity = 255;
        this.speed = 800;

        this.node.isAttack = this.node.playAttack = false;  //拾起/发射
        this.player = this.node.parent.getChildByName('Player');
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
            if(other.node.name == 'Player'){
                this.node.isAttack = true;
                cc.audioEngine.playEffect(this.qiangState, false)
                this.node.scale = 2;
                this.player.getComponent('Player').isQiang = true;
                this.player.getComponent('Player').qiang = this.node;
            } 
        },
        desNode(){
            this.node.parent.getComponent('map').CurrentQiang = null;
            this.node.destroy();
        },
        update (dt) {
            if(this.node.isAttack){
                
                this.node.position =  this.player.position;

                let targetPos =   this.player.getComponent('Player').moveTarge.sub(cc.v2(0, 0));//目标方向向量
                this.direction = targetPos.normalize(); //返回归一化后的向量

                let angle = targetPos.signAngle(cc.v2(0, 1));  //获取旋转的角度
                this.node.rotation = angle * 180/Math.PI;
                // this.isAttack = false;
                // this.node.isAttack = true;
            }
            if( this.node.playAttack ){
                this.node.position = this.node.position.add(this.direction.mul(this.speed*dt));
                //超出地图就销毁
                if(this.node.x < -this._mapSize.width/2 || this.node.x > this._mapSize.width/2 || this.node.y > this._mapSize.height/2 || this.node.y < -this._mapSize.height/2){
                    this.desNode();
                }
            }
            
        },
});
