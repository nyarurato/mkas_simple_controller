<template>
  <BasicDialog title="SettingLoad" ref="basicDialog">
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
import { ref, inject } from "vue";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";
import { APIComunicator } from "./APIComunicator";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const apis = inject<Array<APIComunicator>>("apis"); //設定値を取得
if (!apis) throw new Error("No APIComunicator provided");

const setting_file = ref(Array<File>());
const basicDialog = ref();

async function handleFileChange() {
  if (setting_file.value.length === 0) {
    console.log("No file");
    return;
  }
  const file = setting_file.value[0];

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const setting = JSON.parse(reader.result as string) as SettingData;
      if (settingdata) {
        settingdata.paste_param(setting);
        for (const address of setting.controlBoardAddresses) {
          makenewAPIs(address).then((api) => {
            if (api) {
              apis?.push(api);
            }
          });
        }
      }
    } catch (error) {
      console.error("Failed to parse JSON file:", error);
    }
  };
  reader.readAsText(file);
  basicDialog.value.close();
}

async function makenewAPIs(ipAddress: string) {
  if (!apis) throw new Error("No APIComunicator provided");

  const _api = apis.find((api) => api.duetAddressWithoutHttp === ipAddress);
  let result = false;
  if (_api) {
    return null; //すでにAPIがあるので何もしない
  } else {
    const api = new APIComunicator();
    result = await api.checkValidAPI(ipAddress);
    if (result) {
      return api;
    } else {
      return null;
    }
  }
}
</script>
