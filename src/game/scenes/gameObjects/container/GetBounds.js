/**
 * @description: 获取游戏对象的边界框
 */
class GetBounds extends Phaser.Scene {
   constructor() {
        super('GetBounds');
        this.graphics;
        this.bounds3;
        this.bounds2;
        this.bounds1;
        this.image3;
        this.image2;
        this.image1;
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
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
    this.load.image('disk', 'assets/sprites/copy-that-floppy.png');
    this.load.image('tetris', 'assets/sprites/tetrisblock1.png');
   }
   create() {
    this.image1 = this.add.image(700, 200, 'eye');
    this.image2 = this.add.image(180, 180, 'tetris');
    this.image3 = this.add.image(400, 500, 'disk');

    this.image1.setOrigin(1);
    this.image2.setOrigin(0);
    this.image3.setOrigin(0.5);

    this.image3.setScale(0.5);

    const container = this.add.container(100, 0,[ this.image1, this.image2, this.image3 ]);
    container.setAngle(20);

    this.graphics = this.add.graphics();
    this.bounds1 = this.image1.getBounds();
    // console.log('bounds1', this.image1.getBounds()); // image1的边界（矩形）
    this.bounds2 = this.image2.getBounds();
    this.bounds3 = this.image3.getBounds();

    // image3放大动画
    this.tweens.add({
        targets: this.image3,
        duration: 2000,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

   }
   update(time, delta) {
    this.image1.rotation += 0.013; //每帧都将旋转角度增加 0.013，从而实现一个平滑的旋转动画
    this.image2.rotation += 0.015;
    this.image3.rotation -= 0.010;

    this.bounds1 = this.image1.getBounds(); //getBounds():获取对象的边界框，返回一个 Phaser.Geom.Rectangle
    this.bounds2 = this.image2.getBounds();
    this.bounds3 = this.image3.getBounds();

    this.graphics.clear();
    this.graphics.lineStyle(1, 0xff0000); //设置绘制线条的样式:宽度1，颜色0xff0000
    this.graphics.strokeRectShape(this.bounds1);  //strokeRectShape():在场景中绘制一个矩形，使用 getBounds() 的结果作为参数，展示 image1 的边界框

    this.graphics.lineStyle(1, 0xffff00);
    this.graphics.strokeRectShape(this.bounds2);

    this.graphics.lineStyle(1, 0x00ff00);
    this.graphics.strokeRectShape(this.bounds3);
   }
};

export default GetBounds;