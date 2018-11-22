

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentPos = cc.v2();
        this.targetPos = cc.v2();

        this._mapSize = this.node.parent.getContentSize();
    },
    init(currentPos, targetPos){
        this.targetPos = targetPos;
        this.node.opacity = 255;
        this.node.position =  this.currentPos = currentPos;
        let disPos =  this.targetPos.sub(this.currentPos);//目标方向向量
        this.direction = disPos.normalize(); //返回归一化后的向量

        let angle = disPos.signAngle(cc.v2(0, 1));  //获取旋转的角度
        this.node.rotation = angle * 180/Math.PI;
        this.node.position = this.node.position.add(this.direction.mul(90));

        if(this.node.createName == 'boss2'){
            let action = cc.repeatForever(cc.rotateBy(0.3, -360));
            this.node.runAction(action);
        }
    },
    update (dt) {
        this.node.position = this.node.position.add(this.direction.mul(this.node.speed*dt));  //子弹速度
        //超出地图就销毁
        if(this.node.x < -this._mapSize.width/2 || this.node.x > this._mapSize.width/2 || this.node.y > this._mapSize.height/2 || this.node.y < -this._mapSize.height/2){
            this.node.destroy();
        }
    },
});
