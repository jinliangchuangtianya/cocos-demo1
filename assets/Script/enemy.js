let EnemyConfig = window.EnemyConfig

cc.Class({
    extends: cc.Component,

    properties: {
       bossNamePrefab:{
           default:null,
           type:cc.Prefab
       },
       healthNodePrefab:{
            default:null,
            type:cc.Prefab
       },
       bullNodes:{
           default:[],
           type:cc.Prefab
       },
       wormDieMusic:{
           default:null,
           type:cc.AudioClip
       },
       whaleDieMusic:{
            default:null,
            type:cc.AudioClip
       },
       gunmanDieMusic:{
            default:null,
            type:cc.AudioClip
        },
        warriorDieMusic:{
            default:null,
            type:cc.AudioClip
        },
       boss1DieMusic:{
            default:null,
            type:cc.AudioClip
       },
       boss2DieMusic:{
            default:null,
            type:cc.AudioClip
        },
       createName:'boss_1'
    },
    onLoad () {

        this.node.getComponent(cc.MotionStreak).enabled = false;
        this.player = this.node.parent.getChildByName('Player');

        this.bossName = cc.instantiate(this.bossNamePrefab);
        this.enemyHealthbar = cc.instantiate(this.healthNodePrefab);
        this.bossName.parent =  this.enemyHealthbar.parent = this.node.parent;

        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        //this.manager.enabledDebugDraw = true;

        this.isCollider = false;
        this.disPos = cc.v2(0, 0);
        
        this._mapSize = this.node.parent.getContentSize();
        this.config = EnemyConfig[this.createName];
 
        this.speed = this.config.speed_default;
       
        this.node.position = this.setBossPos();
        //this.node.opacity = this.bossName.opacity = this.enemyHealthbar.opacity = 255;

        this.targetPos = this.setBossPos();

        this.anim = this.node.getChildByName('bossNode').getComponent(cc.Animation);
        this.animAttack = this.anim.getAnimationState(this.createName + '_attack');

        this.animRun = this.anim.getAnimationState(this.createName + '_run');
        this.animSprint = this.anim.getAnimationState(this.createName + '_sprint');
        this.animDie = this.anim.getAnimationState(this.createName + '_die');
        this.animAttack.onStop = this.animAttackStop.bind(this);
        this.animDie.onStop = this.animDieStop.bind(this);

      

        this.timerSprintStart = false;
        this.sprintStart = false;
        this.timerStart();

        this.currentProgressBar = this.totalProgressBar =  this.config.health;
        this.setState(EnemyConfig.defaultState);

        this.node.prevPos = this.node.currentPos = cc.v2(0, 0);

        this.isLookRang = false;  //玩家是否进入当前敌人的可视范围
    },
    start(){
        this.node.opacity = this.bossName.opacity = this.enemyHealthbar.opacity = 255;
    },
    //创建子弹
    createBull(enemyName){
        if(this.createName == 'warrior'){
            this.bullNode = this.bullNodes[1];
        }
        else if(this.createName == 'boss2'){
            this.bullNode = this.bullNodes[2];
        }
        else{
            this.bullNode = this.bullNodes[0];
        }
       let bull = cc.instantiate(this.bullNode);
       bull.createName = this.createName;
       bull.attack = this.config.attck
       bull.parent = this.node.parent;
       bull.speed = this.config.speed_bull;
       bull.getComponent('bull').init(this.node.position,  this.player.position);
    },
    //随机生成boss位置
    setBossPos(){
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
    getTargerPos(){
        this.disPos =  this.targetPos.sub(this.node.position);//目标方向向量
        //判断是否移动到目标位置
        let dis =  this.node.position.sub(this.targetPos).mag();
        if(dis < 1){
            this.targetPos = this.setBossPos();
            return true;
        }
        return false
    },
    setState(state, position){
         switch (state) {
             case EnemyConfig.defaultState:  
                         break;
             case EnemyConfig.runState:
                    
                     break;
             case EnemyConfig.attackState:
                    
                 break;
             case EnemyConfig.sprintState:
                     
                 break;
             case EnemyConfig.dieState:
             if( this.state == EnemyConfig.dieState) return;
                 this.unschedule(this.timerSprintCallFunc);
                 this.animAttack.onStop = function(){};
                 this.anim.stop();
                 if(this.createName == 'worm'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 }
                 else if(this.createName == 'whale'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 }
                 else if(this.createName == 'boss1'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 }
                 else if(this.createName == 'gunman'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 } 
                 else if(this.createName == 'warrior'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 } 
                 else if(this.createName == 'boss2'){
                    cc.audioEngine.playEffect(this[this.createName + 'DieMusic'], false);
                 } 
                 this.anim.play(this.createName + '_die');
                 break;
         }
         this.state = state;         
     },
    timerStart(){
        this.sprintStart = true;
        let delayTime = Math.floor(Math.random()*3 + 2);
        this.timerSprintCallFunc = function(){
            this.targetPos = this.setBossPos();
            this.disPos =  this.targetPos.sub(this.node.position);//目标方向向量
            this.speed = this.config.sprint_speed;
            this.anim.play(this.createName + '_sprint');
            this.node.getComponent(cc.MotionStreak).enabled = true;

             this.scheduleOnce(function () {
                this.node.getComponent(cc.MotionStreak).enabled = false;
                this.sprintStart = false;
                this.speed = this.config.speed_default;
                this.anim.play(this.createName + '_run');
            }, this.config.sprint_timer); 
        }
        this.scheduleOnce(this.timerSprintCallFunc, delayTime);
    },
    animAttackStop(){
        
        if(this.isCollider){
            this.anim.play(this.createName + '_attack');
        }
        else if((this.createName == 'gunman' || this.createName == 'warrior' ||  this.createName == 'boss2') && this.isLookRang){
            this.anim.play(this.createName + '_attack');
        }
        else{
           this.anim.play(this.createName + '_run');
        }
    },
    animDieStop(){
        let enemyFadeOut = cc.fadeOut(1);

        let outCallFunc = cc.callFunc(this.desEnemy, this);
        let seq = cc.sequence(enemyFadeOut, outCallFunc);
        this.node.runAction(seq);
        this.bossName.runAction(cc.fadeOut(1));
        this.enemyHealthbar.runAction(cc.fadeOut(1));
        this.node.parent.getComponent('map').removeEnemysArr(this.node.index);
    },
    desEnemy(){
        if(this.createName == 'boss1' || this.createName == 'boss2'){
            this.node.parent.getComponent('map').isBossDie = false;
            this.node.parent.getComponent('map').isCreateQiang = true;
        }
        let random = Math.random();
        if(random > 0.5){
            this.node.parent.getComponent('map').createSupply(this.node.position, random);
        }

        this.node.destroy();
        this.bossName.destroy();
        this.enemyHealthbar.destroy();
    },
    onCollisionEnter(other, self){
        if(other.node.name == 'Player'){
            if(this.isCollider || this.state == EnemyConfig.dieState) return;
                this.isCollider = true;
                if(!this.animAttack.isPlaying){
                    this.anim.play(this.createName + '_attack');
                }
        }
    },
    onCollisionStay(other, self){
        if(other.node.name == 'qiangParent' && other.node.playAttack){
            if(!this.node.onoff){
                this.node.onoff = true;
                this.beAttack(10);
                if(this.createName == 'boss1' || this.createName == 'boss2'){
                    other.node.getComponent('qiangParent').desNode();
                }
            }
        } 
    },
    onCollisionExit(other, self){
        if(other.node.name == 'qiangParent' && other.node.playAttack){
            this.node.onoff = undefined;
        }
        if(!this.isCollider) return;
        if(other.node.name == 'Player'){
            this.isCollider = false;
        }
    },
    //被攻击
    beAttack(attack){
        if(this.state == EnemyConfig.dieState) return;
        this.currentProgressBar -= attack;
        if( this.currentProgressBar <= 0){
            this.setState(EnemyConfig.dieState);
        }
    },
    _updatePos( CurrentPos ){
        let maxW = Math.abs(this._mapSize.width/2) - Math.abs(this.node.x);
        let maxH = Math.abs(this._mapSize.height/2) - Math.abs(this.node.y);
        let maxEnemyrLevel = Math.abs(this._mapSize.width/2) - Math.abs(this.node.position.x) + this.node.width/2;
        let maxEnemyrLevelVertical = Math.abs(this._mapSize.height/2) - Math.abs(this.node.position.y) + this.node.height/2;

        if(maxEnemyrLevel <= EnemyConfig.max_distance_level){
            this.node.x = CurrentPos.x;
        }
        if(maxEnemyrLevelVertical <= EnemyConfig.max_distance_vertical){
            this.node.y = CurrentPos.y;
        }

    },
    update (dt) {
        this.enemyHealthbar.getComponent(cc.ProgressBar).progress = this.currentProgressBar/this.totalProgressBar;
        if(this.state == EnemyConfig.dieState) return;
    
        this.enemyHealthbar.x = this.bossName.x = this.node.x;
        this.bossName.y = this.node.y + 110;
        this.enemyHealthbar.y = this.node.y + 80;
        if(this.player.getComponent('Player').state == 5){
            this.isLookRang = false;
            this.isCollider = false;
            if(this.getTargerPos()) return;
        }
        else{
            if(this.isCollider || (this.animAttack.isPlaying && this.createName != 'gunman' && this.createName != 'warrior' && this.createName != 'boss2')){
                return;
            }
            
            if(this.animRun.isPlaying || ((this.createName == 'gunman' || this.createName == 'warrior' ||  this.createName == 'boss2') && !this.animSprint.isPlaying)){
                    //是否进入可视范围
                let isLookRang = this.player.position.sub(this.node.position).mag();
                
                if(isLookRang <= this.config.lookRange){
                    this.isLookRang = true;
                    this.unschedule(this.timerSprintCallFunc);
                    this.sprintStart = false;
                    this.disPos = this.player.position.sub(this.node.position);//目标方向向量
                    
                }
                else{
                    this.isLookRang = false;
                    if(!this.sprintStart){
                        this.timerStart();
                    }  
                    if(this.getTargerPos()) return;
                }
                  
            }
           
        }
        
        
        this.direction = this.disPos.normalize(); //返回归一化后的向量

        let angle = this.disPos.signAngle(cc.v2(0, 1));  //获取旋转的角度
        this.node.rotation = angle * 180/Math.PI;

         //如果当前的节点是枪手，则不改变位置直接攻击
        if((this.createName == 'gunman' || this.createName == 'warrior' || this.createName == 'boss2') && this.isLookRang){
            if(!this.animAttack.isPlaying){
                this.anim.play(this.createName + '_attack');
            } 
            return;
        }
        else if((this.createName == 'gunman' || this.createName == 'warrior' || this.createName == 'boss2') && this.animAttack.isPlaying){
            return;
        }
        
        let CurrentPos = this.node.position;
        this.node.prevPos = this.node.position;
        this.node.position = this.node.position.add(this.direction.mul(this.speed*dt));
        this._updatePos( CurrentPos );
        this.node.currentPos = this.node.position;
    },
});