import Phaser from 'phaser';

class AudioSprite extends Phaser.Scene {
   constructor() {
      super('AudioSprite')
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
    this.load.setPath('assets/audio/kyobi/');

    // 预加载音频精灵，Audio Sprite 是音频文件和 JSON 配置的组合
    // 'kyobi'：自定义资源键名；
    // 'kyobi.json'：包含音频精灵数据的 JSON 文件；
    // ['kyobi.ogg', 'kyobi.mp3', 'kyobi.m4a']：实际的音频文件数组，提供多种格式以支持不同浏览器。
    this.load.audioSprite('kyobi', 'kyobi.json', [
        'kyobi.ogg',
        'kyobi.mp3',
        'kyobi.m4a',
    ]);

   }
   create() {
    // 1.this.sound.addAudioSprite()将声音添加进声音管理器，使用play()播放,播放结束后，声音将自动删除（销毁）
    // const music = this.sound.addAudioSprite('kyobi'); // kyobi添加到声音管理器
    // music.play();//默认播放音频精灵中的第一个音段
    // music.play('title');//播放音频精灵中的音段title
    // music.play('warning');//播放音频精灵中的音段warning
   
    // 2.this.sound.playAudioSprite()将声音添加进声音管理器并播放whoosh，播放结束后，该 sprite 将自动删除（销毁）。这样，您就可以动态地播放新声音，而无需保留对它的引用
    this.sound.playAudioSprite('kyobi', 'whoosh');
    

   }
   update() {

   }
};

export default AudioSprite;