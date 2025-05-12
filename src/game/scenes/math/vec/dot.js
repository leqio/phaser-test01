/**
 * 向量计算：
 */
class Dot extends Phaser.Scene {
   constructor() {
      super('Dot')
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
    this.angle = 0;
    this.graphics = this.add.graphics({
        lineStyle: {
            width: 2,
            color: 0x2266aa
        }
    });

    /* new Phaser.Math.Vector2(x, y) 创建向量 */
    this.point = new Phaser.Math.Vector2(250, 0);// 目标点1坐标(250, 0)
    this.point2 = new Phaser.Math.Vector2(250, 0);// 目标点2坐标(250, 0)
    
    this.text = this.add.text(30, 30, '');

    this.input.on('pointermove', (pointer) => {
        // 当鼠标移动，point2 会被更新为鼠标位置
        this.point2.copy(pointer); // 将鼠标pointer坐标复制到point2

        // 将point2改为相对中心坐标（400， 300）
        this.point2.x -= 400; 
        this.point2.y -= 300;
    });




   }
   update() {
    /* 一个graphics可以画多个线条，像画笔一样可以连续绘画 */
    const graphics = this.graphics;
    graphics.clear();

    this.angle += 0.005;

    // .set(x, y),重置向量的 x 和 y 值
    this.point.set(Math.cos(this.angle) * 250, Math.sin(this.angle) * 250); // 目标点1坐标设置，在半径250圆上
    graphics.lineBetween(400, 300, 400 + this.point.x, 300 + this.point.y); // 画出一条（400,300）到 this.point的直线

    // graphics.lineStyle(...) 作用是：设置后续线条的样式，前面画的线，不会被新的样式影响
    graphics.lineStyle(2, 0x00aa00); 
    graphics.lineBetween(400, 300, 400 + this.point2.x, 300 + this.point2.y);// 画出一条（400,300）到this.point2的直线




    /*  O(0, 0), 两个向量 A(x₁, y₁) 和 B(x₂, y₂)，

    1. 点积：A.dot(B) 
    数学公式是：A · B = x₁ * x₂ + y₁ * y₂ ，
    数学意义：表示的是两个向量在同一方向上的相似程度，正值：角度小于 90°, 负值：角度大于 90°, 零：垂直
    使用场景: 
        判断两个向量的夹角关系; 点积越大 → 越“同向”,点积为 0 → 两向量垂直,点积为负 → 两向量方向相反
        用来求投影（一个向量在另一个向量方向上的“长度”）； 
        余弦角度计算（可用于判断方向相似度）
    

    2. 叉积：A.cross(B)
    数学公式是：A × B = x₁ * y₂ - y₁ * x₂ ，
    数学意义：表示的是向量 A 和 B 构成的平行四边形的面积（有方向）
    使用场景：用来判断相对方向， 
        > 0：B 在 A 的逆时针方向（左边）
        < 0：B 在 A 的顺时针方向（右边）
        = 0：两个向量共线

    
    3. 向量模长：A.length()
    4. 反余弦：Math.acos()
    */


    /* 
    数学余弦夹角公式: cos(θ) = (A·B) / (|A| * |B|) 
    求夹角：
        const dot = A.dot(B);
        const area = A.length() * B.length();
        const angleBetween = Math.acos(dot / area); // 得到θ夹角，范围 0 到 π
    */

    // 点积A·B
    const dotProduct = this.point.dot(this.point2);  
    // 向量模长乘积 |A| * |B|
    const area = this.point.length() * this.point2.length(); 
    // 得到θ夹角（0-π）， Math.acos(),反余弦
    const angleBetween = Math.acos(dotProduct / area); 

    // 叉积A × B，判断B在A的哪个方向
    const cross = this.point.cross(this.point2); 


    // 画一个扇形角度弧线
    graphics.lineStyle(2, 0xaa0000);
    graphics.beginPath(); // 定义开始路径
   
    

    /* graphics画弧线
    .arc(x, y, radius, startAngle, endAngle, [anticlockwise], [overshoot]), 画弧线
    请确保在开始 arc 之前调用 beginPath，除非你希望 arc 自动填充或描边时关闭。
    x：圆心x坐标 , 
    y：圆心y坐标，
    radius：半径，
    startAngle：起始角度（以弧度为单位），
    endAngle：结束角度（以弧度为单位），
    anticlockwise：默认false ，绘图为顺时针(false)或逆时针(true)，
    overshoot：超调 
    */

    // cross < 0则B在A左边, 结束角度为 this.angle + (-angleBetween)；cross > 0 则B在A右边,结束角度为 this.angle + angleBetween
    graphics.arc(400, 300, 100, this.angle, this.angle + (cross < 0 ? -angleBetween : angleBetween)); 
    graphics.strokePath(); // 结束路径并绘，(没有 strokePath() 就不会显示出来（只“规划”了路径）
    

    /* Phaser.Math.RadToDeg()，一个弧度（radian）转成角度（degree）
    角度 = 弧度 × (180 / π)
    Phaser.Math.RadToDeg(angleBetween) 相当于 angleBetween * (180 / Math.PI) 
    */
    this.text.setText([
        'Dot product: ' + dotProduct,
        'Normalized dot product: ' + dotProduct / area,
        'Angle between vectors: ' + Phaser.Math.RadToDeg(angleBetween),
        'Pointer is ' + (dotProduct > 0 ? 'in front of' : 'behind') + ' the blue vector direction'
    ])



    /* graphic有几种绘图方式：
    Phaser.GameObjects.Graphics 是 Phaser 中的“画笔”，它可以用来在屏幕上画各种 2D 图形

    1. 线条相关
    lineStyle(width, color, alpha)  设置线宽、颜色、不透明度
    lineBetween(x1, y1, x2, y2)  从点 A 到点 B 画一条直线（快速）
    moveTo(x, y) + lineTo(x, y)   手动控制路径点，适合连线/多段
    strokePath()    描边整个路径（线条）
    
    2. 图形绘制
    strokeRect(x, y, w, h)  描边矩形
    fillRect(x, y, w, h)  填充矩形
    strokeCircle(x, y, r)   描边圆
    fillCircle(x, y, r)   填充圆
    strokeEllipse(x, y, w, h)   描边椭圆
    fillEllipse(x, y, w, h) 填充椭圆
    strokeRoundedRect(x, y, w, h, radius)   描边圆角矩形
    fillRoundedRect(x, y, w, h, radius)    填充圆角矩形

    3. 路径控制
    beginPath() 开始一段新的绘图路径
    closePath() 结束当前路径（可封闭）
    strokePath()    描边路径
    fillPath()  填充路径

    4. 高级图形
    arc(x, y, radius, startAngle, endAngle, [anticlockwise], [overshoot])  画圆弧
    quadraticBezierTo(cpX, cpY, x, y)   二阶贝塞尔曲线
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) 三阶贝塞尔曲线
    fillPoints([...])   根据点列表填充区域
    strokePoints([...]) 根据点列表描边

    5. 通用
    clear() 清除当前画布
    fillStyle(color, alpha) 设置填充色、不透明度
    setScrollFactor() 设置跟随摄像机行为

    小技巧:
    想画多个形状 → 用 beginPath() + 一堆 draw + strokePath()/fillPath() 组合。
    每帧动态绘制 → clear() + 重画。
    需要持久保留 → 用 RenderTexture 替代 Graphics。

    例子：
    graphics.lineStyle(2, 0x00ff00);
    graphics.beginPath();
    graphics.moveTo(100, 100);       // 起点
    graphics.lineTo(200, 100);       // 连第一条
    graphics.lineTo(300, 200);       // 再连第二条
    graphics.strokePath();           // 一次画出来
    效果就是 一整条连续折线。 */
   }
};

export default Dot;