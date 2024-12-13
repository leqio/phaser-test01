import Phaser from 'phaser';

class AlignToOffset extends Phaser.Scene {
   constructor() {
      super('alignToOffset'),
      this.gems = [];
      this.y = 0;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.setPath('assets/sprites');

    this.load.image('red', 'gem.png');
    this.load.image('blue', 'columns-blue.png');
   }
   create() {
    this.gems.push(this.add.sprite(200,300,'red'));

    for (let i = 0; i < 8; i++) {
       this.gems.push(this.add.sprite(0,0,'blue'));
    }
   }
   update() {
    // Math.sin(this.y) * 8范围是[-8,8]
    Phaser.Actions.AlignTo(this.gems, Phaser.Display.Align.RIGHT_CENTER, 0, Math.sin(this.y) * 8);
    this.y += 0.1; // 控制变化速度
   }
};

export default AlignToOffset;