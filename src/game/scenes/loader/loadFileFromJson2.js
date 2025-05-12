// this.load.pack()加载远程资源包
// 用法一：加载获取图集资源（资源包资源设置了前缀）
// 用法二：加载获取图集资源
// 用法三：指定加载资源包的部分资源 
// 用法四：加载资源包中嵌套的资源包

/**
 * * @description 远程资源包加载
 */
class LoadFileFromJson2 extends Phaser.Scene {
   constructor() {
      super('loadFileFromJson2')
   }
   preload() {
    this.load.setBaseURL('/api');
    // 加载远程资源包
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json');
    // this.load.pack('pack', 'assets/loader-tests/pack4.json');
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json','test1');  //指定只加载test1
    // this.load.pack('pack1', 'assets/loader-tests/pack1.json','test2');  //指定只加载test2
    this.load.pack('pack1', 'assets/loader-tests/pack2.json');  // pack2.json中嵌套了pack3.json资源
   }
   create() {
    /* this.add.image(400, 300, 'taikodrummaster');
    this.add.image(900, 300, 'TEST2.donuts');  //用了前缀"prefix": "TEST2."
    this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(180, 300, 'TEST2.ayu'); //用了前缀"prefix": "TEST2." */

   
    /* const atlasTextures = this.textures.get('megaset');  // this.textures.get()从预加载资源中获取资源
    const frames = atlasTextures.getFrameNames();  // 获取每一帧的名称
    console.log('frames:', frames);
    
    for(let i = 0 ; i < frames.length; i++) {
        const x = Phaser.Math.Between(0,1024);
        const y = Phaser.Math.Between(0,768);

        this.add.image(x, y, 'megaset', frames[i]);
    } */


    /* this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
    // this.add.image(180, 300, 'TEST2.ayu');  // 这是test2的，指定加载test1后test2不被加载 */


    /* // this.add.image(400, 300, 'taikodrummaster'); // 这是test1的，指定加载test2后test1不被加载
    // this.add.image(400, 500, 'sukasuka-chtholly');
    this.add.image(400, 300, 'TEST2.donuts');
    this.add.image(180, 300, 'TEST2.ayu');   */


    this.add.image(400, 300, 'taikodrummaster');  //这是pack3.json的资源
    this.add.image(400, 500, 'sukasuka-chtholly');//这是pack3.json的资源
    this.add.image(200, 300, 'makoto');
    this.add.image(400, 400, 'nayuki');

   }
   update() {

   }
};

export default LoadFileFromJson2;


/* 

远程资源包pack4.json：
{
    "test": {
        "files": [
            {
                "type": "multiatlas",  // 多图集类型
                "key": "megaset",
                "url": "assets/loader-tests/texture-packer-multi-atlas.json",  //资源的 URL 路径, 这个JSON文件包含了图集的所有信息（包含每一帧的信息）
                "path": "assets/loader-tests/"  //资源图集文件所在的目录路径 ，即图集的路径：assets/loader-tests/texture-packer-multi-atlas-0.png
            }
        ]
    },
    "meta": {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
    }
}


远程资源包pack2.json：
{
    "test3": {
        "files": [
            {
                "type": "image",
                "key": "makoto",
                "url": "assets/pics/makoto.png"
            },
            {
                "type": "image",
                "key": "nayuki",
                "url": "assets/pics/nayuki.png"
            },
            {
                "type": "pack",  //类型为包
                "key": "pack3",
                "url": "assets/loader-tests/pack3.json"
            }
        ]
    },
    "meta": {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
    }
}
*/