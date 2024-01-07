<template>
  <BasicDialog>
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>ボタン一覧</template>
    <template v-slot:content>
      <v-table>
        <thead>
          <tr>
            <th>色</th>
            <th>名前</th>
            <th>座標</th>
            <th>アクション</th>
            <th></th>
            <!-- Empty column for edit button -->
            <th></th>
            <!-- Empty column for delete button -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="button in settingdata.actionButtons" :key="button.label">
            <td>
              <v-icon :color="button.color">mdi-circle</v-icon>
            </td>
            <td>{{ button.label }}</td>
            <td>( {{ button.x }} , {{ button.y }} )</td>
            <td>{{ button.actionType }}</td>
            <td>
              <v-btn @click="editButton(button)" color="green">編集</v-btn>
            </td>
            <td>
              <v-btn @click="deleteButton(button)" color="red">削除</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </BasicDialog>
</template>

<script lang="ts" setup>
import { PropType, inject } from "vue";
import { ActionButton } from "./ActionButton";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

function editButton(button: ActionButton) {
  // Handle edit button click
}
function deleteButton(button: ActionButton) {
  // Handle delete button click
}
</script>
