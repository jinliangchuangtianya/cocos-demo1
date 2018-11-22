let leve = window.leve;
cc.Class({
    extends: cc.Component,

    properties: {
        enemys_1:{
            default:[],
            type:cc.Prefab
        },
        enemys_1_Boss:{
            default:null,
            type:cc.Prefab
        },
        enemys_2:{
            default:[],
            type:cc.Prefab
        },
        enemys_2_Boss:{
            default:null,
            type:cc.Prefab
        },
        enemys_3:{
            default:[],
            type:cc.Prefab
        },
        props:{
            default:[],
            type:cc.Prefab
        },
        supply:{
            default:null,
            type:cc.Prefab
        },
        box:{
            default:null,
            type:cc.Prefab
        },
        qiang:{
            default:null,
            type:cc.Prefab
        },
        bgMusic:{
            default:null,
            type:cc.AudioClip
        },
        boss1CreateMusic:{
            default:null,
            type:cc.AudioClip
        },
        boss2CreateMusic:{
            default:null,
            type:cc.AudioClip
        },
        leveCurrent:1  //当前关卡
    },
    onLoad () {

        console.log(window.playerConfig.nickName, 456);
        console.log(window.playerConfig.avatarUrl, 123)
        //播放背景音乐
        cc.audioEngine.setMusicVolume(0.2)
        cc.audioEngine.playMusic(this.bgMusic, true);
        this.propArr = [];
        this.boxArr = [];

        this.isBossDie = false;  //boss是否存在
        this.isCreateQiang = false;  //是否可以创建枪

        this.currentEnemtCount = 0; //当前产生敌人的总数量
        this.createIng = true;  //是否可以添加敌人
        this.createProp = true;  //是否可以添加道具

        this.leve = leve['leve_'+ this.leveCurrent];

        this.PropIntervalsStart = 0;
        this.PropIntervalsTime = this.getPropIntervalsTime();   //替换道具的时间

        this.enemyCount = 0;   //敌人的下标
        this.enemysArr = [];
        this.createEnemy();

        this.timerInterval = this.getInterval();
        this.createProps('prop');
        this.createProps('box');

        this.CurrentQiang = null;
    },
    getPropIntervalsTime(){
        let random = Math.floor(Math.random()*(this.leve.PropInterval.max - this.leve.PropInterval.min + 1) + this.leve.PropInterval.min);
        return random;
    },
    //添加敌人
    createEnemy(pos){
        if(pos == 'boss'){
            this.isBossDie = true;
            cc.audioEngine.playEffect(this['boss'+this.leveCurrent+'CreateMusic'], false)
            let enemy = cc.instantiate(this['enemys_'+this.leveCurrent+'_Boss']);
            enemy.parent = this.node;
            enemy.index = this.enemyCount;
            this.enemysArr.push(enemy);
            this.enemyCount++;
        }
        else{
            this.enemys = this['enemys_' + this.leveCurrent];
            let random = Math.floor(Math.random()*this.enemys.length);
            let enemy = cc.instantiate(this.enemys[random]);
            if(pos){
                enemy.isOpenBox = pos;
            }
            enemy.parent = this.node;
            enemy.index = this.enemyCount;
            this.enemysArr.push(enemy);
            this.currentEnemtCount ++;
            this.enemyCount++;
        }
    },
    removeEnemysArr(index){
        for(let i=0; i<this.enemysArr.length; i++){
            if(this.enemysArr[i].index == index){
                this.enemysArr.splice(i, 1);
                return;
            }
        }
    },
    //添加道具
    createProps(propClass, pos){
        for(let i=0; i<this.leve.PropCount; i++){
            if(propClass == 'prop'){
                let random = Math.floor(Math.random()*this.props.length);
                let prop = cc.instantiate(this.props[random]);
                prop.parent = this.node;
                this.propArr.push(prop);
            }
            else if(propClass == 'box'){
                let prop = cc.instantiate(this.box);
                prop.parent = this.node;
                this.boxArr.push(prop);
            }
            
        }
       
    },
     //删除道具
    removeProps(){
        for(let i=0; i<this.propArr.length; i++){
            if(cc.isValid(this.boxArr[i])){
                let AnimationState = this.boxArr[i].getComponent('prop').boxbing;
                if( !(AnimationState && AnimationState.isPlaying) ){
                    this.boxArr[i].destroy();
                }
            }
            if(cc.isValid(this.propArr[i])){
                let AnimationState = this.propArr[i].getComponent('prop').animBombing;
                if( !(AnimationState && AnimationState.isPlaying)){
                    this.propArr[i].destroy();
                }
            }
        }
        this.propArr = [];
        this.boxArr = [];
    },
    getInterval(){
        let random = Math.floor(Math.random()*(this.leve.Interval.max - this.leve.Interval.min + 1) + this.leve.Interval.min);
        return random;
    },
    addEnemy(){
        if( this.createIng == false ) return;
        this.createIng = false;
        this.timerInterval = this.getInterval();
        this.scheduleOnce(function() {
           this.createEnemy();
           this.createIng = true;
        }, this.timerInterval);
    },
    //掉落补给
    createSupply(pos, index){
        let supply = cc.instantiate(this.supply);
        supply.parent = this.node;
        supply.position = pos;
        supply.index = index;
    },
    //创建枪
    createQiang(){
        this.CurrentQiang = cc.instantiate(this.qiang);
        this.CurrentQiang.parent = this.node;
    },
    update (dt) {
        if(this.leveCurrent >= 2 &&  this.CurrentQiang == null && this.isCreateQiang){
            this.createQiang();
        }
        if(this.enemyCount >= this.leve.enemyTotalCount){
            this.createEnemy('boss');
            this.enemyCount = 0;
            this.leveCurrent ++;
            this.leve = leve['leve_'+ this.leveCurrent];
            return;
        }
        this.PropIntervalsStart += dt;
        if(this.PropIntervalsStart >= this.PropIntervalsTime){
            this.removeProps();
            this.createProps('prop');
            this.createProps('box');
            this.PropIntervalsStart = 0;
            this.PropIntervalsTime = this.getPropIntervalsTime('PropInterval');   //替换道具的时间
        }

        //if(this.currentEnemtCount >= this.leve.enemyTotalCount) return;
        if(this.createIng){
            if(this.enemysArr.length < this.leve.MaxEnemyCount &&  !this.isBossDie){
                this.addEnemy();
            }
        }
    },
});
