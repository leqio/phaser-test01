/**
 * @description: 控制元素横向拖拽
 */
class DragHorizontally extends Phaser.Scene {
   constructor() {
      super('DragHorizontally')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/gradient8.png');
    this.load.atlas('blocks', 'assets/sprites/blocks.png', 'assets/sprites/blocks.json');

   }
   create() {
    this.add.image(400, 300, 'bg');
    // .setShadow(offsetX, offsetY, '#333', 1); // 添加带模糊的阴影效果,offsetX 和 offsetY 控制阴影的水平和垂直偏移量，阴影默认为 1px
    this.add.text(16, 16, 'Drag the Sprites horizontally').setFontSize(24).setShadow(1, 1);

    const block1 = this.add.sprite(400, 150, 'blocks', 'metal');
    const block2 = this.add.sprite(400, 300, 'blocks', 'platform');
    const block3 = this.add.sprite(400, 450, 'blocks', 'wooden');

    block1.setInteractive({ draggable: true });
    block2.setInteractive({ draggable: true });
    block3.setInteractive({ draggable: true });

    this.input.on('drag', (pointer, gameObject, dragX) => {
        // Phaser.Math.Clamp(value, min, max),限定value的最大值最小值
        dragX = Phaser.Math.Clamp(dragX, 100, 700); // 如果 dragX 小于 100，返回 100；如果 dragX 大于 700，返回 700；否则返回 dragX 自身

        gameObject.x = dragX;
        console.log('gameObject', gameObject);
        
    })
   }
   update() {

   }
};

export default DragHorizontally;