cc.Class({
    extends: cc.Component,
    name: "RankingView",
    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
    },
    onLoad() {
        
    },
    start() {
        //this.submitScoreButtonFunc();
        // this._show = cc.sequence(cc.moveTo(0.5, 0, 68).easing(cc.easeIn(0.5)), cc.callFunc(function(){
           
        // }, this));
        // this.node.runAction(this._show);
        if (CC_WECHATGAME) {
            this.isRank = false;
            this._show = cc.sequence(cc.moveTo(0.5, 0, 68).easing(cc.easeIn(0.5)), cc.callFunc(function(){
                wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: "x1"
                });
            }, this));
            this._hide = cc.sequence(cc.moveTo(0.3, 0, 580).easing(cc.easeOut(0.5)), cc.callFunc(function(){
                wx.postMessage({
                    messageType: 0,
                });
            }, this));

            wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
        }
    },
    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            this.isRank = !this.isRank;
            // 发消息给子域
            if(this.isRank){
                this.node.runAction(this._show);
            }
            else{
                this.node.runAction(this._hide);
            }
           
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },
    submitScoreButtonFunc(){
        let score = 453;
        if (CC_WECHATGAME) {
            wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
           console.log("提交得分: x1 : " + score)
        }
    },
    // 刷新开放数据域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
    },
    update () {
        this._updateSubDomainCanvas();
    }
});
