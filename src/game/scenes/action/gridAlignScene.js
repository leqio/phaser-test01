/**
 * @description 一组元素网格对齐
 */
class gridAlignScene extends Phaser.Scene {
   constructor() {
      super('gridAlignScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    this.load.spritesheet('sotb', 'assets/animations/sotb-64x112x11.png', { frameWidth: 64, frameHeight: 112 });
   }
   create() {
    this.add.image(400,300,'bg');

    // this 指的是当前场景实例，anims 是 Phaser 提供的动画管理器
    this.anims.create({
        key: 'walk', //key 属性指定动画的名称
        //frames 属性用于指定动画中使用的帧，this.anims.generateFrameNumbers('sotb') 方法用于从精灵图集（spritesheet）sotb 中生成帧序列
        frames: this.anims.generateFrameNumbers('sotb'),
        frameRate: 16, // 指定动画播放的帧率，在这里是 16 帧每秒。这决定了动画播放的速度
        repeat: -1, //-1 表示无限循环播放该动画
    });

    const sprites = [];
    for (let i = 0; i < 24; i++) {
        // 在坐标（0,0）处添加一个精灵图集并播放walk动画,画布添加24个精灵
        sprites.push(this.add.sprite(0, 0, 'sotb').play('walk'));
    };

    // GridAlign(items, options)
    // 将24个精灵按网格分布
    Phaser.Actions.GridAlign(sprites, {
        width: 12,  //设置网格12列，-1代表全部水平分布
        height: 2, // 设置网格2行，-1代表全部垂直分布
        cellWidth: 64, //单元格宽度
        cellHeight: 120, //单元格高度，
        x: 16, //网格在 x 轴上的起始偏移量，这里设为 16 像素，表示所有精灵将从横坐标 16 开始放置
        y: 4 // 网格在 y 轴上的起始偏移量，这里设为 4 像素，表示所有精灵将从纵坐标 4 开始放置
    })

   }
   update() {

   }
};

export default gridAlignScene;