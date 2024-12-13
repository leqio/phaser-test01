import Phaser from 'phaser';

class gridAlignOverlapScene extends Phaser.Scene {
   constructor() {
      super('gridAlignOverlapScene')
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('bg', 'assets/skies/deepblue.png');
    // this.load.atlas() 是用来加载一个图集的方法,
    // 图集包括一张图像和一个 JSON 配置文件(包含了图集中每个图像的位置信息和尺寸)
    this.load.atlas('cards', 'assets/atlas/cards.png','assets/atlas/cards.json');
   }
   create() {
    this.add.image(400, 300, 'bg');

    // this.textures.get('cards') 方法用于获取关键字为 'cards' 的图集对象。
    // getFrameNames() 是一个方法，返回图集中所有帧的名称的数组
    const frames = this.textures.get('cards').getFrameNames();
    // console.log('frames--', frames);
    

    const cards = [];




    // 添加16个随机精灵实例
    for (let i = 0; i < 16; i++) {
        cards.push(this.add.sprite(0,0, 'cards', Phaser.Math.RND.pick(frames)));
    };

    // 将精灵实例按网格分布
    Phaser.Actions.GridAlign(cards, {
        width: 8,
        height: 2,
        cellWidth: 80, //数值小一点就是元素部分叠着
        cellHeight: 220,
        x: 50,
        y: 80
    })

   }
   update() {

   }
};

export default gridAlignOverlapScene;