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
            <td>{{ ActionTypeLabel[button.actionType].title }}</td>
            <td>
              <EditButtonDialog :_button="button">
                <template v-slot:openmethod="diag">
                  <v-btn @click="diag.show" color="green">編集</v-btn>
                </template>
              </EditButtonDialog>
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
import { PropType, inject, ref } from "vue";
import { ActionButton, ActionTypeLabel } from "./ActionButton";
import BasicDialog from "./BasicDialog.vue";
import { SettingData } from "./SettingData";
import BasicButtonDialog from "./BasicButtonDialog.vue";
import EditButtonDialog from "./EditButtonDialog.vue";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

function deleteButton(button: ActionButton) {
  if (!settingdata) throw new Error("No SettingDatas provided");
  // Remove the button object from settingdata.actionButtons
  const index = settingdata.actionButtons.indexOf(button);
  if (index > -1) {
    settingdata.actionButtons.splice(index, 1);
  }
}
</script>
