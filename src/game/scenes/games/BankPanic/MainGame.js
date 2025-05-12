import Door from './Door.js';

class MainGame extends Phaser.Scene {
   constructor() {
      super('MainGame');

      this.hats;
      this.goals;
      this.gold;
      this.doors;

      this.isPaused = false; // 游戏暂停标识
      this.goalsComplete = 0; //获金币完成数量
      this.sign;

      this.level = 1; // 关卡数字
      this.levelImage;

      this.killDelay = 0.7; // 强盗射击玩家延迟时间
      this.closeDurationLow = 2000; // 关门随机时间下限
      this.closeDurationHigh = 4000; // 关门随机时间上限
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

   }
   create() {
      this.add.image(512, 384, 'background');
      this.add.image(450, 650, 'bank-panic', 'levelText');
      this.levelImage = this.add.image(600, 650, 'bank-panic', this.level);



      this.createGoals(); // 创建数字,12个数字排列
      this.createDoors(); // 创建门容器


      /* 创建金币池，12个金币 */
      // add.group() 用于创建一个对象池（object pool），用于管理游戏中的多个物体
      this.gold = this.add.group({
         defaultKey: 'bank-panic', //默认 纹理 key
         defaultFrame: 'gold', //默认 帧
         key: 'bank-panic', //  group 的 key，相当于给物体组命名。这个值会作为组的标识符，可以通过这个 key 来引用和操作该组
         frame: 'gold', //指示每个物体在组中应该使用 'gold' 这一帧
         active: false, //指定了组内物体的默认 活动状态，默认情况下设置为 false。这意味着组中的物体初始时不会被更新或渲染
         visible: false, //组内物体的默认 可见性，默认情况下设置为 false
         repeat: 11, //指定了物体的 重复数量, 第1个和重复的11个，一共12个
         maxSize: 12 //指定了组的 最大尺寸，即组最多可以容纳 12 个物体
      });

      /* 创建帽子池，33个帽子 */
      this.hats = this.add.group({
         defaultKey: 'bank-panic', 
         defaultFrame: 'hat', 
         key: 'bank-panic', 
         frame: 'hat', 
         active: false, 
         visible: false, 
         repeat: 32, 
         maxSize: 32 
      });

      this.isPaused = false; // 游戏暂停标识

      this.level = 1; // 关卡数字
      this.killDelay = 0.8; // 强盗射击玩家延迟时间
      this.closeDurationLow = 2000; // 关门随机时间下限
      this.closeDurationHigh = 4000; // 关门随机时间上限

      this.doors.forEach(door => {
         // this.game.getTime() 返回的是当前游戏运行的毫秒时间（自游戏启动以来）
         door.start(this.game.getTime());  // 调用容器door的自定义start() 方法，初始化随机开门时间：当前时间后的随机500-4000ms。
         console.log('door', door);
         
      })

   }
   
   /**
    * update() 方法在每一帧中被调用，用于更新游戏逻辑和处理输入事件
    * @param {Number} time -当前游戏时间（以毫秒为单位
    * @param {Number} delta -上一帧到当前帧的时间差（以毫秒为单位）
    */
   update(time, delta) {

      if(!this.isPaused) {
         this.doors.forEach(door => {
            door.update(time); // 判断执行开门或关门或强盗射击玩家
         });
      }
   }

   /**
    * 创建排列数字,12个数字排列
    */
   createGoals() {
      this.goals = [];
      this.goalsComplete = 0;

      // 创建纹理图并存入this.goals，将this.goals的纹理图顺序排列
      for (let i = 1; i <= 12; i++)
      {
         this.goals.push(this.add.image(0, 0, 'bank-panic', i));
      };
      // this.goals数组中的游戏对象排列成一个1行12列的网格，每个单元格的宽度为80像素，高度为36像素，网格的起始位置为(80, 86)。排列后的游戏对象会均匀分布在网格中
      Phaser.Actions.GridAlign(this.goals, {
         width: 12, //网格的宽度，表示网格中有多少列
         height: 1, //网格的高度，表示网格中有多少行
         cellWidth: 80, //每个网格单元的宽度
         cellHeight: 36, //每个网格单元的高度
         x: 80, //网格的起始X坐标
         y: 86, //网格的起始Y坐标
      });
   }

   /**
    * 创建门--容器Door
    */
   createDoors() {
      this.doors = [];

      let doorWidth = 200;
      let doorSpace = Math.floor((1024 - (doorWidth * 4)) / 5);

      let x = 100 + doorSpace;
      let y = 352;

      for (let i = 1; i <= 4; i++)
      {
         this.doors.push(new Door('Door' + i, this, x, y)); // 容器Door
         x += doorWidth + doorSpace;
      };
   }

   /**
    *  获取金币，播放金币线性动画，获金币12个，执行关卡完成函数
    * @param {Number} x -容器Door的X坐标
    * @param {Number} y -容器Door的Y坐标
    */
   addGold(x, y) {
      let target = this.goals[this.goalsComplete]; //获取第几个数字图片

      // this.gold.get(x, y),从金币组中获取一个物体并放置到(x, y)位置
      let gold = this.gold.get(x + 50, y + 100);
      gold.setActive(true).setVisible(true); //设置金币可见

      this.sound.play('money'); //播放金币声音

      // 金币动画
      this.tweens.add({
         targets: gold,
         x: target.x,
         y: target.y,
         ease: 'Quad.easeOut',
         duration: 600,
         onComplete: () => {
            target.setVisible(false);
         }
      });

      this.goalsComplete ++;  //获金币完成+1

      if(this.goalsComplete === 12) {
         this.levelComplete(); //执行关卡完成函数
      }
   }

   /**
    * （玩家射击帽子时）创建一个帽子，并播放帽子被击飞的动画
    * @param {Number} x -容器Door的X坐标
    * @param {Number} y -容器Door的Y坐标
    * @param {Number} stackPosition -记录角色帽子数量
    */
   addHat(x, y, stackPosition) {
      y = 180 + (30 * (5 - stackPosition)); //帽子Y坐标
      let hat = this.hats.get(x, y); //从帽子池中获取一个物体并放置到(x, y)位置

      hat.setActive(true).setVisible(true); //设置帽子可见
      hat.setScale(1).setAlpha(1); 
      
      const destX = Phaser.Math.RND.between(x - 400, x + 400); //随机X坐标
      const destY = y - 400; 
      
      this.tweens.add({
         targets: hat,
         x: destX,
         y: destY,
         angle: 960,
         duration: 1000,
         ease: 'Quad.easeOut',
         onComplete: () => {
            hat.setVisible(false); //设置帽子不可见
            hat.setActive(false); //设置帽子非活跃状态
         }
      })

   }


   /**
    * 关卡失败: 1.添加游戏失败图片 2.播放游戏失败声音 3.添加点击事件，点击后重新开始游戏
    */
   levelFail() {
      this.isPaused = true; //标识游戏暂停

      this.sign = this.add.image(512, -200, 'bank-panic', 'gameOver'); 

      this.sound.play('gameOver'); //播放游戏结束声音

      this.tweens.add({
         targets: this.sign,
         y: 384,
         ease: 'Bounce.easeOut',
         duration: 1500,
         onComplete: () => {
            console.log('game over');

            this.input.on('pointerdown', () => {
               // 使用phaser3.85.0此处有问题，使用3.88.2就可以
               this.scene.start('MainMenu'); //启动MainMenu场景
            });
            

         }
      });
   }

   /**
    * 关卡完成（获取12个金币）: 1.添加关卡完成图片 2.播放关卡完成声音 3.添加点击事件，点击后进入下一关
    */
   levelComplete() {
      this.isPaused = true;

      this.sign = this.add.image(512, -200, 'bank-panic', 'levelComplete');

      this.sound.play('levelComplete'); //播放关卡完成声音

      this.tweens.add({
         targets: this.sign,
         y: 384,
         ease: 'Bounce.easeOut',
         duration: 1500,
         onComplete: () => {
            this.input.once('pointerdown', () => {
               this.nextLevel(); //进入下一关
            });
         }
      });
   }

   /**
    * 进入下一关：1.重置获金币数字并可见，重置金币不可见且非活跃状态，重置Door容器，重置获金币数量 2.设置关卡升级后强盗开枪延迟加快 3.设置关卡升级后关门延迟加快 4.关卡数字更新，设置场景暂停为false
    */
   nextLevel() {
      // 重置获金币数字并可见
      this.goals.forEach((goal, index) => {
         goal.setFrame((index + 1).toString()); //重置goal帧，设置goal获金币数字
         goal.setVisible(true); //设置获金币可见
      })
      // 重置金币不可见且非活跃状态
      this.gold.getChildren().forEach((gold) => {
         gold.setVisible(false); //设置金币不可见
         gold.setActive(false); //设置金币非活跃状态
      });
      // 重置Door容器
      this.doors.forEach(door => {
         door.reset(this.game.getTime()); //重置Door容器
      });
      //重置获金币数量
      this.goalsComplete = 0;


      //  第五关之前，关卡每升级一次，强盗射击玩家延迟时间加快，第一关0.8，第二关0.7，第三关0.6，第四关0.5，第五关之后不变
      if(this.level < 5) {
         this.killDelay -= 0.1; 
      }
      // 第十关之前，关卡每升级一次，关门延迟随机时间下限减少100ms，上限减少200ms，第十关之后不变
      if(this.level < 10) {
         this.closeDurationLow -= 100; //减少关门延迟
         this.closeDurationHigh -= 200;
      }

      this.level ++; //关卡+1
      this.levelImage.setFrame(this.level.toString()); //设置关卡数字

      this.sign.setVisible(false); //设置关卡完成图片不可见
      this.isPaused = false; //标识游戏未暂停
   }

   
   /**
    * 玩家被强盗射击，产生玻璃碎裂弹孔3个，并执行关卡失败函数
    * @param {Number} x -容器Door的X坐标
    * @param {Number} y -容器Door的Y坐标
    */
   killed(x, y) {
      let offsetX = 100;

      for(let i = 0; i < 3; i ++) {
         let x = Phaser.Math.RND.between(offsetX, offsetX + 200);
         let y = Phaser.Math.RND.between(200, 600);

         let hole = this.add.image(x, y, 'bulletHole').setAlpha(0); //玻璃碎裂弹孔

         this.tweens.add({
            targets: hole,
            alpha: 1,
            duration: 30,
            delay: 200 * i
         });

         offsetX += 340;
      };

      this.levelFail(); //执行关卡失败函数

      // this.isPaused = true; //标识游戏暂停
      // this.scene.start('MainMenu');
   };
};

export default MainGame;