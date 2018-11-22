

cc.Class({
    extends: cc.Component,
    
     //攻击
    attack(attck){
        let enemyName = this.node.parent.getComponent('enemy').createName;
        if(enemyName == 'gunman' || enemyName == 'warrior' || enemyName == 'boss2'){
            if(enemyName == 'gunman'){
                cc.audioEngine.playEffect(this[enemyName + 'BullMusic'], false);
            }
            else if(enemyName == 'warrior'){
                cc.audioEngine.playEffect(this[enemyName + 'BullMusic'], false);
            }
            else if(enemyName == 'boss2'){
                cc.audioEngine.playEffect(this[enemyName + 'AttackMusic'], false);
            }
            this.node.parent.getComponent('enemy').createBull(enemyName);
        }
        else{
            if(enemyName == 'worm'){
                cc.audioEngine.playEffect(this[enemyName + 'AttackMusic'], false);
            }
            else if(enemyName == 'whale'){
                cc.audioEngine.playEffect(this[enemyName + 'AttackMusic'], false);
            }
            else if(enemyName == 'boss1'){
                cc.audioEngine.playEffect(this[enemyName + 'AttackMusic'], false);
            }
            cc.find('Canvas/game-root/map/Player').getComponent('Player').beAttack(this.node.parent.getComponent('enemy').config.attck)
        }
    },
    properties: {
        sprintFrames:{
            default:[],
            type:cc.Node
        },
        gunmanBullMusic:{
            default:null,
            type:cc.AudioClip
        },
        warriorBullMusic:{
            default:null,
            type:cc.AudioClip
        },
        wormAttackMusic:{
            default:null,
            type:cc.AudioClip
        },
        whaleAttackMusic:{
            default:null,
            type:cc.AudioClip
        },
        boss1AttackMusic:{
            default:null,
            type:cc.AudioClip
        },
        boss2AttackMusic:{
            default:null,
            type:cc.AudioClip
        }
    },
});
