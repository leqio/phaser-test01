import Phaser from 'phaser';

class SceneController  extends Phaser.Scene {
   constructor() {
      super('SceneController ');
      this.currentScene;

      this.button1;
      this.button2;
      this.button3;
      this.button4;
      this.button5;
      this.button6;

      this.text1;
      this.text2;

      this.toggle1;
      this.toggle2;

      this.showTip = false;

      this.dpad;
      this.padUp = new Phaser.Geom.Rectangle(23, 0, 32, 26);
      this.padDown = new Phaser.Geom.Rectangle(23, 53, 32, 26);
      this.padLeft = new Phaser.Geom.Rectangle(0, 26, 32, 26);
      this.padRight = new Phaser.Geom.Rectangle(55, 26, 32, 26);

      this.bg;
   }
   init() {

   }
   preload() {
      this.load.setBaseURL('/api');
      this.load.image('bg', 'assets/tests/scenes/bg.jpg');
      this.load.atlas('space', 'assets/tests/scenes/space.png', 'assets/tests/scenes/space.json');
      this.load.atlas('ui', 'assets/tests/scenes/ui.png', 'assets/tests/scenes/ui.json');
      // this.load.bitmapFont()将字体(基于 XML 的位图字体或字体数组)添加到当前加载队列中
      this.load.bitmapFont('digital', 'assets/tests/scenes/digital.png', 'assets/tests/scenes/digital.xml')
      
   }
   create() {
      // this.textures.addSpriteSheetFromAtlas()方法是从已加载纹理的图集'space'中获取帧名'mine', 创建一个新的精灵图表命名'mine'，设置生成精灵表时，每帧的宽度为 64 像素
      this.textures.addSpriteSheetFromAtlas('mine', {atlas: 'space', frame: 'mine', frameWidth: 64});
      this.textures.addSpriteSheetFromAtlas('asteroid', {atlas: 'space', frame: 'asteroid', frameWidth: 96});
      
      this.anims.create({
         key: 'asteroid', 
         // this.anims.generateFrameNumbers() 用于根据帧编号生成帧序列，帧序列的范围，从第 0 帧开始，到第 15 帧结束，共 16 帧
         frames: this.anims.generateFrameNumbers('asteroid', {start: 0, end: 24}), 
         frameRate: 12, //动画的帧率，每秒播放 20 帧
         repeat: -1
      });
      this.anims.create({
         key: 'mine', 
         frames: this.anims.generateFrameNumbers('mine', {start: 0, end: 15}), 
         frameRate: 20, 
         repeat: -1
      });

      // this.add.tileSprite(x, y, width, height, key),添加一个平铺精灵（Tile Sprite）,默认原点为 (0.5, 0.5)。平铺精灵是一种特殊的精灵，它会重复渲染指定的纹理，可以用来实现背景滚动效果
      this.bg = this.add.tileSprite(0, 135, 1024, 465, 'bg').setOrigin(0);
      this.add.image(0,0, 'ui', 'panel').setOrigin(0);

      // buttons
      this.createButton(1, 'SceneA', 'nebula', 36, 26);
      this.createButton(2, 'SceneB', 'sun', 157, 26);
      this.createButton(3, 'SceneC', 'asteroids', 278, 26);
      this.createButton(4, 'SceneD', 'planet', 36, 76);
      this.createButton(5, 'SceneE', 'ship', 157, 76);
      this.createButton(5, 'SceneF', 'mines', 278, 76);

      // 先设置button1启动
      this.button1.setFrame('button-down');
      this.button1.setData('active', true);

      this.active = this.button1; // 记录启动按钮

      // 按钮标签图
      this.add.image(0,0, 'ui', 'scene-labels').setOrigin(0);

      // Toggles
      this.toggle1 = this.createVisibleToggle(902, 35);
      this.toggle1 = this.createVisibleToggle(902, 35);

      // LCD文字
      this.text1 = this.add.bitmapText(520, 42, 'digital', 'nebula', 32).setOrigin(0.5, 0).setAlpha(0.8);
      this.text2 = this.add.bitmapText(520, 74, 'digital', 'index 1 / 6', 22).setOrigin(0.5, 0).setAlpha(0.8);

      // D-Pad
      this.createDpad();

   }
   update() {

   }

   // 创建按钮及事件
   createButton(id, scene, name, x, y) {
      // this.add.image(x, y, textureKey, frameKey)适用于使用图集altas的情况
      let btn = this.add.image(x, y, 'ui', 'button-out').setOrigin(0);
      btn.setInteractive();
      // .setData()通过键值对存储与对象相关联的任意数据，可以使用.getData()获取数据
      btn.setData('id', id);  // 存id
      btn.setData('scene', scene); //存场景
      btn.setData('name', name); // 存名字
      btn.setData('active', false);  // 存启动状态

      btn.on('pointerover', () => {
         if (!btn.getData('active')) {
            // 重新设置btn的framekey
            btn.setFrame('button-over');
         }
      });
      btn.on('pointerout', () => {
         if (btn.getData('active')) {
            btn.setFrame('button-down');
         } else {
            btn.setFrame('button-out');
         }
      });
      btn.on('pointerup', () => {
         if (!btn.getData('active')) {
            this.setActiveScene(btn) // 这里箭头函数中this指向当前场景
         }
      });
      /* btn.on('pointerout', function () {
         if (this.getData('active')) {     // 这里普通函数中this指向调用它的对象btn
             this.setFrame('button-down');
         } else {
             this.setFrame('button-out');
         }
      });
      btn.on('pointerup', function () {
         if (!btn.getData('active')) {
             this.setActiveScene(btn);  //这里普通函数中this原本指向调用它的对象btn，但通过第三个参数传递了this(指向当前场景)给普通函数改变了普通函数this的指向，所以这里普通函数的this指向当前场景
         }
      }, this); */

      this['button' + id] = btn; // 添加动态属性名， 相当于this.button1 = btn;
   };


   // 创建场景切换键及点击事件
   createVisibleToggle(x, y) {
      let toggle = this.add.image(x, y, 'ui', 'toggle-on').setOrigin(0);
      toggle.setInteractive();

      toggle.setData('on', true);
      toggle.on('pointerup', () => {
         if(toggle.getData('on')) {
            toggle.setFrame('toggle-off');
            toggle.setData('on', false);
            this.scene.setVisible(false, this.currentScene);  // 设置this.currentScene场景不可见
         }
      });

      return toggle;
   };


   createDpad() {
      this.dpad = this.add.image(670, 26, 'ui', 'nav-out').setOrigin(0);
      this.dpad.setInteractive();
      
      //pointermove 事件返回本地坐标, px, py: 指针在 this.dpad 上的本地坐标（相对于 this.dpad 的左上角）,
      // this.padUp = new Phaser.Geom.Rectangle(23, 0, 32, 26); padUp 的矩形以 (23, 0) 为左上角，宽度为 32，高度为 26。
      // this.padUp.contains(px, py) 判断指针的本地坐标是否在 padUp 内
      // 由于使用的是 px 和 py 来判断是否在矩形内，矩形padUp的坐标必须与这些值在相同的坐标系下,所以padUp 的位置是 相对于 this.dpad 的本地坐标  
      this.dpad.on('pointermove', (pointer, px, py) => {
         this.showTip = true;

         if (this.padUp.contains(px, py)) {
            this.dpad.setFrame('nav-up');
            this.updateToolTip('bring to top');
         } else if (this.padDown.contains(px, py)) {
            this.dpad.setFrame('nav-down');
            this.updateToolTip('send to back');
         }else if (this.padLeft.contains(px, py)) {
            this.dpad.setFrame('nav-left');
            this.updateToolTip('move down');
         } else if (this.padRight.contains(px, py)) {
            this.dpad.setFrame('nav-right');
            this.updateToolTip('move up');
         } else {
            this.dpad.setFrame('nav-out');
            this.showTip = false;
         }
      });

      this.dpad.on('pointerout', () => {
         this.dpad.setFrame('nav-out');
         this.showTip = false;
      });

      // 场景堆叠移动
      this.dpad.on('pointerup', (pointer, px, py) => {
         if (this.padUp.contains(px, py)) {
            // this.scene.bringToTop(this.currentScene); 是 Phaser 的场景管理功能，用于将指定的场景移动到场景堆栈的顶部，使其成为最上层可见的场景。
            this.scene.bringToTop(this.currentScene);

            this.showTip = false;
         } else if (this.padDown.contains(px, py)) {
            // this.scene.moveAbove()将名为 'SceneController' 的场景移动到 this.currentScene 场景的上方
            this.scene.moveAbove('SceneController', this.currentScene);

            this.showTip = false;
         } else if (this.padLeft.contains(px, py)) {
            // this.scene.getIndex()获取当前场景 this.currentScene 在场景堆栈中的索引,最上层的场景索引为0
            let idx = this.scene.getIndex(this.currentScene);

            if (idx >  1) {
               // this.scene.moveDown()将当前场景 this.currentScene 下移一层
               this.scene.moveDown(this.currentScene);
            };

            this.showTip = false;
         } else if (this.padRight.containers(px, py)) {
            // this.scene.moveUp()将当前场景 this.currentScene 上移一层
            this.scene.moveUp(this.currentScene);
            this.showTip = false;
         }
      });

   };

   updateToolTip(tip ) {

   }


};

export default SceneController ;