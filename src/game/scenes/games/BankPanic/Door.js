class Door extends Phaser.GameObjects.Container {
    constructor(name, scene, x, y) {
            super(scene, x, y);

            this.name = name;
            this.background = scene.add.image(0, 0, 'bank-panic', 'doorBackground');  //创建门框背景
            this.door = scene.add.sprite(0,0, 'bank-panic', 'door1'); // 创建门
            this.character = scene.add.image(0, 0, 'bank-panic', 'bandit1'); // 创建角色-强盗1
            this.characterFrame = 'bandit1'; // 记录角色帧为“bandit1”

            this.isOpen = false; // 门是否已经打开。
            this.isBandit = false;  // 门后的人是否是强盗（true 则玩家可以射击他）
            this.isHats = false;  // 门后的人是否是“帽子角色”，你可能有个机制是打掉帽子而不是人。
            this.isDead = false; // 门后的人是否已经被打死。
            
            // scene.doors.length：在场景MainGame中，使用for循环创建Door实例，每一次创建scene.doors.length都+1
            
            this.wasBandit = (scene.doors.length % 2) ? true : false;  // 记录此门上一次是否是强盗，初始化：奇数门中上一次为强盗，偶数门上一次非强盗
            
            this.hats = 0; // 门后角色拥有的帽子数量（可能用于得分、额外动作等）

            // Number.MAX_SAFE_INTEGER: 安全的最大整数。它的值是 9007199254740991,，这个值是 JavaScript 数字类型可以安全表示的最大整数
            this.timeToOpen = Number.MAX_SAFE_INTEGER; // 多久后门打开
            this.timeToClose = Number.MAX_SAFE_INTEGER; // 多久后门关闭
            this.timeToKill = 0; // 记录击杀动作发生的时刻（用于动画、得分计算等）

            // 所有可能出现在门后的人物帧名数组
            this.characters = [
                'bandit1',
                'bandit2',
                'cowboy1',
                'cowboy2',
                'hat'
            ];

            // 添加进容器： 门框背景，角色，门
            this.add([this.background, this.character, this.door]);
            // console.log('door-this', this);
            
            this.setSize(200, 400); // 设置容器Container大小
            this.setInteractive(); //设置容器Container交互性

            //容器Door点击事件,点击触发玩家射击
            this.on('pointerup', this.shoot, this); 

            // 手动将容器添加进场景
            scene.add.existing(this); //this指本容器
    }

    // 销毁函数
    destroy() {
        // this.off() 是 Phaser 中的一个方法，用于 移除事件监听器
        this.off('pointerup'); // 该对象将不再响应 pointerup 事件
    }
    // 初始化随机开门时间
    start(time) {
        this.timeToOpen = time + Phaser.Math.RND.between(500, 4000); // 随机时间500-4000ms
    }
    // 下一关卡时重置容器变量
    reset(time) {
        this.isOpen = false; // 门状态为关闭
        this.isBandit = false; // 角色不是强盗
        this.isHats = false; // 角色不是帽子角色
        this.isDead = false; // 门后的人没有被打死

        // 播放关门动画
        this.door.play('doorClose');
        // 设置开始时间
        this.timeToOpen = time + Phaser.Math.RND.between(500, 4000);
    }



    /**
     * 点击容器，触发玩家射击，根据门后角色标识，判断射击帽子或者射击角色，如果角色是强盗，则正确射击，否则失误射击
     */
    shoot() {
        // 门没开或者场景暂停
        if(!this.isOpen || this.scene.isPaused) return;

        this.scene.sound.play('shot'); //播放开枪声音

        // 如果射击的角色死亡
        if(this.isDead) {
            // 有枪声但没有任何效果
            return;
        };

        // 如果门后是强盗则射击角色
        if(this.isBandit) {
            this.shootCharacter(true);
        } else {
            if(this.isHats) {
                // 如果是门后帽子角色则射击帽子
                this.shootHat(); 
            } else {
                this.shootCharacter(false); // 否则射击角色
            }
        }
    }
    /**
     * 射击门后角色：1.角色死亡 2.播放尖叫声音 3.播放角色缩小动画 4.如果射击正确则关门（设置下次开门时间），射击错误则游戏失败
     * @param {Boolean} isShootRight - 是否射击正确，true-射击强盗，false-射击非强盗
     */
    shootCharacter(isShootRight) {
        this.isDead = true; // 角色死亡

        this.characterFrame += 'Dead'; // 记录角色帧改为'bandit1Dead'
        this.character.setFrame(this.characterFrame);  // 替换角色为'bandit1Dead'-死亡角色

        this.scene.sound.play('scream' + Phaser.Math.RND.between(1,3)); // 随机播放尖叫声音scream1,scream2,scream3

        // 死亡角色缩小动画
        this.scene.tweens.add({
            targets: this.character,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            onComplete: () => {
                // 判断是否射击正确，射击强盗则关门，射击非强盗则游戏失败
                if(isShootRight) {
                    // 关门并设置下次开门时间
                    this.closeDoor(this.scene.game.getTime()); //game.getTime()返回当前游戏步骤开始的时间，基于Performance.now
                } else {
                    this.off('pointerup'); // 禁用点击事件，防止玩家再次点击射击角色
                    this.scene.isPaused = true; // 标识暂停游戏
                    // 执行关卡失败函数
                    this.scene.levelFail(); 
                }
            }
        });
    }
    /**
     * (射击门角色帽子)更新角色帽子数量,更新帽子变少的角色
     */
    shootHat() {
        if(this.hats > 0) {
            this.scene.addHat(this.x, this.y, this.hats); // 在门的位置添加帽子（播放帽子被击飞的动画）
            this.hats --; // 角色帽子数量-1

            this.characterFrame = 'hat' + this.hats; // 更新角色帽子数量
        };

        this.character.setFrame(this.characterFrame);  // 更新帽子角色
    }

    
    

    /**
     * 判断执行开门或关门或强盗射击玩家
     * @param {Number} time -- 当前时间
     */
    update(time) {
        if(!this.isOpen && time >= this.timeToOpen) {
            this.openDoor(time); // 开门
        } else if (this.isOpen && time >= this.timeToClose) {
            this.closeDoor(time); // 关门
        } else if(this.isOpen && this.isBandit && !this.isDead && time >= this.timeToKill) {
            this.shootYou(); // 强盗射击玩家
        }
    }
    /**
     * 开门函数：1.设置关门时间（随机） 2.随机获取一个门后角色帧，根据角色帧判断是否是强盗、帽子角色并做好标记，并设置不同的关门时间 3.如果此门上一次非强盗且此次也非强盗，则此次强制设置为强盗。 4.如果是强盗，设置强盗开枪时间 5.播放开门动画及开门声音
     * @param {Number} time -- 当前时间
     */
    openDoor(time) {
        this.isOpen = true;
        // 初始化角色标记
        this.isBandit = false;
        this.isHats = false;
        this.isDead = false;

        // 随机获取角色帧
        // Phaser.Utils.Array.GetRandom() 用于从数组中随机选择一个元素
        this.characterFrame = Phaser.Utils.Array.GetRandom(this.characters);

        // 设置再次关门时间，关门时间随机
        const duration = Phaser.Math.RND.between(this.scene.closeDurationLow, this.scene.closeDurationHigh);
        this.timeToClose = time + duration;

        // 根据角色帧做标记，并设置不同的关门时间
        if(this.characterFrame === 'bandit1' || this.characterFrame === 'bandit2') {
            this.isBandit = true;
        } else if (this.characterFrame === 'hat') {
            this.isHats = true;

            this.hats = Phaser.Math.RND.between(2, 5); // 设置随机帽子数量
            this.characterFrame += this.hats.toString(); // 根据this.hats设置帽子角色this.characterFrame为'hat2'-'hat5'
        } else {
            this.timeToClose = time + (duration / 2); // 如果非强盗非帽子则设置关门时间为duration的一半
        };

        // 如果此门上一次非强盗且此次也非强盗，则此次强制设置为强盗。
        if(!this.wasBandit && !this.isBandit) {
            this.isHats = false; // 角色不是帽子
            this.hats = 0; // 重置帽子数量
            this.isBandit = true; // 角色是强盗
            this.characterFrame = (Math.random() > 0.5) ? 'bandit1' : 'bandit2'; // 随机选择强盗角色
            this.timeToClose = time + duration; // 设置再次关门的时间
        };

        // 根据角色帧设置门后角色
        this.character.setFrame(this.characterFrame);
        this.character.setScale(1).setAlpha(1);

        // 如果是强盗，设置强盗开枪时间
        if(this.isBandit) {
            this.timeToKill = time + (duration * this.scene.killDelay); // 设置强盗开枪时间
        }

        this.scene.sound.play('door'); // 播放开门声音
        this.door.play('doorOpen'); // 播放开门动画

    }
    /**
     * 关门函数：1.播放关门动画  2.更新this.wasBandit标记 3.根据角色标记判断，若不是强盗、帽子、死亡角色，则获取金币 4.设置下一次开门时间
     * @param {Number} time -- 当前时间
     */
    closeDoor(time) {
    
        this.door.play('doorClose');// 播放关门动画

        this.isOpen = false; // 门的状态为关闭
        this.wasBandit = this.isBandit; // 门后为强盗

        // 若不是强盗、帽子、死亡角色，则获取金币
        if(!this.isBandit && !this.isHats && !this.isDead) {
            this.scene.addGold(this.x, this.y); // 在门的位置添加金币播放金币tween动画
        }

        // 设置下一次开门的时间，时间在传入时间（`time`）基础上加上 2000 到 4000 毫秒之间的随机值
        this.timeToOpen = time + Phaser.Math.RND.between(2000, 4000);
    }
    /**
     * 强盗射击玩家: 1. 禁用点击事件 2. 暂停游戏 3. 播放射击动画 4. 播放射击声音 5. 播放枪口火焰消失,开枪硝烟tween动画 6. 执行玩家被强盗射击，产生玻璃碎裂弹孔3个，并执行关卡失败函数
     */
    shootYou() {
        this.off('pointerup');

        this.scene.isPaused = true; // 暂停游戏
        
        // 枪口火焰
        let shot1 = this.scene.add.image(this.x, this.y, 'bank-panic', this.characterFrame + 'shot1');
        let shot2 = this.scene.add.image(this.x, this.y, 'bank-panic', this.characterFrame + 'shot2');
        // 播放强盗射击枪声
        this.scene.sound.play('banditShot');
        this.scene.sound.play('banditShot', { delay: 0.25 });
        this.scene.sound.play('banditShot', { delay: 0.5 });
        // 枪口火焰消失动画
        this.scene.tweens.add({
            targets: shot1,
            alpha: 0,
            duration: 200,
            ease: 'Power2'
        });
        this.scene.tweens.add({
            targets: shot2,
            alpha: 0,
            duration: 200,
            delay: 200,
            ease: 'Power2',
            onComplete: () => {
                this.scene.killed(this.x, this.y); // 玩家被强盗射击，产生玻璃碎裂弹孔3个，并执行关卡失败函数
            }
        });

        // 开枪硝烟
        let smoke1 = this.scene.add.image(this.x, this.y, 'bank-panic', this.characterFrame + 'smoke1');
        let smoke2 = this.scene.add.image(this.x, this.y, 'bank-panic', this.characterFrame + 'smoke2');
        // 硝烟动画
        this.scene.tweens.add({
            targets: smoke1,
            // props用来定义多个属性的独立 tween 配置
            props: {
                y: { value: 150, duration: 1000, ease: 'Sine.easeInOut' },
                alpha: { value: 0, duration: 250, ease: 'Power2', delay: 750}
            }
        });
        this.scene.tweens.add({
            targets: smoke2,
            // props用来定义多个属性的独立 tween 配置
            props: {
                y: { value: 150, duration: 1000, ease: 'Sine.easeInOut', delay: 500  },
                alpha: { value: 0, duration: 250, ease: 'Power2', delay: 1250}
            }
        });

    }
    
};

export default Door;