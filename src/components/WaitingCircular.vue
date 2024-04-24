<template>
  <v-overlay
    :model-value="is_show"
    :persistent="true"
    class="align-center justify-center"
  >
    <v-progress-circular
      v-if="is_show"
      :size="size"
      :width="width"
      :color="color"
      indeterminate
    >
      <template v-slot:default>Wait {{ duration }} s </template>
    </v-progress-circular>
  </v-overlay>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  duration: number;
}>();

const is_show = ref(false);
const size = ref(100);
const width = ref(10);
const color = "primary";

let timer: number | null = null;

function open() {
  is_show.value = true;
  console.log("open");
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    is_show.value = false;
    timer = null;
  }, props.duration * 1000);
}

function close() {
  is_show.value = false;
  if (timer) clearTimeout(timer);
  timer = null;
}

defineExpose({
  open,
  close,
});
</script>
