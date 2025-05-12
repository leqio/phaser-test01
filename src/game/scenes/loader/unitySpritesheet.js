// 加载Unity图集: [textureURL]：资源URl , [atlasURL]: 从中加载纹理图集 json 数据文件的绝对或相对 URL
// this.load.unityAtlas(key, textureURL, atlasURL);

/**
 * @description 加载Unity图集
 * this.load.unityAtlas(key, textureURL, atlasURL);
 */
class UnitySpriteSheet extends Phaser.Scene {
   constructor() {
      super('unitySpriteSheet')
   }
   preload() {
    this.load.setBaseURL('/api');
    // this.load.unityAtlas('asteroids', 'assets/atlas/asteroids.png', 'assets/atlas/asteroids.png.meta')

    this.load.unityAtlas('ant','assets/atlas/ant.png', 'assets/atlas/ant.meta');
    this.load.unityAtlas('ant2','assets/atlas/ant2.png', 'assets/atlas/ant2.meta');
   }
   create() {
    // 基本用法
    /* this.add.image(200, 200, 'asteroids', 'asteroids_1');
    this.add.image(400, 200, 'asteroids', 'asteroids_2');
    this.add.image(600, 200, 'asteroids', 'asteroids_3');
    this.add.image(200, 400, 'asteroids', 'asteroids_4');
    this.add.image(400, 400, 'asteroids', 'asteroids_5');
    this.add.image(600, 400, 'asteroids', 'asteroids_6');
    this.add.image(200, 550, 'asteroids', 'asteroids_7'); */

    // 创建动画
    this.anims.create({
        key: 'nod',
        // this.anims.generateFrameNames()生成动画帧
        frames: this.anims.generateFrameNames('ant', {prefix: 'ant1Sprite_', end: 12}),
        repeat: -1,
        repeatDelay: 2,
        frameRate: 15
    });

    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('ant2',{prefix: 'ant2Sprite_', end: 3}),
        repeat: -1,
        frameRate: 14
    });

    // 添加精灵并播放动画
    const walker = this.add.sprite(1000, 250, 'ant2','ant2Sprite_0').play('walk');
    this.add.sprite(200,400,'ant','ant1Sprite_0').play('nod');

    // 创建链式动画
    this.tweens.add({
        targets: walker,
        x: -200,
        duration: 6000,
        ease: 'Linear',
        repeat: -1,
     });

   }
   update() {

   }
};

export default UnitySpriteSheet;