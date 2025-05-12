/**
 * @description 元素排列：第一项不会移动，其他项依次跟在第一项后，
 */
class alignToScene extends Phaser.Scene {
    constructor() {
        super('alignToScene');
    }

    preload() {
        this.load.setBaseURL('/api');
        this.load.image('red', 'assets/sprites/gem.png');
        this.load.image('blue', 'assets/sprites/columns-blue.png');
    }

    create() {
        const gems = [];
        gems.push(this.add.sprite(200, 300, 'red'));

        for (let i = 0; i < 8; i++) {
            gems.push(this.add.sprite(0,0,'blue'));
        };
        // AlignTo(items, position, [offsetX], [offsetY])
        /* 第一项不会移动，其他项依次跟在第一项后，
        对齐位置由 position 参数控制，该参数应该是 Phaser.Display.Align 常量之一：Phaser.Display.Align.TOP_LEFT Phaser.Display.Align.TOP_CENTER
        offsetX和offsetY表示相对上一项的x，y偏移量 */
        Phaser.Actions.AlignTo(gems, Phaser.Display.Align.RIGHT_CENTER, 20, -20);

        // 切换下一个场景
        // this.scene.start("alignToBaseScene");


    }
}

export default alignToScene;