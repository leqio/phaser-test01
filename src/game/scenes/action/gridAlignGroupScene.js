/**
 * 将一组游戏对象（或任何具有公共 x 和 y 属性的对象）按照给定的网格配置进行对齐
 */
class gridAlignGroupScene extends Phaser.Scene {
   constructor() {
      super('gridAlignGroupScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png',{frameWidth: 32, frameHeight: 24});

   }
   create() {
    this.add.image(400,300,'bg');
    const group = this.add.group({
        key: 'diamonds', //使用已加载的名为 'diamonds' 的精灵图集
        frame: [0,1,2,3,4], //要使用的帧
        frameQuantity: 40 // 创建40个精灵实例
    });

    // group.getChildren() 返回当前精灵组 group 中的所有精灵（200个精灵）
    // Phaser.Actions.GridAlign:将一组游戏对象（或任何具有公共 x 和 y 属性的对象）按照给定的网格配置进行对齐
    Phaser.Actions.GridAlign(group.getChildren(), {
        width: 20, // 网格的列数（不是像素值）。如果设置为 -1，则将所有对象水平排列
        height: 10,// 网格的行数（不是像素值）。如果设置为 -1，则将所有对象垂直排列
        cellWidth: 32, // 每个网格单元的宽度（像素值）
        cellHeight: 32,// 每个网格单元的高度（像素值）
        x: 80, // 网格左上角的 X 坐标
        y: 140, // 网格左上角的 Y 坐标
    })

   }
   update() {

   }
};

export default gridAlignGroupScene;