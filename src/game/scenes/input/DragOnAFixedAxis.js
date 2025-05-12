/**
 * @description: 控制元素要么横向拖拽要么竖向拖拽
 */
class DragOnAFixedAxis extends Phaser.Scene {
   constructor() {
      super('DragOnAFixedAxis')
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
    this.load.image('bg', 'assets/skies/sky2.png');
    this.load.atlas('blocks', 'assets/sprites/blocks.png', 'assets/sprites/blocks.json');
   }
   create() {
    this.add.image(400,300, 'bg');
    this.add.text(16, 16, 'The Sprite will lock to drag direction').setFontSize(24).setShadow(1, 1);
    const block = this.add.sprite(400, 300,'blocks','yellowmonster');
    const wooden = this.add.sprite(528, 300,'blocks','wooden');
    const redmonster = this.add.sprite(272, 300,'blocks','redmonster');
    block.setInteractive({
        draggable: true,
    });
    wooden.setInteractive({
        draggable: true,
    });
    redmonster.setInteractive({
        draggable: true,
    });

    // this.input.dragDistanceThreshold拖动距离阈值, 拖拽最小位移为8才被视为拖拽
    this.input.dragDistanceThreshold = 8;

    let dragDirection = null;

    this.input.on('dragstart', () => {
        dragDirection = null;
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        if(!dragDirection) {
            if(Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y)){
                dragDirection = 'horizontal';
            } else {
                dragDirection = 'vertical';
            }
        };

        if(dragDirection === 'horizontal') {
            gameObject.x = dragX;
        } else if(dragDirection === 'vertical') {
            gameObject.y = dragY;
        }
    });

    this.input.on('dragend', () => {
        dragDirection = null;
    });




   }
   update() {

   }
};

export default DragOnAFixedAxis;