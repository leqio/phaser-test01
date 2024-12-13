// 扩展 Phaser.Scene，使所有场景都可以调用 addText 方法
Phaser.Scene.prototype.addText = function (x, y, text, fontWeight, fontSize, lineHeight, color, wordWrapWidth = null, originX = 0, originY = 0) {
    const style = {
        fontFamily: 'PingFang SC, PingFang SC',
        fontWeight: fontWeight,
        fontSize: fontSize,
        color: color,
        lineHeight: lineHeight,
    };

    if (wordWrapWidth) {
        style.wordWrap = { width: wordWrapWidth };
    }

    return this.add.text(x, y, text, style).setOrigin(originX, originY);
};


// 创建一个长方形按钮
Phaser.Scene.prototype.addBtn = function(btn, btnWidth, btnHeight, btnColor, btnText, x, y, nextScene) {
    btn = this.add.rectangle(x, y, btnWidth, btnHeight, btnColor) // 绿色按钮
        .setInteractive()  // 使按钮可交互
        .setOrigin(0.5, 0.5); // 设置矩形的中心点为按钮中心

    // 在按钮中添加文字
    this.add.text(x, y, btnText, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#FFFFFF',
        align: 'left'
    }).setOrigin(0.5, 0.5); // 设置文字居中

    // 设置按钮点击事件
    btn.on('pointerdown', () => {
        btn.setAlpha(0.5); 
        this.scene.start(nextScene); // 跳转到下一个场景
        console.log('currentScene--', nextScene);
        
    });
    btn.on('pointerup', () => {
        btn.setAlpha(1); 
    });

    // 鼠标悬停时改变光标样式
    btn.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
    });

    // 鼠标移出时恢复光标样式
    btn.on('pointerout', () => {
        this.input.setDefaultCursor('default');
    }); 
    
    return btn;
  }