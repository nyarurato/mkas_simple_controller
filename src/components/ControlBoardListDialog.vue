<template>
  <BasicDialog ref="basicDialog">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>制御基板一覧</template>
    <template v-slot:content>
      <v-table>
        <thead>
          <tr>
            <th>番号</th>
            <th>IPアドレス</th>
            <th>ステータス</th>
            <th></th>
            <!-- Empty column for reconnect button -->
            <th></th>
            <!-- Empty column for edit button -->
            <th></th>
            <!-- Empty column for delete button -->
          </tr>
        </thead>
        <tbody>
          <tr v-if="settingdata.controlBoardAddresses.length === 0">
            <td colspan="6" class="text-center">接続先がありません</td>
          </tr>

          <ControlBoardListItem
            v-for="(ipAddress, index) in settingdata.controlBoardAddresses"
            :key="ipAddress"
            :api="apis.find((api) => api.duetAddressWithoutHttp === ipAddress)"
            :ipaddress="ipAddress"
            :index="index"
          ></ControlBoardListItem>
        </tbody>
      </v-table>
      <ControlBoardAddressEditDialog
        :is_edit="false"
        :index="settingdata.controlBoardAddresses.length"
      >
        <template v-slot:openmethod="diag">
          <v-btn @click="diag.show" color="success">接続先追加</v-btn>
        </template>
      </ControlBoardAddressEditDialog>
    </template>
  </BasicDialog>
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";
import { APIComunicator } from "./APIComunicator";
import ControlBoardListItem from "./ControlBoardListItem.vue";
import ControlBoardAddressEditDialog from "./ControlBoardAddressEditDialog.vue";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const apis = inject<Array<APIComunicator>>("apis"); //設定値を取得
if (!apis) throw new Error("No APIComunicator provided");

const basicDialog = ref();

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

function addAddress() {
  if (!settingdata) throw new Error("No SettingDatas provided");
  settingdata.controlBoardAddresses.push("新規追加");
}
</script>
