/**
 * @description Mesh(网格)：3D 模型组件，渲染一组带纹理的顶点并进行作这些顶点的视图，例如旋转、平移或缩放。
 */
class MeshFromArray extends Phaser.Scene {
   constructor() {
      super('MeshFromArray')
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
    this.load.image('bg', 'assets/skies/gradient13.png');
    this.load.image('ayu', 'assets/pics/ayu.png');
   }
   create() {
    this.add.image(400, 300, 'bg').setFlip(false, true);

    /* 
    vertices：顶点坐标数组
        定义网格顶点，常规坐标系（向右为 x 坐标，向上为 y 坐标）。
    uvs：UV 坐标数组
        纹理映射到网格，UV坐标系（左上角(0, 0) 开始，向右为 x 坐标，向下为 y 坐标）。
    indicies：
        使用顶点连接，构建多个三角形来形成一个多边形（以 0 开始标记左上角顶点，顺时针标记其他顶点）。
        比如：矩形的四个顶点标记分别为：左上角(0), 右上角(1), 左下角(2), 右下角(3)，
        const indicies = [0 ,2, 1, 2, 3, 1]; // 构建一个三角形（0, 2, 1）和另一个三角形（2, 3, 1），组成四边形

    注意：在 Phaser 的 Mesh 渲染流程中，必须通过三角形（由三个顶点组成）来构建表面；
        .addVertices(vertices, uvs, indices) 中的 indices 就是告诉引擎：哪三个顶点组成一个三角形

        你可以通过自定义更多顶点和 indices 连接规则来绘制任意形状，但 最终 Phaser 还是把它们按三角形处理;
        因为GPU 只能渲染三角形，三角形是最稳定的图形单位。

    */


    /* 
    Mesh 方法和属性：
    const mesh = this.add.mesh(400, 300, 'ayu');
    .addVertices(vertices, uvs, indicies); // .addVertices(vertices, uvs, indicies) 方法将顶点、UV 和索引数据添加到 Mesh 中

    .modelRotation.x/y // mesh 的旋转角度（单位：弧度）
    
    .panX(amount); // 沿 X 方向移动
    .panY(amount); // 沿 Y 方向移动
    .panZ(amount); // 沿 Z 方向移动（常用于缩放、前后拉近）

    .debugCallback //标识 mesh是否处于调试状态
    */

    // 顶点数据 (vertices),定义矩形顶点
    const vertices = [
        -1, 1,  // 左上角
        1, 1,   // 右上角
        -1, -1, // 左下角
        1, -1,  // 右下角
    ];
      
    // UV 坐标，将纹理映射到网格上。每个顶点都有一个 UV 坐标，用来决定这个顶点对应纹理图像的哪个部分
    const uvs = [
        0, 0,  // 左上
        1, 0,  // 右上
        0, 1,  // 左下
        1, 1,  // 右下
    ];
    
    // 索引数据 (indices)， 第一个三角形：0, 2, 1， 第二个三角形：2, 3, 1
    const indicies = [0 ,2, 1, 2, 3, 1];

    // this.add.mesh() 创建了一个 Mesh 对象，并传入了纹理 'ayu'
    const mesh = this.add.mesh(400, 300, 'ayu');
    // .addVertices(vertices, uvs, indicies) 方法将顶点、UV 和索引数据添加到 Mesh 中
    mesh.addVertices(vertices, uvs, indicies);
    // .panZ(7) 则是将 Mesh 向前移动了 7 个单位，给它一定的 深度感
    mesh.panZ(7);
    
    mesh.modelRotation.x = Phaser.Math.DegToRad(45); 
    mesh.modelRotation.y = Phaser.Math.DegToRad(-45); 

    
    this.add.text(16, 16, 'Rotate with mouse (+ Shift to pan)\nWheel to zoom\nD to toggle debug');

    // 创建一个graphics,用于调试绘制,不会自动显示任何内容
    this.debug = this.add.graphics();
    mesh.setDebug(this.debug);

    this.input.keyboard.on('keydown-D', () => {
        // .debugCallback, mesh的属性，标识mesh是否处于调试状态
        if (mesh.debugCallback) {
            mesh.setDebug(); // 关闭调试模式
        } else {
            // .setDebug(), 告诉 mesh：把调试信息（顶点编号、线框等）画到这个 Graphics 对象this.debug上。开启调试模式
            mesh.setDebug(this.debug); 
        }
    }) ;

    const rotateRate = 1; // 控制旋转的速度
    const panRate = 1; //  控制平移（拖动）的速度
    const zoomRate = 4; // 控制缩放速度

    // 监听鼠标移动，但只在鼠标按下拖动时才处理
    this.input.on('pointermove', (pointer) => {
       if(!pointer.isDown) return;

       // shift键没有被按下，则控制网格mesh的旋转; 按下了 Shift，mesh就进入平移（pan）模式
       if(!pointer.event.shiftKey) {
        // .modelRotation.x/y 是 mesh 的旋转角度（单位：弧度）
        // pointer.velocity.x 表示鼠标水平方向的速度（像素/秒）,(rotateRate / 800) 缩放比例因子，用来控制移动的灵敏度
        // 使用 += 是因为你想要 “累加”旋转值，也就是让物体持续旋转，而不是每一帧都重置角度。
        mesh.modelRotation.y += pointer.velocity.x * (rotateRate / 800);
        mesh.modelRotation.x += pointer.velocity.y * (rotateRate / 600);
       } else {
        //.panX/Y() 是 mesh 的平移量
        mesh.panX(pointer.velocity.x * (panRate / 800));
        mesh.panY(pointer.velocity.y * (panRate / 600));
       }
    });

    this.input.on('wheel', (pointer, over, deltaX, deltaY, deltaZ) => {

        mesh.panZ(deltaY * (zoomRate / 600));

    });

   }
   update() {
    // this.debug.clear();
    // this.debug.lineStyle(1, 0x00ff00);
   }
};

export default MeshFromArray;