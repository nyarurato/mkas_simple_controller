<template>
  <BasicDialog title="SettingSave" ref="basicDialog">
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
import { PropType, ref } from "vue";
import { ActionButton } from "./ActionButton";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";
import { inject } from "vue";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const basicDialog = ref();

function saveToFile() {
  if (!settingdata) {
    console.log("No setting data");
    return;
  }
  const dataToSave = settingdata;

  const jsonData = JSON.stringify(dataToSave, null, 2);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "settings.json";
  link.click();

  URL.revokeObjectURL(url);
  basicDialog.value.close();
}
</script>
