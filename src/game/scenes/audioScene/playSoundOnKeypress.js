/**
 * @description: 按键控制音频播放
 */
class PlaySoundOnKeypress extends Phaser.Scene {
   constructor() {
      super('PlaySoundOnKeypress')
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
    this.load.image('touhou', 'assets/pics/touhou1.png');

    this.load.setPath('assets/audio/tech');
    this.load.audio('bass', [ 'bass.ogg', 'bass.mp3' ]);
    this.load.audio('drums', [ 'drums.ogg', 'drums.mp3' ]);
    this.load.audio('percussion', [ 'percussion.ogg', 'percussion.mp3' ]);
    this.load.audio('synth1', [ 'synth1.ogg', 'synth1.mp3' ]);
    this.load.audio('synth2', [ 'synth2.ogg', 'synth2.mp3' ]);
    this.load.audio('top1', [ 'top1.ogg', 'top1.mp3' ]);
    this.load.audio('top2', [ 'top2.ogg', 'top2.mp3' ]);
   }
   create() {
    this.add.image(790, 600, 'touhou').setOrigin(1);

    const bass = this.sound.add('bass');
    const drums = this.sound.add('drums');
    const percussion = this.sound.add('percussion');
    const synth1 = this.sound.add('synth1');
    const synth2 = this.sound.add('synth2');
    const top1 = this.sound.add('top1');
    const top2 = this.sound.add('top2');

    const keys = [
        'Press A for Bass',
        'Press B for Drums',
        'Press C for Percussion',
        'Press D for Synth1',
        'Press E for Synth2',
        'Press F for Top1',
        'Press G for Top2',
        '',
        'SPACE to stop all sounds'
    ];
    // 直接传入数组，简化了换行操作，省去了手动拼接 \n 的麻烦
    const text = this.add.text(10, 10, keys, { font: '32px Courier', fill: '#00ff00' });
    // keys[0] = 'Press A for Lead Guitar'; // 修改第一行内容
    // text.setText(keys); // 更新文本内容


    // 当 this.sound.locked === true 时，表示浏览器当前禁止自动播放音频，必须等待用户与页面交互（如点击事件）后，才能解锁音频播放权限
    if(this.sound.locked) {
        text.setText('Click to start');
        // 监听音频解锁事件
        this.sound.once('unlocked', () => {
            text.setText(keys);
        })
    };



    // 监听按键交互事件
    this.input.keyboard.on('keydown-SPACE', () => {
        this.sound.stopAll(); // 按下空格键，停止所有音效
    });
    this.input.keyboard.on('keydown-A', () => {
        bass.play(); // 按下A键，播放音效bass
    });
    this.input.keyboard.on('keydown-B', () => {
        drums.play();// 按下B键，播放音效drums
    });
    this.input.keyboard.on('keydown-C', () => {
        percussion.play();
    });
    this.input.keyboard.on('keydown-D', () => {
        synth1.play();
    });
    this.input.keyboard.on('keydown-E', () =>
    {
        synth2.play();
    });

    this.input.keyboard.on('keydown-F', () =>
    {
        top1.play();
    });

    this.input.keyboard.on('keydown-G', () =>
    {
        top2.play();
    });
    
   }

   update() {

   }
};

export default PlaySoundOnKeypress;