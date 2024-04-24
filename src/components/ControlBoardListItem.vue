<template>
  <tr>
    <td>
      {{ $props.index }}
    </td>
    <td>{{ ipaddress }}</td>
    <td>
      <v-icon :color="is_connected ? 'green' : 'red'" size="small"
        >mdi-circle</v-icon
      >
      <span>{{ is_connected ? "有効" : "無効" }}</span>
    </td>
    <td>
      <v-btn @click="retryAddress(index)">再接続</v-btn>
    </td>
    <td>
      <ControlBoardAddressEditDialog
        :is_edit="true"
        :ip-address="ipaddress"
        :index="index"
        ><template v-slot:openmethod="diag">
          <v-btn @click="diag.show" color="secondary">編集</v-btn>
        </template>
      </ControlBoardAddressEditDialog>
    </td>
    <td>
      <v-btn @click="deleteAddress(index)" color="red">削除</v-btn>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  ref,
  watch,
  PropType,
  Ref,
  onMounted,
  onUnmounted,
} from "vue";
import { SettingData } from "./SettingData";
import { APIComunicator } from "./APIComunicator";
import ControlBoardAddressEditDialog from "./ControlBoardAddressEditDialog.vue";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const apis = inject<Array<APIComunicator>>("apis"); //設定値を取得
if (!apis) throw new Error("No APIComunicator provided");

const props = defineProps({
  api: {
    type: Object as PropType<APIComunicator>,
    required: false,
  },
  ipaddress: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const api = ref(props.api);
const is_connected = ref(false);

//暫定的に1秒ごとに接続状態を更新
let interval: number | undefined = undefined;
onMounted(() => {
  if (api.value) {
    is_connected.value = api.value.is_connected;
  }

  interval = setInterval(() => {
    if (!api.value) {
      api.value = apis?.find(
        (api) => api.duetAddressWithoutHttp === props.ipaddress
      );
    }
    if (api.value) {
      is_connected.value = api.value.is_connected;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});

function deleteAddress(index: number) {
  if (!settingdata) throw new Error("No SettingDatas provided");
  if (index < 0 || index >= settingdata.controlBoardAddresses.length)
    throw new Error("Invalid index");

  const ipAddress = settingdata.controlBoardAddresses[index];
  const api = apis?.find((api) => api.duetAddressWithoutHttp === ipAddress);

  settingdata.controlBoardAddresses.splice(index, 1);
  if (api) {
    apis?.splice(apis.indexOf(api), 1);
  }
}

async function retryAddress(index: number) {
  if (!settingdata) throw new Error("No SettingDatas provided");
  if (index < 0 || index >= settingdata.controlBoardAddresses.length)
    throw new Error("Invalid index");

  const ipAddress = settingdata.controlBoardAddresses[index];
  const api = apis?.find((api) => api.duetAddressWithoutHttp === ipAddress);

  if (api) {
    api.checkValidAPI(ipAddress);
  } else {
    const _api = new APIComunicator();
    const res = await _api.checkValidAPI(ipAddress);
    if (res) {
      apis?.push(_api);
    }
  }
}
</script>
