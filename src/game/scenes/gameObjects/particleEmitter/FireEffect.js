/**
 * @description 粒子发射器粒子效果
 * api： https://docs.phaser.io/api-documentation/class/gameobjects-particles-particleemitter
 */
class FireEffect extends Phaser.Scene {
  constructor() {
    super("FireEffect");
  }
  init() {
    // 获取画布中心位置
    this.centerX = this.scale.width / 2;
    this.centerY = this.scale.height / 2;
    // 计算位置比例
    this.scaleX = this.scale.width / 1920;
    this.scaleY = this.scale.height / 1080;
  }
  preload() {
    this.load.setBaseURL("/api");
    this.load.atlas("flares","assets/particles/flares.png","assets/particles/flares.json");
  }
  create() {

   // this.add.image(300, 490, "flares", 'white').setOrigin(0, 0); 

   //#region 创建粒子发射器，this.add.particles()

    /* new ParticleEmitter(scene, [x], [y], [texture], [config])
    this.add.particles(x, y,textureKey, config) 将返回一个 ParticleEmitter 实例,
    x：粒子发射器的 X 坐标（150）。
    y：粒子发射器的 Y 坐标（550）。
    textureKey：粒子的纹理键（'flares'），这是加载到游戏中的纹理集的键名。
    config：一个对象，包含粒子发射器的配置参数。 */

    // 火焰粒子发射器
    const flame = this.add.particles(50, 550, "flares", {
      frame: "white",                                    //指定粒子使用的纹理帧
      color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],   // 一个数组，定义了粒子的颜色渐变。粒子的颜色将在这些颜色之间过渡
      colorEase: "quad.out",                             //定义颜色过渡的缓动函数
      lifespan: 2400,                                    //每个粒子的生命周期（以毫秒为单位）,2400ms = 2.4s
      angle: { min: -100, max: -80 },                    // 定义粒子发射的角度范围,负角度表示粒子向上发射
      scale: { start: 0.7, end: 0, ease: "sine.out" },   // 定义粒子的缩放效果
      speed: 100,                                        // 定义粒子的速度,100 像素/秒
      advance: 2000,                                     // 定义粒子发射器的发射频率,粒子发射器每 2000 毫秒（2 秒）发射一次粒子
      blendMode: "ADD",                                  //定义粒子的混合模式。在这个例子中，使用了 'ADD'，表示粒子将使用加性混合模式。这种模式可以使粒子效果更加明亮，通常用于火焰、光效等场景。
    });

   //  魔法光晕粒子发射器
    const wisp = this.add.particles(180, 550, "flares", {
      frame: "white",
      color: [0x96e0da, 0x937ef3],
      colorEase: 'quart.out',
      lifespan: 1500,
      angle: { min: -100, max: -80 },
      scale: { start: 1, end: 0, ease: "sine.in" },
      speed: { min: 250, max: 350 }, // 粒子的速度在 250 到 350 像素/秒之间。这意味着每个粒子的速度会在这个范围内随机选择
      advance: 2000,
      blendMode: "ADD"
    })

   //  火焰烟雾粒子发射器
    const smokey = this.add.particles(340, 550, "flares", {
      frame: 'white',
      color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
      lifespan: 1500,
      angle: { min: -100, max: -80 },
      scale: 0.75,
      speed: { min: 200, max: 300 },
      advance: 2000,
      blendMode: "ADD",
    })

   //#endregion


   //#region 添加粒子发射器的发射区域，.addEmitZone(config)

   // 创建几何形状
   const shape1 = new Phaser.Geom.Circle(0, 0, 160); // 圆形
   const shape2 = new Phaser.Geom.Ellipse(0, 0, 500, 150); // 椭圆形
   const shape3 = new Phaser.Geom.Rectangle(-150, -150, 300, 300); // 矩形
   const shape4 = new Phaser.Geom.Line(-150, -150, 150, 150); // 线段
   const shape5 = new Phaser.Geom.Triangle.BuildEquilateral(0, -140, 300); // 等边三角形

   // 创建粒子发射器
   const emitter = this.add.particles(750, 400, "flares", {
      frame: {
         frames: [ 'white', 'blue', 'red', 'yellow', 'green'], // 指定粒子使用的纹理帧
         cycle: true, // 循环播放
      },
      blendMode: "ADD",
      lifespan: 500, // 每个粒子的生命周期（以毫秒为单位）
      quantity: 4, // 每次发射4个粒子
      scale: { start: 0.5, end: 0.1 }, // 定义粒子的缩放效果
   });

   // 添加发射区域， .addEmitZone(config)
   // 巧合每个发射区域都是同色粒子：粒子纹理帧是 按顺序使用 frames 列表中的内容的，所以如果你连续添加了 5 个 zone，5个发射区域同时发射1次粒子，Phaser 在发射过程中就会轮流使用 frame，也就是白色、蓝色、红色、黄色、绿色，依次发射，第2个生命周期内又会依次发射
   // 发射区域粒子分布点依次发射：粒子不是随机选点发射，而是顺序走过这 64 个点，每个点发射 1 个粒子
   emitter.addEmitZone({
      type: 'edge', // 发射区域类型edge: 沿着边缘
      source: shape1, // 圆形
      quantity: 64, // 沿边缘分布64个粒子的位置
      total: 1, // 表示 整个生命周期内，只会从这些点各发射一次粒子
   });
   emitter.addEmitZone({
      type: 'edge', 
      source: shape2, 
      quantity: 64, 
      total: 1, 
      
   });
   emitter.addEmitZone({
      type: 'edge', 
      source: shape3, 
      quantity: 64, 
      total: 1, 
   });
   emitter.addEmitZone({
      type: 'edge', 
      source: shape4, 
      quantity: 64, 
      total: 1,
   });
   emitter.addEmitZone({
      type: 'edge', 
      source: shape5, 
      quantity: 64, 
      total: 1, 
   });

   //#endregion

  }
  update() {}
}

export default FireEffect;
