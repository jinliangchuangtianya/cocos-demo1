

cc.Class({
    extends: cc.Component,

    properties: {
       
    },
    onLoad () {
        this.preloadScene("game-scene");
        console.log(this.node.getComponent(cc.ProgressBar))
    },
    preloadScene(sceneName, onLoaded) {
        var info = cc.director._getSceneUuid(sceneName);
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({ uuid: info.uuid, type: 'uuid' },
            
                (completedCount, totalCount, item) => {
                    cc.log("已完成Items:" + completedCount);
                    cc.log("全部Items:" + totalCount);
                    cc.log("当前Item:" + item.url);
                    let _loadingNextStep = (completedCount / totalCount * 100);
                    cc.log("加载进度:" + _loadingNextStep);

                    this.node.getComponent(cc.ProgressBar).progress = _loadingNextStep / 100;

                    if(_loadingNextStep == 100){
                        cc.director.loadScene("welcome");
                    }
                   
                }
                , function (error, asset) {
                    if (error) {
                    }
                    if (onLoaded) {
                        onLoaded(error, asset);
                    }
                });
            }
            else {
                onLoaded(new Error());
            }
        }
});
