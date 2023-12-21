<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";
import type { ButtonData } from "./types";

const buttonData: ButtonData = withDefaults(defineProps<ButtonData>(), {
  name: "CommandButton",
  label: "Button",
  top: 0,
  left: 0,
  size: 10,
  command: "test",
  image: "",
});

function executeCommand(): void {
  // ここに渡された引数に対してコマンドを実行する処理を記述する
  // 例えば、buttonData.command()のようにして実行する;
  alert(buttonData.command);
}

const getImageUrl = (name: string) => {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
};
</script>

<template>
  <button
    @click="executeCommand"
    :style="{
      top: buttonData.top + 'px',
      left: buttonData.left + 'px',
      width: buttonData.size + '%',
      height: buttonData.size + '%',
    }"
  >
    <slot name="label">
      <span>{{ buttonData.label }}</span>
    </slot>
    <slot name="image">
      <img
        v-if="
          buttonData.image != null &&
          buttonData.image != '' &&
          buttonData.image != undefined
        "
        :src="getImageUrl(buttonData.image)"
        :style="{}"
      />
    </slot>
  </button>
</template>

<style>
button {
  position: relative;
  display: inline-block;
}
button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>

<style scoped></style>
