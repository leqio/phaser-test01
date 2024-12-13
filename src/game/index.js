import Phaser, { Actions, GameObjects, Loader } from 'phaser';
import '@/utils/sceneExtensions.js';

// --Actions
// import alignToScene from '@/game/scenes/action/alignToScene.js';
// import alignToBaseScene from '@/game/scenes/action/alignToBaseScene.js';
// import alignToOffset from '@/game/scenes/action/alignToOffset.js';
// import angleScene from '@/game/scenes/action/angleScene.js';
// import angleWithStepScene from '@/game/scenes/action/angleWithStepScene.js';
// import getFirstScene from '@/game/scenes/action/getFirstScene.js';
// import gridAlignScene from '@/game/scenes/action/gridAlignScene.js';
// import gridAlignOverlapScene from '@/game/scenes/action/gridAlignOverlapScene.js';

// --Loader
// import loadFileFromJson from '@/game/scenes/loader/loadFileFromJson.js';
// import loadFileFromJson2 from '@/game/scenes/loader/loadFileFromJson2.js';
// import sceneFilesPayload from '@/game/scenes/loader/sceneFilesPayload.js';
// import unitySpriteSheet from '@/game/scenes/loader/unitySpritesheet.js';
// import animationJson from '@/game/scenes/loader/animationJson.js';
// import htmlToTexture from '@/game/scenes/loader/htmlToTexture.js';

// --GameObjects
// import video from '@/game/scenes/gameObject/video.js';
import SceneController from '@/game/scenes/scenes/sceneController.js';


const config ={
    type: Phaser.AUTO,
    // width: 800,
    width: 1024,
    height: 600,
    backgroundColor: '#020202',
    scene: [
        // 动作
        // alignToScene,
        // alignToBaseScene,
        // alignToOffset,
        // angleScene,
        // angleWithStepScene,
        // getFirstScene,
        // gridAlignScene,
        // gridAlignOverlapScene,
        
        // 加载器
        // loadFileFromJson,
        // loadFileFromJson2,
        // sceneFilesPayload,
        // unitySpriteSheet,
        // animationJson,
        // htmlToTexture,

        // 对象
        // video,

        // 场景
        SceneController,

    ]
};

// 定义初始化游戏方法
const startGame = (parent) => {
    return new Phaser.Game({...config, parent});
};

export default startGame;