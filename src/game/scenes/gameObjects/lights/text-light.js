/**
 * @description: Phaser灯光系统 lights --文字光影
 */
class TextLight extends Phaser.Scene {
   constructor() {
      super('TextLight')
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
    this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    
    /* 纹理图（diffuse map）和法线贴图（normal map） 
    纹理图（diffuse map）：是一个普通的图片，包含了物体的颜色和细节信息。
    法线贴图（normal map）：是一个特殊的图片，包含了物体表面的法线信息，用于模拟光照效果。

    快速生成一张法线贴图: 在线免费工具 NormalMap-Online（https://cpetry.github.io/NormalMap-Online/）、Materialize（本地工具 - 免费）（下载地址 👉 https://boundingboxsoftware.com/materialize/）
    Phaser 识别法线贴图，命名建议：原图：gold.png，法线贴图：gold-n.png
    */

    // 这种写法是为了启用 光照效果（Lighting）。当你在场景中开启了光照，Phaser 会使用法线贴图计算每个像素的光照响应，从而让图像呈现出更真实的立体感。
    this.load.image('bg', [ 
        'assets/textures/gold.png', // 纹理图（diffuse map）
        'assets/textures/gold-n.png'  // 法线贴图（normal map）
    ]);
   }
   create() {
    // .setPipeline('Light2D') ,启用光照管道，这样 Phaser 就会使用法线贴图来计算光照效果。
    this.add.image(this.centerX, this.centerY, 'bg')
    .setPipeline('Light2D') // 启用光照管道
    .setAlpha(0.5);

    const text1 = this.add.text(20, 50, 'Shadow Stroke', { fontFamily: 'Arial Black', fontSize: 74, color: '#00a6ed' });
    text1.setStroke('#2d2d2d', 16); // 设置描边颜色和宽度
    text1.setShadow(4, 4, '#000000', 8, true, false); // 设置阴影偏移量和颜色
    text1.setPipeline('Light2D'); // 启用光照管道

    const text2 = this.add.text(20, 180, 'Shadow Fill', { fontFamily: 'Arial Black', fontSize: 74, color: '#00a6ed' });
    text2.setStroke('#2d2d2d', 16);
    text2.setShadow(4, 4, '#000000', 2, false, true);
    text2.setPipeline('Light2D');

    const text3 = this.add.text(20, 310, 'Shadow Both', { fontFamily: 'Arial Black', fontSize: 74, color: '#00a6ed' });
    text3.setStroke('#2d2d2d', 16);
    text3.setShadow(4, 4, '#000000', 2, true, true);
    text3.setPipeline('Light2D');

    const text4 = this.add.text(20, 440, 'Shadow None', { fontFamily: 'Arial Black', fontSize: 74, color: '#00a6ed' });
    text4.setStroke('#2d2d2d', 16);
    text4.setShadow(4, 4, '#000000', 2, false, false);
    text4.setPipeline('Light2D');

    this.add.sprite(680, 600, 'sonic').setOrigin(0.5, 1);



    // 启用灯光系统,使用光照管道的对象必须在启用灯光系统后才能使用光照效果。
    this.lights.enable(); 
    // 设置环境光颜色
    this.lights.setAmbientColor(0x808080); 

    // 添加一个点光源
    // this.lights.addLight([x], [y], [radius], [rgb], [intensity]) , x/y 是位置，radius 是光照半径(默认128)，rgb 是光源的整数 RGB 颜色(默认"0xffffff"  “0xffffff”)。intensity 是光的强度（默认1）
    const spotlight = this.lights.addLight(this.centerX, this.centerY, 280, '0xffffff', 3);

    // 鼠标移动事件--点光源随鼠标移动
    this.input.on('pointermove', (pointer, gameObject, target) => {
        spotlight.x = pointer.x;
        spotlight.y = pointer.y;
    });

    const colors = [0xffffff, 0xff0000, 0x00ff00, 0x00ffff, 0xff00ff, 0xffff00];

    let currentColor = 0;

    this.input.on('pointerdown', (pointer) => {
        currentColor ++;

        if(currentColor === colors.length) {
            currentColor = 0;
        };

        spotlight.setColor(colors[currentColor]);
    })



   }
   update() {

   }
};

export default TextLight;