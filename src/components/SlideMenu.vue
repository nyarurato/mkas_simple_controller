<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";
import SlideMenuButtonAdder from "./SlideMenuButtonAdder.vue";

const drawFlag: Ref<boolean> = ref(false);

function OpenMenu(): void {
  drawFlag.value = !drawFlag.value;
}
</script>

<template>
  <nav>
    <div>
      <button @click="OpenMenu">ボタン</button>
    </div>
    <transition name="left">
      <div v-if="drawFlag" class="drawer-menu-wrapper">
        <div class="drawer-menu">
          <!-- ここにメニューの内容を書いていく -->
          <h1>メニュー</h1>
          <SlideMenuButtonAdder name="ボタンを追加" />
          <button @click="drawFlag = false">閉じる</button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style>
.right-enter-active,
.right-leave-active {
  transform: translate(0px, 0px);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}
.right-enter,
.right-leave-to {
  transform: translateX(100vw) translateX(0px);
}

.left-leave-active {
  transform: translate(0px, 0px);
  transition: transform 500ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.left-enter-active {
  transform: translate(-100vw, 0px);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.left-enter,
.left-leave-to {
  transform: translateX(-100vw) translateX(0px);
}
.left-enter-to,
.left-leave {
  transform: translateX(0vw) translateX(0px);
}

.drawer-menu-wrapper {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  width: 30vw;
  height: 100%;
}
.drawer-menu {
  padding: 24px;
  background-color: aqua;
}
</style>
