import Phaser from 'phaser';

class angleWithStepScene extends Phaser.Scene {
   constructor() {
      super('angleWithStepScene');
      this.gingerbreads = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');
    
    this.load.image('gingerbread', 'gingerbread.png');
   }
   create() {
    for (let i = 0; i < 30; i++) {
        this.gingerbreads.push(this.add.sprite(32 * i, 300 ,'gingerbread'));
    }
   }
   update() {
    // Angle(items, value, [step], [index], [direction])
    /**
     * @param {(array|Phaser.GameObjects.GameObject[])} items 游戏对象数组
     * @param {number} value 旋转速度（角度）
     * @param {number} [step=0] 步差（这里是角度步差）
     * @param {number} [index=0] 跳过多少个对象后开始action
     * @param {number} [direction=1] 1是从开始遍历action,-1是从末尾遍历action
     */
    Phaser.Actions.Angle(this.gingerbreads, 2, 0, 5, 1)
   }
};

export default angleWithStepScene;