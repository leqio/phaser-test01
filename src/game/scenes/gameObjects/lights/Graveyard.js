/**
 * @description Phaser 灯光系统 lights --墓地灯光烛火摇曳
 */
class Graveyard extends Phaser.Scene {
   constructor() {
      super('Graveyard')
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
    this.load.image('light', 'assets/normal-maps/light.png');

    this.load.setPath('assets/tests/grave/');
    this.load.atlas('candle');
    this.load.image('background');
    this.load.image('clouds');
    this.load.image('fog');
    this.load.image('overlay');
    this.load.image('tombs', [ 'tombs.png', 'tombs_n.png' ]); // 法线贴图
    this.load.image('tombsNormalMap', 'tombs_n.png');
   }
   create() {
    this.lights.enable(); // 启用灯光系统

    this.add.image(512, 384, 'background').setAlpha(0.7);

    /* 云 */
    const clouds = this.add.image(1024, 32, 'clouds').setOrigin(0);
    this.tweens.add({
        targets: clouds,
        x: -1250,
        ease: 'Linear',
        duration: 400000,
        repeat: -1
    });

    /* 雾 */
    const fog = this.add.image(1024, 200, 'fog').setOrigin(0);
    this.tweens.add({
        targets: fog,
        x: -3000,
        ease: 'Linear',
        duration: 300000,
        repeat: -1
    });


    /* 墓地 */
    const pic = this.add.image(512, 384, 'tombs');
    pic.setPipeline('Light2D'); // 设置启用2D光照管道，tombs有法线贴图的图片

    /* 假灯 */
    const dummy = this.add.image(900, 400, 'light').setVisible(false);
    
    const light1 = this.lights.addLight(280, 400, 200); // 点光源，200半径
    const ellipse1 = new Phaser.Geom.Ellipse(light1.x, light1.y, 70, 100); // 椭圆形

    const light2 = this.lights.addLight(650, 386, 200);
    const ellipse2 = new Phaser.Geom.Ellipse(light2.x, light2.y, 30, 40);

    const light3 = this.lights.addLight(900, 400, 200); // 放在假灯位置

    // 模拟烛火摇曳造成的光影
    // this.time.addEvent(config) 定时执行某个逻辑（一次或多次）
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            //Phaser.Geom.Ellipse.Random(ellipse, [out]) ,ellipse: 返回来自给定 Ellipse 内任意位置的均匀分布的随机点。out: 将随机点坐标赋值给out坐标
            // 把 ellipse1 内部的随机一个点坐标，赋值到 light1.x 和 light1.y 上
            Phaser.Geom.Ellipse.Random(ellipse1, light1); 
            Phaser.Geom.Ellipse.Random(ellipse2, light2);
        },
        repeat: -1,   
    });
    // 模拟灯笼的光忽大忽小
    this.tweens.add({
        targets: [ light3, dummy ],
        y: 150,
        ease: 'Sine.easeInOut',
        duration: 3000,
        yoyo: true,
        repeat: -1
    });

    // 烛火动画anims
    this.anims.create({
        key: 'flicker',
        frames: this.anims.generateFrameNames('candle', {
            start: 1,
            end: 14,
            prefix: 'candleFl'
        }),
        frameRate: 16,
        repeat: -1,
        // 控制每次动画循环之间的延迟时间，这个属性非常适合模拟那种不规律、自然的动画，比如：烛火忽明忽暗，星星一闪一闪，萤火虫发光发暗，自然风吹树叶飘动等效果
        repeatDelay: function () {
            return Math.random() * 6;
        }
    });
    this.add.sprite(652, 386, 'candle').setScale(0.25).play('flicker');
    this.add.sprite(260, 400, 'candle').setScale(0.5).play('flicker');

    /* 蜘蛛网 */
    this.add.image(512, 384, 'overlay');
   }
   update() {

   }
};

export default Graveyard;