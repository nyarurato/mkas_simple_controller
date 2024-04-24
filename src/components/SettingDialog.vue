<template>
  <BasicDialog ref="basicDialog">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>設定</template>
    <template v-slot:content>
      <v-form>
        <v-row>
          <!--1列目-->
          <v-col>
            <div class="text-subtitle-1">制御基板設定</div>
            <v-select
              label="制御基板アドレス"
              :items="settingdata.controlBoardAddresses.concat(['新規追加'])"
              v-model="selectedAddress"
            >
            </v-select>
            <v-text-field
              v-if="selectedAddress === '新規追加'"
              type="text"
              id="ipAddress"
              v-model="ipAddress"
              label="新規制御基板アドレス"
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
          </v-col>
          <!--2列目-->
          <v-col>
            <div class="text-subtitle-1">制御基板実行設定</div>
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
          </v-col>
          <!--3列目-->
          <v-col>
            <div class="text-subtitle-1">その他</div>
            <v-switch
              label="実行後待機有効化"
              v-model="is_use_wating_after_command"
              color="primary"
            ></v-switch>
            <v-text-field
              v-if="is_use_wating_after_command"
              type="number"
              id="waitingTime"
              v-model="waitingTime"
              label="再実行禁止時間(秒)"
            />
          </v-col>
          <v-btn @click="saveSettings" color="primary" block>保存</v-btn>
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

const selectedAddress = ref("");
const ipAddress = ref("kas.local");
const executableFileName = ref("program.nc");
const executionFolder = ref("0://gcodes/mkas/");
const is_valid_ipaddress = ref(false);
const basicDialog = ref();
const is_use_wating_after_command = ref(false);
const waitingTime = ref(5);

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
  if (selectedAddress.value != "新規追加") {
    //新規追加でない場合
    ipAddress.value = selectedAddress.value;
  }

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

  //アドレス有効かつ設定値にない場合一覧に追加
  if (
    is_valid_ipaddress.value &&
    !settingdata?.controlBoardAddresses.includes(ipAddress.value)
  ) {
    settingdata?.setControlBoardAddresses(ipAddress.value);
  }
}

function saveSettings() {
  // Save settings here
  if (settingdata) {
    settingdata.executionFileName = executableFileName.value;
    settingdata.executionFolder = executionFolder.value;
    settingdata.isUseWaitingAfterCommand = is_use_wating_after_command.value;
    settingdata.waitingTime = waitingTime.value;
  }
  basicDialog.value.close();
}
</script>
