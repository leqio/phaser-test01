/**
 * @description: 指定音频上下文audioContext
 */
class ReuseAudioContext extends Phaser.Scene {
   constructor() {
      super('ReuseAudioContext');
      this.audioContext;
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
    this.load.spritesheet('explosion', 'assets/atlas/trimsheet/explosion.png', {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet('bomb', 'assets/sprites/xenon2_bomb.png', { frameWidth: 8, frameHeight: 16 });
    this.load.audio('explosion', [ 'assets/audio/SoundEffects/explosion.mp3' ]);
    
   }
   create() {
    this.anims.create({
        key: 'rotate',
        frames: this.anims.generateFrameNumbers('bomb', {star: 0, end: 3, first: 3}),
        frameRate: 20,
        repeat: -1,
    });
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', {star: 0, end: 23, first: 23}),
        frameRate: 20,
    });

    const bomb = this.add.sprite(400, 300, 'bomb');
    bomb.setScale(6, -6); // -6是在y方向倒转方向并放大6倍
    bomb.anims.play('rotate');
    bomb.play('rotate'); //播放帧动画

    this.input.once('pointerdown', () => {
        bomb.setVisible(false);

        const boom = this.add.sprite(400, 300, 'explosion').setScale(6);
        boom.play('explode'); //播放爆炸帧动画

        const explosion = this.sound.add('explosion', {
            volume: 0.5,
        });
        
        // 监听explosion完成事件
        explosion.on('complete', (sound) => {
            setTimeout(() => {
                //this.sys.game.destroy() 销毁当前的游戏实例。它的作用是完全停止游戏的运行，并清理所有与游戏相关的资源和内存
                this.sys.game.destroy(true); // 销毁当前游戏实例
                

                /* 音频上下文：负责管理音频的播放、处理、效果和其他与声音相关的功能,
                在 Phaser 中，音频上下文通常是自动创建的，并通过 Phaser.Sound 系统进行访问。当你加载和播放音频时，Phaser 会根据需要管理音频上下文
                    游戏初始化时，将自定义的 audioContext 传递给 Phaser 的配置。
                    在场景中可以通过 this.sound.context 访问音频上下文，控制音频行为（如暂停、恢复音频） */
                try{
                    // 创建音频上下文
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                } catch (e) {
                    // 如果音频上下文创建失败，直接退出
                    console.error(e); 
                    return;
                };

                // 左键点击，创建新的游戏实例
                document.addEventListener('click',  function newGame() {
                    const game = new Phaser.Game({
                        type: Phaser.AUTO,
                        width: 800,
                        height: 600,
                        parent: '#container',  // 挂载到#container的html元素上
                        scene: ReuseAudioContext,
                        pixelArt: true,
                        audio: {
                            context: this.audioContext // 指定音频上下文
                            /* 在场景中通过 this.sound.context 可以访问音频上下文：
                            this.sound.context.resume(); // 恢复音频上下文
                            this.sound.context.suspend(); // 暂停音频上下文
                            console.log(this.sound.context.state); // 检查音频上下文的状态 */
                        }
                    });

                    

                    //  移除点击事件监听器，防止重复创建游戏实例
                    document.removeEventListener('click', newGame);
                });
            })
        });

        explosion.play(); // 播放爆炸音效
        
    });

   }
   update() {

   }
};



export default ReuseAudioContext;