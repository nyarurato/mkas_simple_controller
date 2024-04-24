<template>
  <BasicDialog ref="basicDialog">
    <template v-slot:openmethod="diag">
      <slot
        name="openmethod"
        v-bind:show="
          () => {
            diag.show();
            reset_param();
          }
        "
      ></slot>
    </template>
    <template v-slot:title>{{ dialog_title }}</template>
    <template v-slot:content>
      <v-form @submit.prevent>
        <v-row>
          <v-col>
            <v-text-field
              v-model="ipadress"
              label="制御基板アドレス"
              hint="例:192.168.0.56, kas.localなど"
              placeholder="192.168.0.56"
              :rules="[(value:string)=>ipaddressrule(value)]"
              type="text"
              clearable
            />
          </v-col>
        </v-row>
        <v-btn @click="confirmButton" color="primary" block>保存</v-btn>
      </v-form>
    </template>
  </BasicDialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import type { Ref } from "vue";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";
import { onMounted } from "vue";
import { APIComunicator } from "./APIComunicator";

const props = defineProps({
  ipAddress: {
    type: String,
    required: false,
  },
  index: {
    type: Number,
    required: true,
  },
  is_edit: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const dialog_title = props.is_edit
  ? "制御基板アドレス編集"
  : "制御基板アドレス追加";

const ipadress = ref("");
const is_valid_ipaddress = ref(false);

const basicDialog = ref();

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const apis = inject<Array<APIComunicator>>("apis"); //設定値を取得
if (!apis) throw new Error("No APIComunicator provided");

const address_pattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$)|(\w+\.local$)/;

//initialize value
reset_param();

function reset_param() {
  if (props.is_edit && props.ipAddress) {
    //編集のためのリセット
    ipadress.value = props.ipAddress;
  } else {
    //新規のボタンのためのリセット
    ipadress.value = "";
  }
}

function closeDialog() {
  // Handle close dialog logic here
  if (basicDialog.value) basicDialog.value.close();
}

function ipaddressrule(value: string): boolean | string {
  if (!value) return "IPアドレスを入力してください";
  else if (!address_pattern.test(value))
    return "IPアドレスの形式が正しくありません";
  else return true;
}

function confirmButton() {
  if (ipadress.value === "") {
    return;
  }

  if (!ipadress.value.match(address_pattern)) {
    return;
  }

  if (props.is_edit && props.ipAddress) {
    editIpAddress(props.ipAddress);
  } else AddIpAddress();
}

function AddIpAddress() {
  // Handle add ip address logic here
  if (settingdata) {
    settingdata.controlBoardAddresses.push(ipadress.value);
    checkConnection();
  }
  closeDialog();
}

async function editIpAddress(ipAddress: string) {
  // Handle edit ip address logic here
  if (settingdata) {
    if (props.index >= 0) {
      const old_ipaddress = settingdata.controlBoardAddresses[props.index];
      settingdata.controlBoardAddresses[props.index] = ipadress.value;

      if (apis) {
        const _api = apis.find(
          (api) => api.duetAddressWithoutHttp === old_ipaddress
        );

        if (_api) {
          const res = await _api.checkValidAPI(ipadress.value);
          if (!res) {
            apis.splice(apis.indexOf(_api), 1);
          }
        } else {
          const api = new APIComunicator();
          const res = await api.checkValidAPI(ipadress.value);
          if (res) apis.push(api);
        }
      }
    }
  }
  closeDialog();
}

async function checkConnection() {
  if (apis) {
    //apisにipaddressのapiがあるかどうか
    const _api = apis.find(
      (api) => api.duetAddressWithoutHttp === ipadress.value
    );

    if (_api) {
      //あれば、そのapiを使う
      is_valid_ipaddress.value = await _api.checkValidAPI(ipadress.value);
    } else {
      //なければ、新しくapiを作る
      const api = new APIComunicator();
      is_valid_ipaddress.value = await api?.checkValidAPI(ipadress.value);
      if (is_valid_ipaddress.value) apis.push(api);
    }
  }

  //アドレス有効かつ設定値にない場合一覧に追加
  if (
    is_valid_ipaddress.value &&
    !settingdata?.controlBoardAddresses.includes(ipadress.value)
  ) {
    settingdata?.setControlBoardAddresses(ipadress.value);
  }
}
</script>
