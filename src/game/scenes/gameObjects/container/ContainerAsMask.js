import Phaser from 'phaser';

/**
 * @description: 这个场景演示了如何使用容器作为遮罩来创建复杂的视觉效果。
 */
class ContainerAsMask extends Phaser.Scene {
   constructor() {
      super('ContainerAsMask');
      this.rootContainer;
      this.containerTails = [];
      this.containers = []; // 记录所有容器
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
    this.load.setBaseURL('api');
    this.load.image('backdrop', 'assets/pics/platformer-backdrop.png');
    this.load.image('arrow', 'assets/sprites/arrow.png');
    this.load.image('mask', 'assets/pics/mask.png');
    this.load.image('bunny', 'assets/sprites/bunny.png');
   }
   create() {
    /* this.add.image()和 this.make.image(config),后者适合复杂的场景 */
    const backdrop = this.make.image({
        x: this.centerX, 
        y: this.centerY, 
        key: 'backdrop',
        add: true, // 默认为true, 自动添加进场景，false为不添加进场景
    }).setScale(3);

    const maskImage = this.make.image({
        x: this.centerX,
        y: this.centerY,
        key: 'mask',
        add: false, 
    }).setScale(2);

    let lastContainer;
    const count = 40;

    const bunny = this.make.sprite({
        x: this.centerX,
        y: this.centerY,
        key: 'bunny',
        add: true,
    });

    // 创建容器
    this.rootContainer = this.make.container({
        x: this.centerX,
        y: this.centerY,
        add: false,
    });


    /* Phaser.Display.Masks.BitmapMask(): 
        它是 Phaser 中的一种遮罩类型--位图遮罩，用于基于另一个对象（如图像或容器）的像素透明度创建遮罩。
        遮罩的效果是：只有遮罩对象中不透明的部分才会显示目标对象（bunny） */
    const Imgmask = new Phaser.Display.Masks.BitmapMask(this, this.rootContainer);
    bunny.setMask(Imgmask); // 给bunny设置位图遮罩， this.rootContainer中不透明的地方才显示bunny


    // 构建嵌套容器结构，每个容器中加入一个图像 image
    for(let j = 0; j < 4; j++) {  // 4个方向的容器
        for( let i = 0; i < count; ++ i ) { // 每个方向容器40个箭头
            
            const image = this.make.image({  
                x: 0, 
                y: 0,
                key: 'arrow',
                add: true,
            });

            // 每个方向上的上一层容器lastContainer
            if(i === 0) {
                // 第一层容器
                lastContainer = this.make.container({x: 0, y: 0 , add: false});// 创建容器lastContainer
                lastContainer.rotation += (j * 90) * Math.PI / 180; // 旋转lastContainer的弧度； Math.PI / 180 是一个常量，用来将角度转换为弧度
                
                this.containers.push(lastContainer);  
                this.rootContainer.add(lastContainer); // 将容器lastContainer添加进容器this.rootContainer
            } else {
                // 设置新容器newContainer
                let newContainer = this.make.container({
                    x: image.width, // 将容器水平偏移，形成递进效果
                    y: 0,
                    add: false,
                });
                lastContainer.add(newContainer); // 添加到上一层容器
                lastContainer = newContainer;   // 更新为新的容器

                newContainer.setScale(1 - i / (count)); // 根据层级设置缩放，逐渐变小
                newContainer.rotation = i / count * 2; // 根据层级设置旋转，旋转角度逐渐变大
            };

            image.setOrigin(0, 0.5);
            lastContainer.add(image); // 每次迭代时，将创建的图像 image 添加到当前层级的容器中。


            // 创建分支容器,在i为4， 5 ，10 的时候创建分支
            if (i === 4 || i === 5 || i === 10) {
                let leafContainer = lastContainer; 
                const direction = i === 5 ? 1 : -1; 
                for( let k = 0; k < 10; ++k) {
                    let image2 = this.make.image({
                        x: 0,
                        y: 0,
                        key: 'arrow',
                        add: false,
                    });
                    image2.setOrigin(0, 0.5);

                    let newContainer = this.make.container({
                        x: image2.width,
                        y: 0,
                        add: false,
                    });
                    leafContainer.setScale(1- k / 10);  // 逐渐变小
                    leafContainer.rotation = 0.1 * direction; // 偏移0.1

                    leafContainer.add(newContainer);
                    leafContainer = newContainer;

                    leafContainer.add(image2);
                }
            };

            // 记录最后一层的容器
            if( i === count - 1) {
                this.containerTails.push(lastContainer);
            };

        };


        // 点击移动bunny对象
        let move = false;
        this.input.on('pointerdown', () => {
            move = true;
        });
        this.input.on('pointerup', () => {
            move = false;
        });
        this.input.on('pointermove', (pointer) => {
            if(move) {
                bunny.x = pointer.x;
                bunny.y = pointer.y;
            }
        });
    }
    

   }
   update() {
        for(let i = 0; i < this.containerTails.length; ++ i) {
            const container = this.containerTails[i]; // 最里面的容器
            this.rotateContainer(container, 0.01); // 旋转容器及其父容器
        };
        this.rootContainer.rotation += 0.01;
   }


// 递归旋转容器及其父容器
   rotateContainer(container, rotation) {
        if (container){
            container.rotation += rotation;
            this.rotateContainer(container.parentContainer, rotation);
        }
   }
};

export default ContainerAsMask;