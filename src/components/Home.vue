<template>
    <!-- <div class="back">
      <button @click="backHomeScene()">返回</button>
    </div> -->
    <!-- canvas容器 -->
    <div id="game-container"></div>
</template>

<script setup>
  import {ref, onMounted, onUnmounted} from 'vue'
  import startGame from '@/game/index.js';

  const game = ref();

 /*  const backHomeScene = () => {
    if (game.value) {
      // console.log('111-', game.value);
      // console.log('222-', game.value.scene.getScenes(true)[0].scene.key);
      const currentScene = game.value.scene.getScene(game.value.scene.getScenes(true)[0].scene.key);
      if (currentScene) {
        console.log('所有scenes--',game.value.scene.scenes.map(scene => scene.scene.key));
        currentScene.scene.start('HomeScene'); 
      }
    }
  } */

  onMounted(() => {
    // 初始化游戏，将canvas加载到容器中
    game.value = startGame('game-container');
  })

  onUnmounted(() => {
    // 销毁游戏实例
    if (game.value) {
        game.value.destroy(true);
        game.value = null;
    }
    
  });

</script>


<style scoped lang="less">

</style>
