import Phaser from 'phaser';
import * as dat from 'dat.gui';

/**
 * @description  容器和摄像机缩放
 */
class ContainerAndCameraZoom extends Phaser.Scene {
   constructor() {
      super('ContainerAndCameraZoom')
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
    this.load.image('lemming', 'assets/sprites/lemming.png');

   }
   create() {
    this.cameras.main.zoom = 0.5; // 视角缩小0.5

    const container = this.add.container(400, 300);

    const sprite0 = this.add.image(0, 0, 'lemming');
    const sprite1 = this.add.image(-100, -100, 'lemming');
    const sprite2 = this.add.sprite(100, -100, 'lemming');
    const sprite3 = this.add.sprite(100, 100, 'lemming');
    const sprite4 = this.add.sprite(-100, 100, 'lemming');
    container.add([sprite0, sprite1, sprite2, sprite3, sprite4]);


    this.tweens.add({
        targets: container,
        angle: 360,
        duration: 6000,
        yoyo: true,
        repeat: -1,
    });

    /* this.input.keyboard.createCursorKeys()，
     是一种便捷的方式，用于创建光标键（方向键）输入的快捷映射。通过 cursors 对象，可以轻松检测用户是否按下了上下左右键，并实现响应逻辑。
    自定义按键：this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)  
    */
    const cursors = this.input.keyboard.createCursorKeys();



    const controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q), // Q键控制缩小
        zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),// E键控制放大
        acceleration: 0.06, // 加速度
        drag: 0.0005,       // 阻力
        maxSpeed: 1.0       // 最大速度
    };

    /* 在 Phaser 3 中，Phaser.Cameras.Controls.SmoothedKeyControl 是一种内置的摄像机控制工具，用于实现平滑的摄像机移动、缩放等功能。
    通过配置 controlConfig，可以指定键盘输入控制摄像机的行为，例如方向键移动摄像机，Q 和 E 键缩放视图。 */
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


    
// 添加gui控制面板
    const gui = new dat.GUI();

    const cam = this.cameras.main;
    const help = {
        line1: 'Cursors to move',
        line2: 'Q and E to zoom',
    };

    // 在调试面板中创建一个名为 Camera_1 的文件夹
    const f1 = gui.addFolder('Camera_1');
    // 在文件夹 f1 中添加一个滑块或输入框，用于显示和调试 cam 对象的 x 属性; .listen()使控件实时监听 cam.x 的变化，并动态更新界面上的值
    /* 在 dat.GUI 中，滑块和输入框的默认行为是同时存在。当属性设置了 min 和 max 以及 step，dat.GUI 自动会在界面上生成滑块和输入框 */
    f1.add(cam, 'x', -400 ,400).listen();
    f1.add(cam, 'y', -300, 0).listen();
    f1.add(cam, 'scrollX').listen();
    f1.add(cam, 'scrollY').listen();
    f1.add(cam, 'rotation').min(0).step(0.01).listen(); //rotation控制摄像机的旋转角度；设置控件的最小值为 0, 控件的步进值为 0.01
    f1.add(cam, 'zoom', 0.1, 2).step(0.1).listen(); //设置控件的最小值为 0.1，最大值为 2
    f1.add(help, 'line1'); 
    f1.add(help, 'line2'); 

    f1.open(); // 默认控制面板展开


   }
   update(time, delta) {
        // 更新摄像机控制器
        this.controls.update(delta);

   }
};

export default ContainerAndCameraZoom;