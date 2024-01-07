<template>
  <BasicDialog title="SettingLoad">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>設定読込</template>
    <template v-slot:content>
      <div>
        <v-file-input
          label="設定ファイル(settings.json)"
          accept=".json"
          v-model="setting_file"
        />
        <v-btn @click="handleFileChange" block color="primary">読込</v-btn>
      </div>
    </template>
  </BasicDialog>
</template>

<script lang="ts" setup>
import { defineProps, ref, PropType } from "vue";
import ActionButton from "./ActionButton.vue";
import BasicDialog from "./BasicDialog.vue";

const setting_file = ref(Array<File>());

function handleFileChange() {
  const file = setting_file.value[0];
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const setting = JSON.parse(reader.result as string);
    } catch (error) {
      console.error("Failed to parse JSON file:", error);
    }
  };
  reader.readAsText(file);
}
</script>
