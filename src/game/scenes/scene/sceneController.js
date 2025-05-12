/**
 * @description: 场景控制器，管理多个场景的创建、切换和交互
 */
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
      
      // 小行星动画
      this.anims.create({
         key: 'asteroid', 
         // this.anims.generateFrameNumbers() 用于根据帧编号生成帧序列，帧序列的范围，从第 0 帧开始，到第 24 帧结束，共 25 帧
         frames: this.anims.generateFrameNumbers('asteroid', {start: 0, end: 24}), 
         frameRate: 12, //动画的帧率，每秒播放 12 帧
         repeat: -1
      });
      // 矿石动画
      this.anims.create({
         key: 'mine', 
         frames: this.anims.generateFrameNumbers('mine', {start: 0, end: 15}), 
         frameRate: 20, 
         repeat: -1
      });

      // 背景平铺
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
      this.toggle2 = this.createActiveToggle(902, 75);

      // LCD文字
      this.text1 = this.add.bitmapText(520, 42, 'digital', 'nebula', 32).setOrigin(0.5, 0).setAlpha(0.8);
      this.text2 = this.add.bitmapText(520, 74, 'digital', 'index 1 / 6', 22).setOrigin(0.5, 0).setAlpha(0.8);

      // D-Pad
      this.createDpad();

      this.scene.launch('SceneA');
      this.scene.launch('SceneB');
      this.scene.launch('SceneC');
      this.scene.launch('SceneD');
      this.scene.launch('SceneE');
      this.scene.launch('SceneF');

      this.currentScene = this.scene.get('SceneA');

   }
   update( time, delta) {
      // time: 游戏启动以来的总时间（以毫秒为单位）。
      // delta: 自上一帧以来的时间（以毫秒为单位）。它是帧间隔，用来实现帧速率无关的逻辑。
      // 这两行代码更新背景纹理的平铺位置（tilePositionX 和 tilePositionY）,this.bg 是一个带有平铺纹理的 TileSprite 对象
      // tilePositionX 和 tilePositionY 控制背景平铺纹理在 X 和 Y 方向上的偏移，增加它们的值会导致纹理看起来在不断滚动，实现平滑的背景移动效果
      // 为什么乘以 delta：使用 delta 是为了让背景滚动速度与帧速率无关（frame-rate independent）。无论帧速率快慢，滚动的速度都保持一致

      this.bg.tilePositionX += 0.02 * delta;
      this.bg.tilePositionY += 0.005 * delta;

      if(!this.showTip) {
         this.updateToolTip();
      }

   }

   // 创建左边按钮及事件
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


   // 创建场景隐藏开关
   createVisibleToggle(x, y) {
      let toggle = this.add.image(x, y, 'ui', 'toggle-on').setOrigin(0);
      toggle.setInteractive();

      toggle.setData('on', true);
      toggle.on('pointerup', () => {
         if(toggle.getData('on')) {
            toggle.setFrame('toggle-off');
            toggle.setData('on', false);
            this.scene.setVisible(false, this.currentScene);  // 设置this.currentScene场景不可见
         } else {
            toggle.setFrame('toggle-on');
            toggle.setData('on', true);
            
            this.scene.setVisible(true, this.currentScene);  // 设置this.currentScene场景可见
         }
      });

      return toggle;
   };
   // 创建场景逻辑活动开关
   createActiveToggle(x, y) {
      let toggle = this.add.image(x, y , 'ui', 'toggle-on').setOrigin(0);
      toggle.setInteractive();
      toggle.setData('on', true);

      toggle.on('pointerup', () => {
         if(toggle.getData('on')) {
            toggle.setFrame('toggle-off');
            toggle.setData('on', false);

            this.scene.setActive(false, this.currentScene); // 暂停this.currentScene的逻辑性
         } else {
            toggle.setFrame('toggle-on');
            toggle.setData('on', true);
            
            this.scene.setActive(true, this.currentScene); // 恢复this.currentScene的逻辑性
         }
      });

      return toggle;
   }

   // 切换圆盘按键图片
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
            // this.scene.moveAbove()将this.currentScene的场景移动到名为SceneController场景的上方
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
         } else if (this.padRight.contains(px, py)) {
            // this.scene.moveUp()将当前场景 this.currentScene 上移一层
            this.scene.moveUp(this.currentScene);
            this.showTip = false;
         }
      });

   };

   // 切换活动场景
   setActiveScene(btn) {
      this.active.setData('active', false);  // this.active是启动按钮
      this.active.setFrame('button-out');

      btn.setData('active', true);
      btn.setFrame('button-down');

      this.active = btn;  //记录新的启动按钮
      this.currentScene = this.scene.get(btn.getData('scene')); // 获取某场景，this.scene.get()

      if(this.scene.isVisible(this.currentScene)) {
         this.toggle1.setFrame('toggle-on');
         this.toggle1.setData('on', true); 
      } else {
         this.toggle1.setFrame('toggle-off');
         this.toggle1.setData('on', false);
      };

      if(this.scene.isActive(this.currentScene)) {
         this.toggle2.setFrame('toggle-on');
         this.toggle2.setData('on', true);
      } else {
         this.toggle2.setFrame('toggle-off');
         this.toggle2.setData('on', false);
      };

      this.text1.setText(btn.getData('name'));
   }

   // 更新电子小屏文字
   updateToolTip(tip) {
      if(!tip) {
         let idx = this.scene.getIndex(this.currentScene);
         tip = 'index' + idx + ' / 6';
      };
      this.text2.setText(tip);
   };


};





// 星云旋转
class SceneA extends Phaser.Scene {
   constructor() {
      super('SceneA');
      this.nebula;
   }
   init() {
      
   }
   preload() {

   }
   create() {
      // this.cameras.main.setViewport(x, y, width, height)是Phaser 中用来调整相机视口的方法，设置主相机（main）的可视区域（可以用它来控制场景的可见部分）
      // x: 视口的左上角相对于游戏画布的水平坐标。
      // y: 视口的左上角相对于游戏画布的垂直坐标。
      // width: 视口的宽度（显示区域的宽度）。
      // height: 视口的高度（显示区域的高度）。

      /* cameras使用场景：
         UI布局：当需要在游戏画布的不同部分显示不同内容时，可以用 setViewport 为每个相机定义特定的显示区域。例如：
         顶部区域显示游戏场景。下方区域显示 HUD（用户界面）。

         分屏效果：如果游戏需要在单个画布中为不同玩家显示独立的视角，可以使用多个相机并分别设置它们的视口。
         
         限制显示区域：用于只渲染某些特定部分，比如菜单、状态栏或游戏地图的一部分。 
      // 举例：
      // 设置主相机的视口
      this.cameras.main.setViewport(0, 136, 1024, 465);

      // 创建一个额外的相机，显示在画布右侧
      const hudCamera = this.cameras.add(1024, 0, 200, 600);
      hudCamera.setBackgroundColor('#000000'); // 设置背景色为黑色
      */

      this.cameras.main.setViewport(0, 136, 1024, 465); //相当于裁剪出一个区域，从 (0, 136) 到 (1024, 601)，并只显示该区域内的内容
      this.nebula = this.add.image(300, 250, 'space', 'nebula');
   }
   update(time, delta) {
      // rotation 属性控制对象的旋转角度（单位是弧度，0 表示不旋转，Math.PI 表示半圈，2 * Math.PI 表示一圈）
      // +=: 增量赋值，表示在现有旋转角度的基础上增加值。
      // 0.00006: 旋转速度的基准值，值越大，旋转越快。这里值非常小，因此旋转会很慢。
      // delta: 表示从上一帧到当前帧之间的时间差（以毫秒为单位）。乘以 delta 是为了实现 帧率无关的动画，这种做法确保了无论帧率如何，旋转速度保持一致

      // 应用场景：
      //    视觉效果：让背景中的星云、行星、齿轮等物体缓慢旋转，增强动态效果。
      //    装饰动画：添加旋转效果使画面更生动，例如菜单界面的装饰性动画。
      // 注意：
      // rotation 单位是弧度：在 Phaser 中，rotation 的值是以弧度为单位的。如果需要使用角度，可以通过以下公式进行转换：
      // const degrees = radians * (180 / Math.PI); // 弧度转角度
      // const radians = degrees * (Math.PI / 180); // 角度转弧度

      this.nebula.rotation += 0.00006 * delta; //让 this.nebula 对象缓慢地以固定速度顺时针旋转
   }
};



// 太阳移动
class SceneB extends Phaser.Scene {
   constructor() {
      super('SceneB')
   }
   init() {
   
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);
      this.sun = this.add.image(300, 250, 'space','sun');
   }
   update(time, delta) {
      this.sun.x -= 0.02 * delta;
      this.sun.y += 0.015 * delta;

      if(this.sun.y >= 630) {
         this.sun.setPosition(1150, -190);
      }
   }
};

// 小行星播放动画并平移
class SceneC extends Phaser.Scene {
   constructor() {
      super('SceneC');
      this.asteroids = [];

      this.positions = [
         { x: 37, y: 176 },
         { x: 187, y: 66 },
         { x: 177, y: 406 },
         { x: 317, y: 256 },
         { x: 417, y: -10 },
         { x: 487, y: 336 },
         { x: 510, y: 116 },
         { x: 727, y: 186 },
         { x: 697, y: 10 },
         { x: 597, y: 216 },
         { x: 695, y: 366 },
         { x: 900, y: 76 },
         { x: 1008, y: 315 }
      ];
   }
   init() {
   
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);

      for(let i = 0; i < this.positions.length; i++) {
         let pos = this.positions[i];
         let therock = this.add.sprite(pos.x, pos.y, 'asteroid').play('asteroid');

         therock.setData('vx', 0.04);
         therock.setOrigin(0);
         therock.setScale(Phaser.Math.FloatBetween(0.3, 0.6));  //随机大小

         this.asteroids.push(therock);
      }
   }
   update(time, delta) {
      for(let i = 0; i < this.asteroids.length; i++) {
         let therock = this.asteroids[i];

         // 移动
         therock.x -= therock.getData('vx') * delta;

         if(therock.x <= -100) {
            therock.x = 1224;
         }
      }
   }
};

// 地球平移
class SceneD extends Phaser.Scene {
   constructor() {
      super('SceneD');
      this.planet;
   }
   init() {
      
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);
      this.planet = this.add.image(200, 380, 'space', 'planet');
   }
   update(time, delta) {
      this.planet.x += 0.01 * delta;

      if(this.planet.x >= 1224) {
         this.planet.x = -200;
      }
   }
};

// 飞船移动及添加飞船移动的粒子发射轨迹
class SceneE extends Phaser.Scene {
   constructor() {
      super('SceneE');
      this.ship;
      this.particles;

      // 一组点（控制点）
      this.splineData = [
         50, 300,
         146, 187,
         35, 94,
         180, 40,
         446, 35,
         438, 100,
         337, 150,
         452, 185,
         560, 155,
         641, 90,
         723, 147,
         755, 262,
         651, 271,
         559, 318,
         620, 384,
         563, 469,
         433, 457,
         385, 395,
         448, 334,
         406, 265,
         316, 305,
         268, 403,
         140, 397,
         205, 309,
         204, 240,
         144, 297,
         50, 300
      ];

      this.curve;
   }
   init() {
   
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);

      // Phaser.Curves.Spline：Phaser 提供的一种曲线类型，它根据一组点（控制点）绘制一条平滑的曲线。
      // this.splineData：传递给 Spline 的点集合（数组）。这些点是曲线的控制点，用于定义曲线的形状

      // this.add.follower(): Phaser 提供的功能，用于生成一个能沿着路径（曲线）移动的对象

      // 这段代码创建了一条 样条曲线（spline curve），并让一个对象（ship）沿着该曲线移动
      this.curve = new Phaser.Curves.Spline(this.splineData);
      let ship = this.add.follower(this.curve, 50, 300, 'space', 'ship');
      // 启动路径跟随动画
      ship.startFollow({
         duration: 12000,
         yoyo: true,
         repeat: -1,
         ease: 'Sine.easeInOut'
      });

      // 应用场景：
         // 飞船运动效果: 在太空游戏中展示飞船在曲线轨道上移动的视觉效果。
         // 轨迹展示: 用于火箭、子弹、导弹等运动物体的轨迹可视化。
         // 动态 UI 装饰: 制作菜单中类似光线运动的装饰动画。

      // this.add.particles()添加一个粒子系统，创建跟随 ship 的视觉效果
      this.particles = this.add.particles(0, 0, 'space', {
         frame: 'blue', //粒子使用space图集中的 'blue' 帧
         speed: 100,    //粒子的初速度（单位：像素/秒）
         lifespan: 2000,  //粒子的生存时间（毫秒）,默认值为 1000 毫秒，这里设置粒子会在 2 秒后消失
         alpha: 0.6, //粒子的透明度
         angle: 180,  // 粒子的初始发射角度（向左发射）
         scale: {start: 0.7, end: 0}, //粒子的缩放，逐渐从 0.7 缩小到 0
         blendMode: 'ADD' //设置粒子的混合模式，产生发光效果
      });

      ship.setDepth(1);
      this.ship = ship;
      // 让粒子系统 this.particles 跟随 ship 的位置移动
      this.particles.startFollow(this.ship);



   }
   update() {

   }
};

// 地雷
class SceneF extends Phaser.Scene {
   constructor() {
      super('SceneF');
      this.mines = [];
   }
   init() {
      
   }
   preload() {

   }
   create() {
      this.cameras.main.setViewport(0, 136, 1024, 465);

      for(let i = 0; i < 8; i++) {
         let x = Phaser.Math.Between(400, 800);
         let y = Phaser.Math.Between(0, 460);

         let mine = this.add.sprite(x, y, 'mine').play('mine');
         mine.setData('vx', Phaser.Math.FloatBetween(0.08, 0.14));

         this.mines.push(mine);
      }
   }
   update(time, delta) {
      for(let i = 0; i < this.mines.length; i++) {
         let mine = this.mines[i];
         mine.x -= mine.getData('vx') * delta;

         if(mine.x <= -100) {
            mine.x = 1224;
            mine.y = Phaser.Math.Between(0, 460);
         }
      }
   }
};


export  {SceneController,SceneA, SceneB, SceneC, SceneD, SceneE, SceneF} ;