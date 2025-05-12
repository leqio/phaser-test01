/**
 * @description: 瓦片地图tilemap JSON格式-玩家聚光灯效果
 */
class Spotlight extends Phaser.Scene {
   constructor() {
      super('Spotlight')
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
    this.load.setBaseURL("/api");
    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
    this.load.spritesheet('coin','assets/sprites/coin.png', {frameWidth: 32, frameHeight: 32});
    this.load.image('player', 'assets/sprites/phaser-dude.png');
    this.load.image('mask', 'assets/sprites/mask1.png');

    // 加载瓦片地图数据,使用 Tiled编辑器 创建的 JSON 文件
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json'); 
   }
   create() {
    // make和add区别：make() 方法用于创建一个新的对象，而 add() 方法用于将现有对象添加到场景中。

    /* Tilemap 的主要作用是将瓦片数据组织在一起，以便在游戏中进行渲染和交互。 */

    // this.make.tilemap(), 创建一个瓦片地图 Tilemap 对象，存储和管理瓦片地图的数据。
    const map = this.make.tilemap({key: 'map'}); // 创建瓦片地图对象，使用加载的地图资源map

    // .addTilesetImage() ，将瓦片集（Tileset）添加到瓦片地图中，瓦片集是一个包含多个瓦片（Tiles）的图像。
    // 当瓦片集加入到地图中后，会按照全局索引重新分配瓦片索引值，第一个瓦片集的第一个瓦片的索引为1
    const groundTiles = map.addTilesetImage('ground_1x1'); // 包含25个瓦片，瓦片全局索引为1-25
    const coinTiles = map.addTilesetImage('coin'); // 包含5个瓦片，瓦片全局索引为26-30


    // .createLayer(layerID, tileset, [x], [y])，创建一个瓦片图层。layerID 是图层的名称，对应于在地图编辑器中定义的图层名称。tileset：指定该图层使用的瓦片集。图层的起始位置（X 和 Y 坐标）。
    const backgroundLayer = map.createLayer('Background Layer', groundTiles, 0, 0); // 背景图层
    const groundLayer = map.createLayer('Ground Layer', groundTiles, 0, 0); // 地面图层
    const coinLayer = map.createLayer('Coin Layer', coinTiles).setVisible(false); // 硬币图层

    


    // 创建一个渲染纹理，渲染纹理在backgroundLayer，groundLayer，coinLayer等图层上方，但在coin对象下方。
    // this.add.renderTexture：创建一个渲染纹理对象。渲染纹理用于在游戏中创建动态效果，比如粒子效果、光照效果等。
    this.rt = this.add.renderTexture(0, 0, this.scale.width, this.scale.height); // 创建一个渲染纹理对象，大小为画布的宽度和高度。
    this.rt.setOrigin(0, 0); // 设置原点为左上角
    this.rt.setScrollFactor(0, 0); // 设置滚动因子为0，表示不随摄像机滚动而滚动


    /* 创建硬币 */
    this.anims.create({
        key: 'coin', // 动画的名称
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 4 }),// 硬币动画的帧范围0-4帧
        frameRate: 10, // 帧率
        repeat: -1 ,// 重复次数，-1表示无限循环
    })
    const coins = []; //包含所有硬币对象
    // 遍历硬币图层的每个瓦片，查找硬币瓦片（硬币瓦片索引为26），并创建一个硬币对象
    coinLayer.forEachTile(tile => {
        // if (tile.index !== -1) { // 排除空瓦片，即索引为-1的瓦片
        //     console.log('Tile index:', tile);
        // }
        if(tile.index === 26) {
            // 瓦片尺寸是 32x32 像素，(tile.pixelx, tile.pixely) 是瓦片的左上角坐标,(tile.x, tile.y) 是瓦片在图层的列和行索引
            const coin = this.physics.add.sprite(tile.pixelX + 16, tile.pixelY + 16, 'coin');
            coin.body.allowGravity = false; // 禁用重力
            coin.anims.play({
                key: 'coin', // 播放硬币动画
                delay: Phaser.Math.Between(0, 200), // 随机延迟播放动画
            }); // 播放硬币动画
            coins.push(coin); 
        }
    }); 

    // 设置地面图层的碰撞范围
    // .setCollisionBetween(start, end, collide, layer)，设置图层的碰撞范围
    groundLayer.setCollisionBetween(1, 25); // groundLayer图层中，索引 1 到 25 的瓦片将被设置为可碰撞

    // 创建一个玩家对象
    this.player = this.physics.add.sprite(80, 70, 'player').setBounce(0.1); 

    // 添加碰撞检测
    this.physics.add.collider(this.player, groundLayer); 
    // 添加重叠检测
    this.physics.add.overlap(this.player, coins, (p, c) => {
        c.visible = false; // 隐藏硬币
    }); 


    // 设置摄像机边界
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); 
    // 摄像机跟随玩家移动
    this.cameras.main.startFollow(this.player); 


    // 创建方向键输入
    this.cursor = this.input.keyboard.createCursorKeys(); 

   }
   update() {
    this.player.body.setVelocityX(0); // 设置玩家横向速度为0

    // 键盘输入控制玩家移动
    if(this.cursor.left.isDown) {
        this.player.body.setVelocityX(-200); // 向左移动
    } else if(this.cursor.right.isDown) {
        this.player.body.setVelocityX(200); // 向右移动
    }

    if((this.cursor.space.isDown || this.cursor.up.isDown) && this.player.body.onFloor()) {
        this.player.body.setVelocityY(-300); // 向上移动
    } 

    const cam = this.cameras.main; // 获取主摄像机


    this.rt.clear(); // 清除渲染纹理
    this.rt.fill(0x000000); // 渲染纹理填充黑色背景

    // .erase(key, x, y) 擦除渲染纹理中的区域，形成聚光灯效果
    // key:任何可渲染的游戏对象,x: 绘制 Frame 的 x 位置，或应用于对象的偏移,y: 绘制 Frame 的 y 位置，或应用于对象的偏移。

    // mask宽高为213*213，擦除区域的默认原点在左上角，擦除区域需要相对于主相机的位置，所以需要减去摄像机的滚动值 cam.scrollX 和 cam.scrollY
    this.rt.erase('mask', this.player.x - 107 - cam.scrollX,this.player.y - 107 - cam.scrollY); 
    
    
   }
};

export default Spotlight;