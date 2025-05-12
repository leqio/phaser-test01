/**
 * @description: 加载播放音频精灵
 */
class AudioMarkers extends Phaser.Scene {
   constructor() {
      super('AudioMarkers')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;

     this.markers = [
        { name: 'alien death', start: 1, duration: 1.0, config: {} },
        { name: 'boss hit', start: 3, duration: 0.5, config: {} },
        { name: 'escape', start: 4, duration: 3.2, config: {} },
        { name: 'meow', start: 8, duration: 0.5, config: {} },
        { name: 'numkey', start: 9, duration: 0.1, config: {} },
        { name: 'ping', start: 10, duration: 1.0, config: {} },
        { name: 'death', start: 12, duration: 4.2, config: {} },
        { name: 'shot', start: 17, duration: 1.0, config: {} },
        { name: 'squit', start: 19, duration: 0.3, config: {} }
     ];
   }
   preload() {
    this.load.setBaseURL('api');
    this.load.image('title', 'assets/pics/catastrophi.png');
    this.load.spritesheet('button', 'assets/ui/flixel-button.png', {frameWidth: 80, frameHeight: 20});
    this.load.bitmapFont('nokia', 'assets/fonts/bitmap/nokia16black.png', 'assets/fonts/bitmap/nokia16black.xml');
    this.load.audio('sfx', [
        'assets/audio/SoundEffects/fx_mixdown.ogg',
        'assets/audio/SoundEffects/fx_mixdown.mp3'
    ]);

   }
   create() {
    this.add.image(400, 300, 'title');
    for(let i = 0; i < this.markers.length; i++) {
        this.makeButton(this.markers[i].name, i); // 创建按钮元素
    };

    // this.input.on('gameobjectover', (pointer, gameObject) = {})，
    // 这个事件用于监听鼠标指针（Pointer）悬停在某个游戏对象（Game Object）上的情况;
    /* 注意区别：
    - this.input.on('gameobjectover', ...) --全局事件监听器，适用于所有启用 setInteractive() 的游戏对象。需要通过回调判断哪个游戏对象触发了事件（比如 if (gameObject === button)）
    - button.on('pointerover', ...) --直接绑定到特定的按钮对象（或其他 Game Object）上。
    总结：对于多个按钮，推荐使用 this.input.on('gameobjectover', ...) 来集中管理。
        对于单独的按钮或游戏对象，使用 button.on('pointerover', ...) 更简洁直观。
    */

        this.input.on('gameobjectover', (pointer, button) => {
            this.setButtonFrame(button, 0);
            // console.log('111', button.scene);  // button所在的scene
            // console.log('222', this); // 本scene
        });
        this.input.on('gameobjectout', (pointer, button) => {
            this.setButtonFrame(button, 1);
        });
        this.input.on('gameobjectdown', (pointer, button) => {
            // 播放音效
            const index = button.getData('index');
            this.sound.play('sfx', this.markers[index]); 

            this.setButtonFrame(button, 2);
        });
        this.input.on('gameobjectup', (pointer, button) => {
            this.setButtonFrame(button, 0);
        });
    
   }
   update() {

   }

   // 创建按钮元素
   makeButton(name, index) {
        // 加载精灵图的第1帧
        const button = this.add.image(680, 115 + index * 40, 'button', 1).setInteractive();
        button.setData('index', index);
        button.setScale(2, 1.5);

        // console.log('button', button.width, button.height); // 80 20
        // console.log('button', button.displayWidth, button.displayHeight); // 160 30
        
        // 文字居中
        const text = this.add.bitmapText(0, 0, 'nokia', name, 16);
        text.x = button.x - text.displayWidth / 2;
        text.y = button.y - text.displayHeight / 2;

   }

    // 修改按钮图片
    setButtonFrame(button, frame) {
        // button.scene: 按钮所属的场景
        button.frame = button.scene.textures.getFrame('button', frame); //将按钮的帧改为名为'button'的纹理的第frame帧
    }
};

export default AudioMarkers;