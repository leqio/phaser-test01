/**
 * @description 预加载远程资源
 */
class SceneFilesPayload extends Phaser.Scene {
   constructor() {
      super('sceneFilesPayload' , {
        pack: {
            files: [
                { type: 'image', 
                  key: 'sonic', 
                  url: 'api/assets/sprites/sonic_havok_sanity.png' 
                }
            ]
        }
      })
   }
   preload() {
    this.load.setBaseURL('/api');
    this.load.image('face', 'assets/pics/bw-face.png');
    // this.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
   }
   create() {
    // this.add.image(0, 0, 'face').setOrigin(0);
    this.add.image(0, 0, 'sonic').setOrigin(0);
   }
   update() {

   }
};

export default SceneFilesPayload;