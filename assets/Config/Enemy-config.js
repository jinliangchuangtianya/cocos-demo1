window.EnemyConfig = {
    boss1 : {
        speed_default : 150,   //默认移动速度
        sprint_speed : 600,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 40,
        attck : 5,
        lookRange : 350
    },
    boss2 : {
        speed_default : 160,   //默认移动速度
        sprint_speed : 620,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 150,
        attck : 10,
        lookRange : 400,
        speed_bull : 300  //子弹速度
    },
    gunman:{
        speed_default : 80,   //默认移动速度
        sprint_speed : 300,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 1,
        attck : 1,
        lookRange : 380,
        speed_bull : 500  //子弹速度
    },
    warrior:{
        speed_default : 90,   //默认移动速度
        sprint_speed : 350,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 4,
        attck : 2,
        lookRange : 430,
        speed_bull : 400  //子弹速度
    },
    whale:{
        speed_default : 100,   //默认移动速度
        sprint_speed : 500,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 1,
        attck : 2,
        lookRange : 200
    },
    worm:{
        speed_default : 50,   //默认移动速度
        sprint_speed : 520,         //加速 
        sprint_timer : 1,       //加速间隔
        health : 2,
        attck : 2,
        lookRange : 250
    },
    defaultState : 1,  //默认状态
    runState : 2,      //行走状态
    attackState : 3,   //攻击状态
    sprintState : 4,   //冲刺状态
    dieState : 5,      //死亡状态
    max_distance_level : 205,  //横向移动最大距离
    max_distance_vertical : 185,  //纵向移动最大距离
}
