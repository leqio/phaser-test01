/**
 * @description 设置元素相对第一个元素对齐方式
 */
class AlignToBaseScene extends Phaser.Scene {
   constructor() {
      super('alignToBaseScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    /* this.load.setPath('assets/sprites');
    
    this.load.image('image1', 'advanced_wars_tank.png');
    this.load.image('image2', 'amiga-cursor.png');
    this.load.image('image3', 'apple.png');
    this.load.image('image4', 'asuna_by_vali233.png');
    this.load.image('image5', 'beball1.png');
    this.load.image('image6', 'flectrum.png'); */

    this.load.atlas('timeline', 'assets/atlas/timeline.png', 'assets/atlas/timeline.json');
        this.load.image('bg', 'assets/skies/spookysky.jpg');
   }
   create() {
    // 0, 500：矩形的 位置坐标，800, 100：矩形的 宽度和高度，0x9d2d9d：矩形的 颜色
    // setOrigin(0, 0) 将矩形的 锚点（origin） 设为左上角 (0, 0)。默认情况下，Phaser的add.rectangle会将矩形的中心设为锚点；
    /* this.add.rectangle(0, 500, 800, 100, 0x9d2d9d).setOrigin(0, 0);
    this.add.text(20, 20, "Loading game...");

    const sprite = [];
    for (let i = 1; i < 7; i++) {
        // 设置元素位置
        sprite.push(this.add.sprite(150, 493, `image${i}`));
    };
    // 设置元素相对第一个元素对齐方式
    Phaser.Actions.AlignTo(sprite, Phaser.Display.Align.RIGHT_BOTTOM) */


    this.add.image(400, 300, 'bg');

        this.thread = this.add.graphics();

        this.spider = this.add.sprite(400, -100, 'timeline', 'spider').setInteractive();

        const timeline = this.add.timeline([
            {
                at: 2000,
                tween: {
                    targets: this.spider,
                    y: 400,
                    ease: 'bounce.out',
                    duration: 1500
                }
            },
            {
                at: 4000,
                tween: {
                    targets: this.spider,
                    x: 200,
                    angle: 30,
                    ease: 'sine.out',
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 2000
                }
            },
            {
                at: 6000,
                tween: {
                    targets: this.spider,
                    x: 600,
                    angle: -30,
                    ease: 'sine.out',
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 2000
                }
            }
        ]);

        timeline.play();

        this.spider.on('pointerdown', (event) => {
          timeline.pause();
        });
   }
   update() {
      this.thread.clear();
        this.thread.lineStyle(1, 0xffffff, 0.7);
        this.thread.lineBetween(400, 0, this.spider.x, this.spider.y);
   }
};

export default AlignToBaseScene;