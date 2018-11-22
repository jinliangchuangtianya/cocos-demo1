let playerConfig = window.playerConfig
cc.Class({
    extends: cc.Component,

    properties: {
        MainCamera:{
            default:null,
            type:cc.Node
        },
        tiled:{
            default:null,
            type:cc.TiledMap
        },
        playerNum : 1,
        playerName:{
            default:null,
            type:cc.Node
        },
        playHealthbar:{
            default:null,
            type:cc.Node
        },
        attackMusic:{
            default:null,
            type:cc.AudioClip
        },
        skillAttack:{
            default:null,
            type:cc.Node
        },
        skill:{
            default:null,
            type:cc.Node
        },
        sprintMusic:{
            default:null,
            type:cc.AudioClip
        },
        runMusic:{
            default:null,
            type:cc.AudioClip
        },
        runUpMusic:{
            default:null,
            type:cc.AudioClip
        },
        dieMusic:{
            default:null,
            type:cc.AudioClip
        },
        bloodStateMusic:{
            default:null,
            type:cc.AudioClip
        },
        attackStateMusic:{
            default:null,
            type:cc.AudioClip
        },
        poisonStateMusic:{
            default:null,
            type:cc.AudioClip
        },
        qiangRunMusic:{
            default:null,
            type:cc.AudioClip
        },
        beAttackMusic:{
            default:null,
            type:cc.AudioClip
        },
        qiangrun2Music:{
            default:null,
            type:cc.AudioClip
        },
        skillMusic:{
            default:null,
            type:cc.AudioClip
        },
        avatar:{
            default:null,
            type:cc.Sprite
        },
        playing:true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerName.getComponent(cc.Label).string = window.playerConfig.nickName;
        if(window.wx){
            cc.loader.load({
                url:  window.playerConfig.avatarUrl,
                type: 'png'
            }, (err, texture) => {
                if (err) console.error(err);
                this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });
        }

        this.runMusicID = null;
        //捡到枪的状态
        this.isQiang = false;
        //中毒状态
        this.isPoisoning = false;

        this.node.zIndex = this.playHealthbar.zIndex = this.playerName.zIndex = 100;
        this.skillAttack.zIndex = 102
        this.node.getComponent(cc.MotionStreak).enabled = false;  //影子

        this.prevPos = this.currentPos = cc.v2(0, 0);

        this.others = [];  //碰撞产生时存放敌人的数组
        this.boxs = [];   //碰撞产生时存放道具箱子的数组

        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;

        this.isCollider = false;  //是否碰撞
        this.isColliderSprint = false;  //冲撞敌人状态
        this.attackEnemyNode = null;
        //this.manager.enabledDebugDraw = true;

        this.isPlayChange = true;

        this.anim = this.node.getChildByName('playerNode').getComponent(cc.Animation);
        this.skillAttackAnim = this.skillAttack.getComponent(cc.Animation);
        this.skillAnim = this.skill.getComponent(cc.Animation);
        this.skillIng = this.skillAttackAnim;
        this.animAttack = this.anim.getAnimationState('Player_attack');
        this.animSprint = this.anim.getAnimationState('Player_sprint');
        this.animDefaule = this.anim.getAnimationState('Player_default');
        this.animDeRun = this.anim.getAnimationState('Player_run');
        this.animDie = this.anim.getAnimationState('Player_die');

        this.animAttack.onStop = this.animAttackStop.bind(this);
        this.animDie.onStop = this.gameOver.bind(this);

        this.playerConfig = playerConfig['player_'+this.playerNum];
        this.attack = this.playerConfig.attack;
 
        this.setState(playerConfig.defaultState);
        
        this.moveTarge = this.sprint_direction = cc.v2(0, 1);

        this._mapSize = this.tiled.node.getContentSize();
        this._tileSize = this.tiled.getMapSize();

        this.tree = this.tiled.getLayer('tree');

        this.currentProgressBar = this.totalProgressBar = this.playerConfig.health;

        this.supply_attack_callback = null;   //增加攻击力的回调
        this.supply_sprite_callback = null;   //增加速度的回调
        this.supply_state_speed = false;    ////获得加速度的状态
        this.supply_down_speed = false;    ////减速的状态
        this.supply_down_speed_callback = null;  //减速的回调

        
    },
    setState(state, position){    
       if(!this.isPlayChange || this.state == playerConfig.dieState ) return false;
        switch (state) {
            case playerConfig.defaultState:  
                        this.node.getComponent(cc.MotionStreak).enabled = false;
                        if(!this.supply_down_speed){
                            this.speed = this.playerConfig.speed_default;
                        }
                        if(this.runMusicID){
                            cc.audioEngine.stop(this.runMusicID)
                        }
                        this.anim.play('Player_default');
                        break;
            case playerConfig.runState:
                    if(this.supply_down_speed && this.state == playerConfig.sprintState){
                        this.moveTarge = this.sprint_direction
                    }
                    else{
                        this.sprint_direction = this.moveTarge = position;
                    }
                    if(this.state != playerConfig.runState){
                        if(this.runMusicID){
                            cc.audioEngine.stop(this.runMusicID)
                        }
                        this.anim.play('Player_run');
 
                        if( this.supply_state_speed ){
                            if(!this.isPoisoning){
                                this.runMusicID = cc.audioEngine.playEffect(this.runUpMusic, true);
                            }
                            this.node.getComponent(cc.MotionStreak).enabled = true;
                            // 使动画播放速度加速
                            this.animDeRun.speed = 2;
                            this.speed = this.playerConfig.supply_state.supply_speed;
                            this.node.getComponent(cc.MotionStreak).color = new cc.Color(255, 255,255);
                        }
                        else{
                            if(!this.isPoisoning){
                                this.runMusicID = cc.audioEngine.playEffect(this.runMusic, true);
                            }
                        }
                    }
                    break;
            case playerConfig.attackState:
                    if(this.supply_down_speed) return;
                    if(this.state != playerConfig.attackState){
                        this.isPlayChange = false; 
                        if(this.isQiang){
                            cc.audioEngine.playEffect(this.qiangRunMusic, false);
                        }
                        else{
                           if(this.attack == this.playerConfig.attack){
                                cc.audioEngine.playEffect(this.attackMusic, false);
                                this.skillIng = this.skillAttackAnim;
                           }
                           else{
                                cc.audioEngine.playEffect(this.skillMusic, false);
                                this.skillIng = this.skillAnim;
                           }
                           this.skillIng.play('attackSkill');
                        }
                        this.anim.play('Player_attack');
                     
                        if( this.supply_state_speed ){
                            this.node.getComponent(cc.MotionStreak).enabled = false;
                        }
                    }
                break;
            case playerConfig.sprintState:
                        if(this.supply_down_speed) return;
                        this.isPlayChange = false; 
                        this.node.getComponent(cc.MotionStreak).enabled = true;
                       
                        this.isColliderSprint = true;
                        cc.audioEngine.playEffect(this.sprintMusic, false);
                        this.node.getComponent(cc.MotionStreak).color = new cc.Color(92, 15, 20, 150);
                       
                       
                        this.speed = this.playerConfig.sprint_speed;
                        this.anim.play('Player_sprint');
                        
                        this.scheduleOnce(function() {
                            this.node.getComponent(cc.MotionStreak).enabled = false;
                            this.isColliderSprint = false;
                            this.unsetEnemyIsColliderSprint();
                            this.isPlayChange = true;
                            // 这里的 this 指向 component
                            if(!this.supply_down_speed){
                                this.setState(playerConfig.defaultState)
                            }
                        }, this.playerConfig.sprint_timer);
                       
                break;
            case playerConfig.dieState:
                this.anim.stop();
                this.anim.play('Player_die');  
                if(this.runMusicID){
                    cc.audioEngine.stop(this.runMusicID);
                }     
                cc.audioEngine.stopMusic();
                cc.audioEngine.playEffect(this.dieMusic, false); 
                break;
        }
        this.state = state;
    },
    //取消enemy身上的isAttackSprint状态
    unsetEnemyIsColliderSprint(){
        let enemys = this.node.parent.getComponent('map').enemysArr;
        for(let i=0; i<enemys.length; i++){
            if(enemys[i].isAttackSprint == true){
                enemys[i].isAttackSprint = undefined;
            }
        }
    },
    addState(index){
        switch (index) {
            case 0:
                this.attack = this.playerConfig.attack + 5;
                cc.audioEngine.playEffect(this.attackStateMusic, false);
                 
                this.unschedule( this.supply_attack_callback );
                this.supply_attack_callback = function() {
                    this.attack = this.playerConfig.attack;
                }
                this.scheduleOnce(this.supply_attack_callback , this.playerConfig.supply_state.supply_attack_Duration);
                break;
            case 1:
                this.currentProgressBar +=5;
                cc.audioEngine.playEffect(this.bloodStateMusic, false)
                if(this.currentProgressBar >= this.playerConfig.health){
                    this.currentProgressBar = this.playerConfig.health;
                    //console.log(this.currentProgressBar)
                };
                break;
            case 2:
                this.supply_state_speed = true;
                this.node.getChildByName('playerNode').color = new cc.Color(255, 255, 255);
                this.node.getComponent(cc.MotionStreak).color = new cc.Color(255, 255, 255);
                this.node.getComponent(cc.MotionStreak).enabled = true;
               
                this.speed = this.playerConfig.supply_state.supply_speed;
                // 使动画播放速度加速
                this.animDeRun.speed = 2;
                if(this.runMusicID){
                    cc.audioEngine.stop(this.runMusicID);
                    if(this.state == playerConfig.runState){
                        this.runMusicID = cc.audioEngine.playEffect(this.runUpMusic, true);
                    }
                    
                }
                    
                this.unschedule(this.supply_sprite_callback);
                this.supply_sprite_callback = function() {
                   this.node.getComponent(cc.MotionStreak).enabled = false;
                   this.animDeRun.speed = 1;
                   this.speed = this.playerConfig.speed_default;
                   this.supply_state_speed = false;

                   if(this.runMusicID){
                        cc.audioEngine.stop(this.runMusicID);
                        if(this.state == playerConfig.runState){
                            this.runMusicID = cc.audioEngine.playEffect(this.runMusic, true);
                        }
                    }
                }
                this.scheduleOnce(this.supply_sprite_callback , this.playerConfig.supply_state.supply_speed_Duration);
                break;
            case 3:
                this.node.getComponent(cc.MotionStreak).enabled = false;
                this.isColliderSprint = false;
                this.supply_state_speed = false;
                this.isPlayChange = true;
                this.supply_down_speed = true;
                if(this.runMusicID){
                    cc.audioEngine.stop(this.runMusicID)
                }
                this.animDeRun.speed = 0.5;
                cc.audioEngine.playEffect(this.poisonStateMusic, false);
                this.node.getChildByName('playerNode').color = new cc.Color(51, 247, 2);
                this.isPoisoning = true;  //中毒状态
                this.speed = this.playerConfig.supply_state.supply_speed_down;
                if(this.state == playerConfig.sprintState){
                    this.setState(playerConfig.runState)
                }
                this.node.getComponent(cc.MotionStreak).enabled = false;
                this.unschedule( this.supply_down_speed_callback );
                this.supply_down_speed_callback =  function() {
                    this.node.getChildByName('playerNode').color = new cc.Color(255, 255, 255);
                    this.supply_down_speed = false;
                    this.animDeRun.speed = 1;
                    this.isPoisoning = false;
                    if(this.state == playerConfig.runState){
                        this.runMusicID = cc.audioEngine.playEffect(this.runMusic, true);
                    }
                    this.speed = this.playerConfig.speed_default;
                 }
                 this.scheduleOnce(this.supply_down_speed_callback , this.playerConfig.supply_state.supply_speed_down_Duration);
                break;
        }
    },
    animAttackStop(){
        this.isPlayChange = true;
        this.setState(playerConfig.defaultState);
    },
    attacktPlay(){
       this.setState(playerConfig.attackState);
    },
    _updatePos( CurrentPos ){
        let maxW = Math.abs(this._mapSize.width/2) - Math.abs(this.node.x);
        let maxH = Math.abs(this._mapSize.height/2) - Math.abs(this.node.y);
        let maxPlayerLevel = Math.abs(this._mapSize.width/2) - Math.abs(this.node.position.x) + this.node.width/2;
        let maxPlayerVertical = Math.abs(this._mapSize.height/2) - Math.abs(this.node.position.y) + this.node.height/2;

        if(maxPlayerLevel <= playerConfig.max_distance_level){
            this.node.x = CurrentPos.x;
        }
        if(maxPlayerVertical <= playerConfig.max_distance_vertical){
            this.node.y = CurrentPos.y;
        }

        if( maxW > cc.find('Canvas').width/2){
            this.MainCamera.x = this.node.x;
        }
        if( maxH > cc.find('Canvas').height/2){
            this.MainCamera.y = this.node.y;
        }
    },
    //被攻击
    beAttack(attck){
        
        this.currentProgressBar -= attck;
        if( this.currentProgressBar <= 0 ){
            this.isPlayChange = true;
            this.setState(playerConfig.dieState);
        }
        else{
            cc.audioEngine.playEffect(this.beAttackMusic, false);
        }
    },
    //攻击
    attackEnemy(arg){
        if(this.isQiang){   //有枪
            this.qiang.playAttack = true;

            cc.audioEngine.playEffect(this.qiangrun2Music, false);

            this.qiang.isAttack = false;
            this.isQiang = false;
            this.qiang.getChildByName('qiang').getComponent(cc.Sprite).spriteFrame = this.qiang.getComponent('qiangParent').sprintFrames[1];
        }
        else{
            for(let i=0; i<this.boxs.length; i++){
                this.boxs[i].getComponent('prop').playBoxOpen();  
            }
            this.enemys = this.node.parent.getComponent('map').enemysArr;

            let enemyNones = null;
            if(this.attack == this.playerConfig.attack){
                enemyNones = this.skillAttack.getComponent('attackSkill').others;
            }
            else{
                enemyNones = this.skill.getComponent('attackSkill').others;
            }   
            for(let i=0; i< enemyNones.length; i++){
                enemyNones[i].getComponent('enemy').beAttack(this.attack);
            }
        }
       
    },
    //冲撞
    attackSprintEnemy(arg){
        //this.enemys = this.node.parent.getComponent('map').enemysArr;
        
        let attack = this.playerConfig[arg];
        for(let i=0; i<this.others.length; i++){
            if(this.others[i].isAttackSprint == undefined){
                this.others[i].isAttackSprint = true;
                this.others[i].getComponent('enemy').beAttack(attack);
            }
        }
    },
    //游戏结束
    gameOver(){
        cc.director.loadScene("game-over");
    },
    onCollisionEnter(other, self){
       if(other.node.name == 'box'){
            this.boxs.push(other.node)
       }
       else if(other.node.name == 'enemy'){
            this.others.push(other.node);
            this.isCollider = true;
       }
       else if(other.node.name == 'bull' || other.node.name == 'bull2' || other.node.name == 'bull3'){
            this.beAttack(other.node.attack);
            other.node.destroy();
       }
    },
    onCollisionExit(other, self){
        if(other.node.name == 'box'){
            for(let i=0; i< this.boxs.length; i++){
                if(this.boxs[i] == other.node){
                    this.boxs.splice(i, 1);
                    break;
                }
            }
        }
        else if(other.node.name == 'enemy'){
            for(let i=0; i< this.others.length; i++){
                if(this.others[i].index == other.node.index){
                    this.others.splice(i, 1);
                    break;
                }
            }
            if(!this.others.length){
                this.isCollider = false;
            }
        }
    },
    update (dt) {
        
        this.playHealthbar.getComponent(cc.ProgressBar).progress = this.currentProgressBar/this.totalProgressBar;
        if(this.state == playerConfig.dieState) return;

        this.playHealthbar.x = this.playerName.x = this.node.x;
        this.playHealthbar.y = this.node.y + 60
        this.playerName.y = this.node.y + 90;
        if(this.state == playerConfig.defaultState){
            if(this.anim.getAnimationState('Player_sprint').isPlaying){
                this._updatePos();
                return;
            }
            this.skill.position = this.node.position = this.node.position;
            return;
        }
        
        if(this.state == playerConfig.runState || this.state == playerConfig.sprintState){
            if(this.isColliderSprint && this.isCollider){
                //this.isColliderSprint = false;
                if(!this.supply_down_speed){
                    this.attackSprintEnemy('attack_sprint');
                }
                else{
                    this.moveTarge = this.sprint_direction;
                }
            }
            let CurrentPos = this.node.position;
            let targetPos =  this.moveTarge.sub(cc.v2(0, 0));//目标方向向量
            this.direction = targetPos.normalize(); //返回归一化后的向量

            let angle = targetPos.signAngle(cc.v2(0, 1));  //获取旋转的角度
            this.node.rotation = angle * 180/Math.PI;

            this.prevPos = this.node.position;
            this.skill.position = this.node.position = this.node.position.add(this.direction.mul(this.speed*dt));
            this._updatePos( CurrentPos );
            this.currentPos = this.node.position;
        }
        
    },
});
