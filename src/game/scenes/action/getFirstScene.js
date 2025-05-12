/**
 * @description: 从一个对象数组或组（Group）中找到第一个符合特定条件的对象。
 */
class getFirstScene extends Phaser.Scene {
   constructor() {
      super('getFirstScene');
      this.gems = [];
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('/assets/sprites/');
    //预加载精灵图表spritesheet， { frameWidth: 64, frameHeight: 64 }指定帧宽度和高度。这通常用于加载一个精灵图集（spritesheet），其中包含多个小图像,指定每一帧的宽高
    this.load.spritesheet('diamonds','diamonds32x5.png',{ frameWidth: 64, frameHeight: 64 });
   }
   create() {
    for (let i = 1; i < 64; i ++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        const frame = Phaser.Math.Between(0, 4);
        // 随机帧0-4，默认是0
        this.gems.push(this.add.sprite(x, y, 'diamonds', frame));
    };

    this.add.text(16, 16, 'Click to find the first Red gem with a Scale of 1');
   
    // 获取精灵图表第0帧
    const redFrame = this.textures.getFrame('diamonds', 0);

    this.input.on('pointerdown', () => {
        // 获取第一个scaleX=1，并且frame=0的精灵帧
        const red = Phaser.Actions.GetFirst(this.gems, { scaleX: 1, frame: redFrame});
        
        if (red) {
           // this.children 代表当前场景或游戏对象的子元素（children），即场景中添加的所有游戏对象（sprites, images, text, 等等）。children 是一个包含所有子对象的集合，通常用于管理和操作这些对象
            // 将 red 精灵移动到其父容器的最上层，以确保它在其他子元素之上显示。这样做可以避免其他精灵遮挡 red
            this.children.bringToTop(red);
            
            // this.tweens.chain(...)：使用 Phaser 的 tweens 系统创建一个动画链
            this.tweens.chain({
                targets: red, //指定动画的目标为 red 精灵
                tweens: [
                    {
                        // 缩放比例设置为 2，持续时间为 400 毫秒，使用 Bounce.easeOut 作为缓动效果
                        scale: 2,
                        duration: 400,
                        ease: 'Bounce.easeOut'
                    },
                    {
                        // 在第一个动画结束后延迟 500 毫秒执行。将 red 精灵的缩放比例设置为 0，持续时间为 1000 毫秒，使精灵逐渐消失
                        delay: 500,
                        scale: 0,
                        duration: 1000
                    }
                ]
            })
        };
    })
    
   }
   update() {

   }
};

export default getFirstScene;