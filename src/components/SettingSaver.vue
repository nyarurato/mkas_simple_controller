<template>
  <BasicDialog title="SettingSave">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>設定保存</template>
    <template v-slot:content>
      <div>設定を保存しますか？（ダウンロードフォルダに保存されます。）</div>
      <div>
        <v-btn @click="saveToFile" color="success" block>保存</v-btn>
      </div>
    </template>
  </BasicDialog>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { ActionButton } from "./ActionButton";
import BasicDialog from "./BasicDialog.vue";

const props = defineProps({
  actionButtons: {
    type: Array as PropType<ActionButton[]>,
    required: true,
  },
  settings: {
    type: String,
    required: true,
  },
});

function saveToFile() {
  const dataToSave = {
    settings: props.settings,
    actionButtons: props.actionButtons,
  };

  const jsonData = JSON.stringify(dataToSave, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "settings.json";
  link.click();

  URL.revokeObjectURL(url);
}
</script>
