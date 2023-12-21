<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";
import type { ButtonData } from "./types";
import CommandButton from "./CommandButton.vue";

const buttons_data: ButtonData[] = [
  { name: "1", label: "Button 1111111111111", top: 100, left: 100 },
  { name: "2", label: "Button 2", top: 200, left: 200 },
  { name: "3", label: "", top: 150, left: 300, image: "79.jpg", size: 20 },
];
</script>

<template>
  <div class="buttons-area">
    <div v-for="bd in buttons_data" :key="bd.label">
      <CommandButton v-bind="bd" />
    </div>
  </div>
</template>

<style>
.buttons-area {
  position: relative;
  border: 1px solid #000;
  width: 70vw;
  height: 70vh;
}
.buttons-area button {
  position: absolute;
}
</style>
