import Phaser from 'phaser';

class angleScene extends Phaser.Scene {
   constructor() {
      super('angleScene');
      this.gingerbreads = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');
    
    this.load.image('gingerbread', 'gingerbread.png');
   }
   create() {
    for (let i = 0; i < 30; i++) {
        const x = Phaser.Math.Between(0,800);
        const y = Phaser.Math.Between(0,600);

        this.gingerbreads.push(this.add.sprite(x ,y ,'gingerbread'));
    }
   }
   update() {
    // Phaser.Actions.Angle(myObjects, 1),游戏对象旋转, 1为旋转速度
    Phaser.Actions.Angle(this.gingerbreads, 1)
   }
};

export default angleScene;