const FilePackObject = {
    test1: {
        files: [
            {
                type: 'image',
                key: 'taikodrummaster',
                url: 'assets/pics/taikodrummaster.jpg'
            },
            {
                type: 'image',
                key: 'sukasuka-chtholly',
                url: 'assets/pics/sukasuka-chtholly.png'
            }
        ]
    },
    test2: {
        prefix: 'TEST2.',
        path: 'assets/pics',
        defaultType: 'image',
        files: [
            {
                key: 'donuts',
                extension: 'jpg'
            },
            {
                key: 'ayu'
            }
        ]
    },
    meta: {
        generated: '1401380327373',
        app: 'Phaser 3 Asset Packer',
        url: 'https://phaser.io',
        version: '1.0',
        copyright: 'Photon Storm Ltd. 2018'
    }
};

/**
 * @description 加载一组资源包，可以将所有资源打包在一个 JSON 文件（或 JavaScript 对象）中，并通过该文件来批量加载资源
 * this.load.pack()加载资源包
 */
class LoadFileFromJson extends Phaser.Scene {
   constructor() {
      super('loadFileFromJson')
   }
   preload() {
    this.load.setBaseURL('/api');
    // this.load.pack 方法可以用于加载一组资源包，可以将所有资源打包在一个 JSON 文件（或 JavaScript 对象）中，并通过该文件来批量加载资源
    this.load.pack('pack1', FilePackObject);
   }
   create() {
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
   }
   update() {

   }
};

export default LoadFileFromJson;