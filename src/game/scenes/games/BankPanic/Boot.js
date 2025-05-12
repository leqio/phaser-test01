/**
 * @description: 游戏案例：Bank Panic
 */
class Boot extends Phaser.Scene {
   constructor() {
      super('Boot')
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
    this.load.image('loading', 'assets/games/bank-panic/loading.png');
   }
   create() {
    this.scene.start('Preloader');
   }
   update() {

   }
};

export default Boot;