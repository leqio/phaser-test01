// 加载html纹理,直接加载 HTML 文件并将其作为纹理使用
// this.load.htmlTexture(key, url, width, height);
// this.load.htmlTexture(key, url, width, height, xhrSettings);

import Phaser from 'phaser';

class HtmlToTexture extends Phaser.Scene {
   constructor() {
      super('htmlToTexture');
      this.image;
   }
   preload() {
    this.load.setBaseURL('api');
    this.load.htmlTexture('test1', 'assets/html/test1.html',512, 512); 
    
   }
   create() {
    this.image = this.add.image(400, 300, 'test1').setOrigin(0);
   }
   update() {
    this.image.rotation += 0.01;
   }
};

export default HtmlToTexture;