<template>
  <BasicDialog>
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>ボタン追加</template>
    <template v-slot:content>
      <v-form>
        <v-row>
          <v-col>
            <v-text-field type="text" label="タイトル" v-model="buttontitle" />
            <v-switch
              label="ボタン画像有効化"
              primary
              v-model="is_image"
            ></v-switch>
            <v-file-input
              label="ボタン画像"
              clearable
              chips
              accept="image/*"
              :disabled="!is_image"
            ></v-file-input>
            <ColorPickerDialog v-model:color="btcolor"></ColorPickerDialog>
          </v-col>
          <v-col>
            <v-text-field type="number" label="X座標" v-model="xCoordinate" />

            <v-text-field type="number" label="Y座標" v-model="yCoordinate" />
          </v-col>
          <!-- 2列目 -->
          <v-col>
            <v-select
              label="送信先"
              :items="ipadress"
              v-model="button_ipaddress"
            ></v-select>
            <v-select
              v-model="selected_action"
              label="アクション"
              :items="action_index"
            ></v-select>
            <div v-if="selected_action === 2">
              <v-text-field type="text" label="ファイル名" />
            </div>
            <div v-if="selected_action === 3">
              <v-textarea clearable rows="2" label="Gコード" />
            </div>
          </v-col>
        </v-row>
        <v-btn @click="makeButton" color="primary" block>保存</v-btn>
      </v-form>
    </template>
  </BasicDialog>
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref, inject } from "vue";
import type { Ref } from "vue";
import BasicDialog from "./BasicDialog.vue";
import ColorPickerDialog from "./ColorPickerDialog.vue";
import { ActionButton, AcctionType } from "./ActionButton";
import { SettingData } from "./SettingData";

const newButton = new ActionButton();

const dialogTitle = "Position Dialog";
const xCoordinate = ref(0);
const yCoordinate = ref(0);
const buttontitle = ref("Button");
const gcode = ref("");
const is_image = ref(false);
const selected_action = ref(0);
const button_ipaddress = ref("");
const btcolor = ref("#ff0000");

const action_index = [
  { value: 0, title: "何もしない" },
  { value: 1, title: "登録モーション実行" },
  { value: 2, title: "ファイル実行" },
  { value: 3, title: "Gコード送信" },
];

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const ipadress = settingdata.controlBoardAddresses;

//initialize value
xCoordinate.value = newButton.x;
yCoordinate.value = newButton.y;
btcolor.value = newButton.color;
button_ipaddress.value = ipadress[0] ?? "";
selected_action.value = newButton.actionType;
buttontitle.value = newButton.label;

function closeDialog() {
  // Handle close dialog logic here
}
function makeButton() {
  const selected_action_index = selected_action.value;

  const button = new ActionButton(
    button_ipaddress.value,
    buttontitle.value,
    xCoordinate.value,
    yCoordinate.value,
    selected_action_index as (typeof AcctionType)[keyof typeof AcctionType],
    false,
    false
  );
  button.color = btcolor.value;
  settingdata?.actionButtons.push(button);
  closeDialog();
}
</script>
