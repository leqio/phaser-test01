/**
 * @description: 音频加载播放
 */
class Html5Audio extends Phaser.Scene {
   constructor() {
      super('Html5Audio')
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

      this.text = this.add.text(this.centerX,this.centerY, 'loading audio ...', {
         font: '16px Courier',
         fill: '#00ff00'
      }).setOrigin(0.5);

      // 加载音频
      this.load.audio('dafunk', [
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).ogg',
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).mp3',
         'assets/audio/Dafunk - Hardcore Power (We Believe In Goa - Remix).m4a'
      ]);
   }
   create() {
      // 默认true,指示当游戏失去焦点时（例如，当用户切换到另一个选项卡/程序/应用程序时）是否应暂停声音的标志。
      this.sound.pauseOnBlur = false; // 不暂停
      

      // this.add(key, [config])，将音频dafunk添加进声音管理器
      const music= this.sound.add('dafunk', {
         loop: true,// 循环播放
         volume: 0.5 // 音量范围0-1
      });
      music.play(); // 播放dafunk

      this.text.setText('Click - Playing Dafunk - Hardcore Power (We Believe In Goa - Remix)')

      // this.input.once('pointerdown', () => {
      //       const music = this.sound.add('dafunk');
      //       music.play();
      // })


      
   }
   update() {

   }
};

export default Html5Audio;