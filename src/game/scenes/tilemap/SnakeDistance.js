/**
 * @description: 瓦片地图tilemap CSV格式-玩家聚光灯效果
 * --使用曼哈顿距离算法：Phaser.Math.Distance.Snake(x1, y1, x2, y2) 返回值: |x2 - x1| + |y2 - y1|
 */
class SnakeDistance extends Phaser.Scene {
   constructor() {
      super('SnakeDistance')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;

     this.map;
     this.player;
     this.cursors;
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('tiles', 'assets/tilemaps/tiles/catastrophi_tiles_16.png');
    this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });

    /* Phaser 瓦片地图格式：
        CSV：简洁、轻量，只包含瓦片索引，适合静态地图；
        JSON：富信息，支持多个图层、对象、属性，适合复杂地图 

        this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tile-collision-test.json'); 
    */
    this.load.tilemapCSV('map', 'assets/tilemaps/csv/catastrophi_level2.csv'); // 加载瓦片地图

   }
   create() {
    this.map = this.make.tilemap({ key:'map', tileWidth: 16, tileHeight: 16 }); // 创建瓦片地图实例
    const tileset = this.map.addTilesetImage('tiles'); // 将图片加载为瓦片集
    const layer = this.map.createLayer(0, tileset, 0, 0); // 将瓦片集加载到图层名为0的图层中

    // 玩家移动动画anims
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {start: 8, end: 9}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 1, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('player', {start: 11, end: 13}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('player', {start: 4, end: 6}),
        frameRate: 10,
        repeat: -1
    });


    this.player = this.physics.add.sprite(this.centerX, this.centerY, 'player', 1); // 创建玩家
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels); // 设置世界边界
    this.player.setCollideWorldBounds(true); // 设置玩家不允许移出边界

    // 设置摄像机边界为瓦片地图大小
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels); 
    // 设置摄像机跟随玩家移动
    this.cameras.main.startFollow(this.player); 

    this.cursors = this.input.keyboard.createCursorKeys(); // 创建方向键输入

   }
   update(time, delta) {
    this.updatePlayer(); // 玩家移动
    this.updateMap(); // 设置瓦片地图中玩家周围的瓦片透明度
   }

   /**
    * 
    */
   updateMap() {
    /* this.map.getTileAtWorldXY(worldX, worldY, nonNull, camera, layer)，
    获取某个世界坐标（像素）上对应瓦片（tile）对象 的方法
    worldX -世界坐标的 X 值（单位：像素）
    worldY -世界坐标的 Y 值（单位：像素）
    nonNull	（可选） -如果为 true，即使没有瓦片也返回一个空的 Tile 对象
    camera	（可选） -相机视角，默认是主相机
    layer	（可选） -目标图层，默认是第一个图层 

    示例：判断角色脚下是否有某种瓦片
    const tile = this.map.getTileAtWorldXY(player.x, player.y + 16, false, this.cameras.main, 'GroundLayer');
    if (tile && tile.index === 5) {
        console.log('角色站在特殊瓦片上！');
    }

    */
    const origin = this.map.getTileAtWorldXY(this.player.x, this.player.y);  // 返回玩家所在瓦片
    // console.log('Player current tile:', origin, origin.index);

    this.map.forEachTile((tile) => {
        // Phaser.Math.Distance.Snake(x1, y1, x2, y2) 返回值: |x2 - x1| + |y2 - y1|
        const dist = Phaser.Math.Distance.Snake(
            origin.x,  // 玩家所在瓦片的
            origin.y,
            tile.x,
            tile.y
        );

        tile.setAlpha(1 - 0.1 * dist);
    })
    
   }

   /**
    * 玩家移动
    */
   updatePlayer() {
    this.player.body.setVelocity(0, 0); // 设置玩家速度为0
    this.player.body.allowGravity = false; // 禁用重力
    // this.player.body.setVelocity(0); // 重置速度为0，是瞬时的，之后还会受重力影响

    if(this.cursors.left.isDown) {
        this.player.body.setVelocityX(-100); // 向左移动

    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(100); // 向右移动

    } else if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-100); // 向上移动

    } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(100); // 向下移动

    } 



    if (this.cursors.left.isDown) {
        this.player.anims.play('left', true); // 播放left动画
    } else if (this.cursors.right.isDown) {
        this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown) {
        this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
        this.player.anims.play('down', true);
    } else {
        this.player.anims.stop();
    }

   }
};

export default SnakeDistance;