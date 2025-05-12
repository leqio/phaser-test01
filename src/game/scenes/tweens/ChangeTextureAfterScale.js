/**
 * @description 模拟卡牌正反面翻转：改变scaleX 且更换纹理
 */
class ChangeTextureAfterScale extends Phaser.Scene {
   constructor() {
      super('ChangeTextureAfterScale')
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
    this.load.image('back', 'assets/tweens/cardback.png');
    this.load.image('front', 'assets/tweens/cardfront.png');
   }
   create() {
    const card1 = this.add.image(180, 300, 'back');
    const card2 = this.add.image(400, 300, 'back');
    const card3 = this.add.image(620, 300, 'back');

    console.log('card1', card1);
    

    // 让卡片翻转
    this.tweens.add({
        targets: card1,
        // 修改目标对象上的属性值,只支持数字值scaleX, texture是字符串，建议放在回调函数中
        // props属性，可以同时修改多个属性且设置自己的 duration等属性
        props: {
            scaleX: {value: 0, duration: 350, yoyo: true},
            // texture:  { value: 'front', duration: 0, delay: 1000 }
        },
        ease: 'Linear',
        onYoyo: () => { // 缩到最小那一刻换图
            card1.setTexture('front');
        }
    });


   }
   update() {

   }
};

export default ChangeTextureAfterScale;