import Phaser from 'phaser';
import '@/utils/sceneExtensions.js';

//#region  --Actions
import alignToScene from './scenes/action/alignToScene.js';
import alignToBaseScene from './scenes/action/alignToBaseScene.js';
import alignToOffset from './scenes/action/alignToOffset.js';
import angleScene from './scenes/action/angleScene.js';
import angleWithStepScene from './scenes/action/angleWithStepScene.js';
import getFirstScene from './scenes/action/getFirstScene.js';
import gridAlignScene from './scenes/action/gridAlignScene.js';
import gridAlignOverlapScene from './scenes/action/gridAlignOverlapScene.js';

//#endregion

//#region  --Loader
import loadFileFromJson from './scenes/loader/loadFileFromJson.js';
import loadFileFromJson2 from './scenes/loader/loadFileFromJson2.js';
import sceneFilesPayload from './scenes/loader/sceneFilesPayload.js';
import unitySpriteSheet from './scenes/loader/unitySpritesheet.js';
import animationJson from './scenes/loader/animationJson.js';
import htmlToTexture from './scenes/loader/htmlToTexture.js';
//#endregion

//#region  --GameObjects
import video from './scenes/gameObjects/video.js';
import Text_wordWrap from './scenes/gameObjects/Text_wordWrap.js';
import FireEffect from './scenes/gameObjects/particleEmitter/fireEffect.js';
import TextLight from './scenes/gameObjects/lights/text-light.js';
import Graveyard from './scenes/gameObjects/lights/Graveyard.js';
// container
import GetBounds from './scenes/gameObjects/container/GetBounds.js';
import ContainerAsMask from './scenes/gameObjects/container/ContainerAsMask.js';
import ContainerAndCameraZoom from './scenes/gameObjects/container/ContainerAndCameraZoom.js';

import MeshFromArray from './scenes/gameObjects/mesh/MeshFromArray.js';
//#endregion

//#region   --Scene
import {SceneController,SceneA, SceneB, SceneC, SceneD, SceneE, SceneF} from './scenes/scene/sceneController.js';
//#endregion

//#region  --audio
import AudioSprite from './scenes/audioScene/AudioSprite.js';
import Html5Audio from './scenes/audioScene/audio_html5.js';
import AudioMarkers from './scenes/audioScene/audio_markers.js';
import PlaySoundOnKeypress from './scenes/audioScene/playSoundOnKeypress.js';
import ReuseAudioContext from './scenes/audioScene/reuseAudioContext.js';
//#endregion

//#region --input
import DragOnAFixedAxis from './scenes/input/DragOnAFixedAxis.js';
import DragHorizontally from './scenes/input/DragHorizontally.js';
//#endregion

//#region --games
import {Boot, Preloader, MainMenu, MainGame} from './scenes/games/BankPanic/index.js';
//#endregion

//#region  --tilemap
import SpotLight from './scenes/tilemap/spot-light.js';
import SnakeDistance from './scenes/tilemap/SnakeDistance.js';
//#endregion


//#region  --math
import Dot from './scenes/math/vec/dot.js';
//#endregion

//#region  --tweens
import ChangeTextureAfterScale from './scenes/tweens/ChangeTextureAfterScale.js';
//#endregion


const config ={
    type: Phaser.AUTO,
    // width: 800,
    // height: 600,
    width: 1024,
    height: 768,
    backgroundColor: '#1f1f1f',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 } }
    },
    scene: [
        // --动作
        // alignToScene,
        // alignToBaseScene,
        // alignToOffset,
        // angleScene,
        // angleWithStepScene,
        // getFirstScene,
        // gridAlignScene,
        // gridAlignOverlapScene,
        
        // --加载器
        // loadFileFromJson,
        // loadFileFromJson2,
        // sceneFilesPayload,
        // unitySpriteSheet,
        // animationJson,
        // htmlToTexture,

        // --音频
        // AudioSprite,
        // Html5Audio,
        // AudioMarkers,
        // PlaySoundOnKeypress,
        // ReuseAudioContext,

        // --游戏对象
        // video,
        // GetBounds,
        // ContainerAsMask,
        // ContainerAndCameraZoom,
        // Text_wordWrap
        // FireEffect,
        // TextLight,
        // Graveyard,
        MeshFromArray,

        // --场景
        // SceneController, SceneA, SceneB, SceneC, SceneD, SceneE, SceneF,

        // --鼠标键盘互动
        // DragOnAFixedAxis,
        // DragHorizontally,

        // --完整游戏例子
        // Boot, Preloader, MainMenu, MainGame // 银行恐慌

        // --瓦片地图
        // SpotLight,
        // SnakeDistance,
        // Dot,

        // --补间动画
        // ChangeTextureAfterScale, // 卡牌正反面翻转
    ]
};

// 定义初始化游戏方法
const startGame = (parent) => {
    return new Phaser.Game({...config, parent});
};

export default startGame;