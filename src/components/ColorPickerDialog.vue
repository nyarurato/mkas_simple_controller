<template>
  <div class="d-flex">
    <div :style="swatchStyle()"></div>
    <v-btn @click="openDialog">色選択</v-btn>
  </div>
  <v-menu v-model="dialogOpen" :close-on-content-click="false">
    <v-card>
      <v-color-picker
        v-model="selectedColor"
        mode="rgb"
        flat
        show-swatches
      ></v-color-picker>
      <v-btn @click="confirmColor">決定</v-btn>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, ref, defineEmits } from "vue";

const dialogOpen = ref(false);
const menu = ref(false);

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
});

const selectedColor = computed({
  get: () => props.color,
  set: (newColor) => emit("update:color", newColor),
});

const emit = defineEmits(["update:color"]);

function openDialog() {
  menu.value = true;
  dialogOpen.value = true;
}
function closeDialog() {
  menu.value = false;
  dialogOpen.value = false;
}
function confirmColor() {
  // Do something with the selected color
  emit("update:color", selectedColor.value);
  closeDialog();
}

function swatchStyle() {
  return {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "1px solid #ccc",
    background: selectedColor.value,
  };
}
</script>
