import Phaser from 'phaser';

class MainMenu extends Phaser.Scene {
   constructor() {
      super('MainMenu')
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
      
   }
   create() {
      this.add.image(512, 384, 'title');

      /* 标题及动画 */
      let sign = this.add.image(512, -400, 'logo');
      this.tweens.add({
         targets: sign,
         y: 180,
         duration: 2000,
         ease: 'Bounce.easeOut',
      });

      /* 仙人掌及其动画 */
      let cactus1 = this.add.image(150, 680, 'bank-panic', 'cactus');
      let cactus2 = this.add.image(880, 680, 'bank-panic', 'cactus').setFlipX(true); //.setFlipX(true),水平翻转（镜像）游戏对象
      this.tweens.add({
         targets: cactus1,
         props: {
            scaleX: {value: 0.9, duration: 250},
            scaleY: {value: 1.1, duration: 250},
            angle: {value: -20, duration: 500, delay: 250},
            y: {value: 660, duration: 250},
         },
         ease: 'Sine.easeInOut',
         repeat: -1,
         yoyo: true,
      });
      this.tweens.add({
         targets: cactus2,
         props: {
            scaleX: {value: 0.9, duration: 250},
            scaleY: {value: 1.1, duration: 250},
            angle: {value: 20, duration: 500, delay: 250},
            y: {value: 660, duration: 250},
         },
         ease: 'Sine.easeInOut',
         repeat: -1,
         yoyo: true,
      });


      this.music = this.sound.play('music', {loop: true});
      this.input.once('pointerdown', () => {
         this.sound.stopAll(); // 停止所有声音
         this.sound.play('shot'); // 播放“枪声”作为场景过度声
         this.scene.start('MainGame');
      });


      // let shot1 = this.add.image(100,100, 'bank-panic', 'bandit1shot1');
      // let bulletHole = this.add.image(100,100,  'bulletHole');
      // this.door = this.add.sprite(100,100, 'bank-panic', 'door2'); // 创建门
      // this.door.play('doorOpen'); // 播放开门动画

      
   }
   update() {

   }

};

export default MainMenu;