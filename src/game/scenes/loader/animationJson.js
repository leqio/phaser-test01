/**
 * @description 加载animation动画json 
 * this.load.animation()
 */
class AnimationJson extends Phaser.Scene {
   constructor() {
      super('animationJson')
   }
   preload() {
    this.load.setBaseURL('api');
    // 加载动画（设置了哪几帧、动画相关参数）
    this.load.animation('gemData', 'assets/animations/gems.json')
    // 加载纹理图集（分成每一帧）
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json')
   }

   create() {
    // 加载精灵播放动画
    this.add.sprite(400, 100, 'gems').play('diamond');
    this.add.sprite(400, 200, 'gems').play('prism');
    this.add.sprite(400, 300, 'gems').play('ruby');
   }
   update() {

   }
};

export default AnimationJson;