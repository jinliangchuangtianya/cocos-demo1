window.playerConfig = {
    nickName : '北朝鲜雇佣兵',
    avatarUrl: '',
    player_1 : {
        speed_default : 350,   //默认移动速度
        sprint_speed : 850,         //加速 
        sprint_timer : 0.6,
        health : 80,
        attack : 1,
        attack_sprint : 2,
        supply_state : {
            supply_default:1,          //默认
            supply_attack : 2,        //捡到攻击
            supply_down : 3,          //减速状态 
            supply_attack_Duration : 15, //攻击增长的持续时间
            supply_speed :  850,   //增加速度 
            supply_speed_Duration : 10,   //增加速度时间  
            supply_speed_down : 20,    //减速速度      
            supply_speed_down_Duration : 5,   //减速速度时间  
        }
    },
    defaultState : 1,  //默认状态
    runState : 2,      //行走状态
    attackState : 3,   //攻击状态
    sprintState : 4,   //冲刺状态
    dieState : 5,      //死亡状态
    max_distance_level : 260,  //横向移动最大距离
    max_distance_vertical : 225,  //纵向移动最大距离
}
