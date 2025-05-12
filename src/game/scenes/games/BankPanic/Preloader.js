import Phaser from "phaser";

class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
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
    this.loading = this.add.image(512, 384, "loading");

    this.load.setBaseURL("/api");
    this.load.setPath("assets/games/bank-panic/");

    this.load.image("start");
    this.load.image("title");
    this.load.image("logo");
    this.load.image("background");
    this.load.image("bulletHole", "bullet-hole.png");
    this.load.atlas("bank-panic", "bank-panic.png", "bank-panic.json");

    this.load.audio("shot", ["shot.ogg", "shot.m4a", "shot.mp3"]);
    this.load.audio("banditShot", ["50cal.ogg", "50cal.m4a", "50cal.mp3"]);
    this.load.audio("money", ["money.ogg", "money.m4a", "money.mp3"]);
    this.load.audio("levelComplete", [
      "complete.ogg",
      "complete.m4a",
      "complete.mp3",
    ]);
    this.load.audio("gameOver", [
      "gameover.ogg",
      "gameover.m4a",
      "gameover.mp3",
    ]);
    this.load.audio("music", ["music.ogg", "music.m4a", "music.mp3"]);
    this.load.audio("door", ["door.ogg", "door.m4a", "door.mp3"]);
    this.load.audio("scream1", ["scream1.ogg", "scream1.m4a", "scream1.mp3"]);
    this.load.audio("scream2", ["scream2.ogg", "scream2.m4a", "scream2.mp3"]);
    this.load.audio("scream3", ["scream3.ogg", "scream3.m4a", "scream3.mp3"]);
  }
  create() {
    // 创建开门动画
    this.anims.create({
      key: "doorOpen",
      frames: this.anims.generateFrameNames("bank-panic", {
        prefix: "door",
        start: 1,
        end: 5,
      }),
      frameRate: 20,
    });
    // 创建关门动画
    this.anims.create({
      key: "doorClose",
      frames: this.anims.generateFrameNames("bank-panic", {
        prefix: "door",
        start: 5,
        end: 1,
      }),
      frameRate: 20,
    });

    this.loading.setTexture("start");
    this.loading.setInteractive(); // 设置交互性
    this.loading.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
  update() {}
}

export default Preloader;
