/**
 * @description: 文字宽度换行
 */
class Text_wordWrap extends Phaser.Scene {
   constructor() {
      super('Text_wordWrap')
   }
   init() {
     // 获取画布中心位置
     this.centerX = this.scale.width/2;
     this.centerY = this.scale.height/2;
     // 计算位置比例
     this.scaleX = this.scale.width / 1920;
     this.scaleY = this.scale.height / 1080;

     this.textsPassed = 0;
     this.totalTests = 0;
   }
   preload() {

   }
   create() {
/*this.add.text()和this.make.text(config)区别：
   1. this.add.text(x, y, text, style); 直接将文本添加到当前场景的显示列表中，立即可见并参与渲染
      - 适用场景:
         用于需要在场景中立即显示的文本场景，比如欢迎语、计数器等。
      - 使用：
      this.add.text(this.centerX, this.centerY, 'Hello, Phaser!', { fontSize: '48px', fill: '#00ff00' });
   
   2. this.make.text(config); 提供更灵活的文本创建方式。它创建一个文本对象但不会自动添加到场景的显示列表中，适合需要更复杂的初始化设置或动态控制的场景
      - 适用场景:
         用于需要在创建文本之前或之后进行更多自定义操作的场景，比如动态控制是否显示、延迟显示等。 
      - 使用：
      const text = this.make.text({
         x: 400,
         y: 300,
         text: 'Custom Text',
         origin: 0.5,
         style: {
            font: '20px Arial',
            fill: '#ff0000',
            align: 'center'
         }
      });

      // 手动控制添加到显示列表
      this.children.add(text);   
      */

      const text = this.make.text({
         x: 400,
         y: 300,
         text: '  The   sky above the port was the color of television, tuned to a dead channel.',
         origin: 0.5, // origin: [0.5, 0.5]
         style: {
            font: 'bold 30px Arial',
            fill: '#58e07c',  //color: '#58e07c'
         }
      });

      // 断言
      this.assert('文字宽度wordWarpWidth应该为空', text.style.wordWarpWidth === null);
      this.assert('高级自动换行属性wordWrapUseAdvanced应该为false', text.style.wordWrapUseAdvanced === false);
      this.assert('换行回调函数wordWrapCallback应该为null', text.style.wordWrapCallback === null);
      this.assert('自动换行回调范围wordWrapCallbackScope应该为null', text.style.wordWrapCallbackScope === null);
      this.assert('换行文本应为一行', text.getWrappedText().length === 1);
      

      {
         //1. 文字宽度换行基本用法(不启用高级换行)：
            /* 会换行--只会简单地根据空格或手动插入的换行符（\n）来处理文本，而不会主动按照宽度限制来自动断行；
               第一行不去除文字前的空格；
               多空格不被折叠； */
         text.setWordWrapWidth(200, false); 

         let lines = text.getWrappedText(); // 获取换行后的每一行文字，返回一个数组
         console.log(lines);

         this.assert('换行文本应该是多行', lines.length > 1);
         this.assert('第一行不应被修剪', lines[0].startsWith(' ')); //lines[0].startsWith(' ')检查第一行是否以空格开头,返回true/false
         this.assert('第一行没有空格折叠', lines[0].includes('The   sky'));   // lines[0].includes('The   sky')检查第一行是否包含该字符串
         // console.log(lines[0], lines[0].length); 

         text.setWordWrapWidth(null); // 禁用换行
      }

      {
         //2. 启用后禁用换行
         text.setWordWrapWidth(200, false); // 设置文字宽度200，不启用高级换行
         text.setWordWrapWidth(null);   // 禁用换行
      }

      {
         //3. 启用高级文字宽度换行: 
          /* 文字会换行--智能地根据 wordWrap.width 的限制计算文本的断行位置；
          第一行会去除文字前的空格；
          第一行多空格会被折叠； */
         text.setWordWrapWidth(200, true); // 设置文字宽度200，启用高级换行
         let lines = text.getWrappedText();
         this.assert('换行文本应该是多行', lines.length > 1);
         this.assert('第一行应该被修剪', !lines[0].startsWith(' '));
         this.assert('第一行多空格会被折叠', lines[0].includes('The sky'));
         text.setWordWrapWidth(null); // 禁用换行
      }

      {
         // 换行回调函数setWordWrapCallback(callback, scope)：自定义文本的换行逻辑，取代 Phaser 内置的 wordWrap，返回数组
         /* 参数1: callback(string, textObject) ,
               - string：要处理的完整文本字符串。
               - textObject：当前的 Phaser.Text 对象。
               回调函数的返回值应该是一个数组，每个数组元素代表一行的文本
            参数2: scope：
               设置回调函数的执行上下文（设置this 的指向）
         */
         text.setWordWrapCallback(function (string, textObject) {
            this.assert('第二个参数应该是文本对象', text === textObject);
            this.assert('范围应与给定范围对象匹配', this.testObject === true);
            
            return [ '12', '34' ]; // 第一行文本 12 第二行文本 34
         }, { testObject: true, assert: this.assert});  // this指向对象{ testObject: true, assert: this.assert}
         
         let lines = text.getWrappedText();
         console.log('lines--', lines); // ['12', '34']
         
         text.setWordWrapCallback(null);  // 清除自定义换行
      }

      {
         // 自定义换行函数回调，返回字符串,使用换行符\n
         text.setWordWrapCallback(() => '122\n34');
         let lines = text.getWrappedText();
         console.log('lines--', lines);  // ['122', '34']

         text.setWordWrapCallback(null);
      }

      {
         // 启用后禁用自定义换行函数回调
         text.setWordWrapCallback(text => text, {testObject: true});
         text.setWordWrapCallback(null);  // 启用后禁用自定义换行函数回调

         let lines = text.getWrappedText();
         console.log('lines--', lines); 
      }

      
   }
   update() {

   }

   // 调试断言
   assert(message, condition) {
      this.totalTests ++;
      if(condition) {
         this.textsPassed ++;
      };
      console.assert(condition, message);
      
   }
};

export default Text_wordWrap;