import Phaser from 'phaser';

class gridAlignGroupScene extends Phaser.Scene {
   constructor() {
      super('gridAlignGroupScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png',{frameWidth: 32, frameHeight: 24});

   }
   create() {
    this.add.image(400,300,'bg');
    const group = this.add.group({
        key: 'diamonds', //使用已加载的名为 'diamonds' 的精灵图集
        frame: [0,1,2,3,4], //要使用的帧
        frameQuantity: 40 // 每帧创建40个精灵实例
    });

    // group.getChildren() 返回当前精灵组 group 中的所有精灵（200个精灵）
    Phaser.Actions.GridAlign(group.getChildren(), {
        width: 20,
        height: 10,
        cellWidth: 32,
        cellHeight: 32,
        x: 80,
        y: 140,
    })

   }
   update() {

   }
};

export default gridAlignGroupScene;