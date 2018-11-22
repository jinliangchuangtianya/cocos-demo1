

cc.Class({
    extends: cc.Component,

    properties: {
       startBtn:{
           default:null,
           type:cc.Node
       },
       aircraftNode:{
           default:null,
           type:cc.Node
       }
    },
    start () {
        if(window.wx){
           this.getUserInfo();
        }
        else{
            this.startBtn.active = true;
        }
    },
    createGetUserInfoBtn(){
        let _self = this;
        let systemInfo =  wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '你准备好了么',
            style: {
                left: width * 0.5 - 100,
                top: height * 0.5 - 20,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#eeeeee',
                color: '#000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 3
            }
        });

        let userInfo = null;
        button.onTap((res) => {
            if (userInfo) return;
            switch(res.errMsg) {
                case 'getUserInfo:ok': 
                    userInfo = res.userInfo;
                    window.playerConfig.nickName = userInfo.nickName;
                    window.playerConfig.avatarUrl = userInfo.avatarUrl;
                    button.destroy();
                    _self.aircraftNode.getChildByName('aircraft').getComponent('aircraft').starteGame();
                    break;
            }
        });
    },
    getUserInfo(){
        let _self = this;
        wx.getSetting({
            success (res) {
              let setting = res.authSetting;
              if(setting['scope.userInfo']){
                wx.getUserInfo({
                    success: function(res) {
                        var userInfo = res.userInfo
                        var nickName = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                        window.playerConfig.nickName = nickName;
                        window.playerConfig.avatarUrl = avatarUrl;
                        _self.startBtn.active = true;
                    }
                })
              }
              else{
                _self.createGetUserInfoBtn();
              }
              
            }
          })
    }
});
