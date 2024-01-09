<template>
  <BasicDialog ref="basicDialog">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>設定</template>
    <template v-slot:content>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field
              type="text"
              id="ipAddress"
              v-model="ipAddress"
              label="制御基板アドレス"
            />

            <v-chip>
              <span v-if="is_valid_ipaddress"
                ><v-icon color="green">mdi-check-bold</v-icon>有効確認済み</span
              >
              <span v-if="!is_valid_ipaddress"
                ><v-icon color="red">mdi-alert-circle</v-icon>未確認</span
              >
            </v-chip>

            <v-btn @click="checkConnection">追加/確認</v-btn>

            <v-text-field
              type="text"
              id="executionFolder"
              v-model="executionFolder"
              label="実行フォルダ"
            />
            <v-text-field
              type="text"
              id="executableFileName"
              v-model="executableFileName"
              label="実行ファイル名"
            />
            <v-btn @click="saveSettings" color="primary" block>保存</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </BasicDialog>
</template>

<script lang="ts" setup>
import BasicDialog from "./BasicDialog.vue";
import { ref, inject, watch } from "vue";
import { SettingData } from "./SettingData";
import { APIComunicator } from "./APIComunicator";

const ipAddress = ref("kas.local");
const executableFileName = ref("program.nc");
const executionFolder = ref("0://gcodes/mkas/");
const is_valid_ipaddress = ref(false);
const basicDialog = ref();

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const apis = inject<Array<APIComunicator>>("apis"); //設定値を取得
if (!apis) throw new Error("No APIComunicator provided");

// Initialize the values
executableFileName.value = settingdata.executionFileName;
executionFolder.value = settingdata.executionFolder;
if (settingdata.controlBoardAddresses.length > 0)
  ipAddress.value = settingdata.controlBoardAddresses[0];

watch(settingdata, () => {
  executableFileName.value = settingdata.executionFileName;
  executionFolder.value = settingdata.executionFolder;
});

async function checkConnection() {
  // Perform connection check logic here
  console.log(settingdata);
  if (apis) {
    //apisにipaddressのapiがあるかどうか
    const _api = apis.find(
      (api) => api.duetAddressWithoutHttp === ipAddress.value
    );

    if (_api) {
      //あれば、そのapiを使う
      is_valid_ipaddress.value = await _api.checkValidAPI(ipAddress.value);
    } else {
      //なければ、新しくapiを作る
      const api = new APIComunicator();
      is_valid_ipaddress.value = await api?.checkValidAPI(ipAddress.value);
      if (is_valid_ipaddress.value) apis.push(api);
    }
  }
  //追加
  if (is_valid_ipaddress.value) {
    settingdata?.setControlBoardAddresses(ipAddress.value);
  }
}

function saveSettings() {
  // Save settings here
  if (settingdata) {
    settingdata.executionFileName = executableFileName.value;
    settingdata.executionFolder = executionFolder.value;
  }
  basicDialog.value.close();
}
</script>
