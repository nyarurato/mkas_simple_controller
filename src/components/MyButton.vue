<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";
import { onMounted, onUnmounted } from "vue";

const name = "MyButton";
const message: Ref<string> = ref("Hello World!");

const props = defineProps({
  msg: String,
});

setInterval(() => {
  message.value = "Hello World!" + new Date().toLocaleTimeString();
}, 1000);

function is_red(): boolean {
  //ローカル時間の秒が偶数ならtrue
  return new Date().getSeconds() % 2 == 0;
}

interface ButtonState {
  name: string;
  message: string;
  color: Array<number>;
}

function OnButton(): void {
  const state: ButtonState = reactive({
    name: "MyButton",
    message: "Hello World!",
    color: [255, 0, 0],
  });
  console.log(state.name);
  //msgを表示
  alert(props.msg);
}

onMounted(() => {
  console.log("mounted");
});

onUnmounted(() => {
  console.log("unmounted");
});
</script>

<template>
  <button v-bind:class="{ red: is_red() }" @click="OnButton">MyButton</button>
  <h2 v-bind:title="name">{{ message }} {{ is_red() }}</h2>
</template>

<style>
.red {
  color: red;
}
</style>
