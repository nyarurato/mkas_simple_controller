<template>
  <div class="text-center">
    <slot name="openmethod" v-bind:show="show"></slot>

    <v-dialog v-model="dialog" width="auto" min-width="20vw">
      <v-card>
        <v-card-title>
          <slot name="title"></slot>
        </v-card-title>
        <slot name="content"></slot>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import type { Ref } from "vue";

const dialog: Ref<boolean> = ref(false);

const props = defineComponent({
  name: "BasicDialog",
});

function show(): void {
  dialog.value = true;
}

function close(): void {
  dialog.value = false;
}

defineExpose({
  show,
  close,
});
</script>
