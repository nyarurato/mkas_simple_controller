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
      <v-form>
        <v-row>
          <v-col>
            <v-text-field type="text" label="タイトル" v-model="buttontitle" />
            <v-switch
              label="ボタン画像有効化"
              v-model="is_image"
              color="primary"
            ></v-switch>
            <v-file-input
              label="ボタン画像"
              clearable
              chips
              accept="image/*"
              :disabled="!is_image"
              v-model="imgfile"
            ></v-file-input>
            <ColorPickerDialog v-model:color="btcolor"></ColorPickerDialog>
          </v-col>
          <!-- 2列目 -->
          <v-col>
            <v-text-field
              type="number"
              label="ボタンX座標"
              v-model.number="xCoordinate"
            />

            <v-text-field
              type="number"
              label="ボタンY座標"
              v-model.number="yCoordinate"
            />
            <v-switch
              label="サイズ変更有効化"
              v-model="is_use_size"
              color="primary"
            ></v-switch>
            <div v-if="is_use_size">
              <v-text-field
                type="number"
                label="ボタンサイズX"
                v-model.number="button_size_x"
              />

              <v-text-field
                type="number"
                label="ボタンサイズY"
                v-model.number="button_size_y"
              />
            </div>
          </v-col>
          <!-- 3列目 -->
          <v-col>
            <v-select
              label="送信先"
              :items="ipadress"
              v-model="button_ipaddress"
              :item="ipadress"
            ></v-select>
            <v-select
              v-model="selected_action"
              label="アクション"
              :items="ActionTypeLabel"
            ></v-select>
            <div v-if="selected_action === 2">
              <v-text-field
                type="text"
                label="ファイル名(例:0://gcodes/...)"
                v-model="file_name"
              />
            </div>
            <div v-if="selected_action === 3">
              <v-textarea clearable rows="2" label="Gコード" v-model="gcode" />
            </div>
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
import ColorPickerDialog from "./ColorPickerDialog.vue";
import { ActionButton, AcctionType, ActionTypeLabel } from "./ActionButton";
import { SettingData } from "./SettingData";
import { onMounted } from "vue";

const props = defineProps({
  _button: {
    type: ActionButton,
    required: false,
  },
  is_edit: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const newButton = new ActionButton();

const dialog_title = props.is_edit ? "ボタン編集" : "ボタン追加";

const xCoordinate = ref(0);
const yCoordinate = ref(0);
const buttontitle = ref("Button");
const gcode = ref("");
const file_name = ref("");
const imgfile = ref(Array<File>());
const is_image = ref(false);
const is_use_size = ref(false);
const button_size_x = ref(0);
const button_size_y = ref(0);
const selected_action = ref(0);
const button_ipaddress = ref("");
const btcolor = ref("#ff0000");
const ipadress = ref([""]);

const basicDialog = ref();

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

//initialize value
reset_param();

function reset_param() {
  if (props.is_edit && props._button) {
    //編集のためのリセット
    xCoordinate.value = props._button.x;
    yCoordinate.value = props._button.y;
    buttontitle.value = props._button.label;
    btcolor.value = props._button.color;
    selected_action.value = props._button.actionType;
    button_ipaddress.value = props._button.destination;
    is_image.value = props._button.is_use_image;
    is_use_size.value = props._button.is_use_size;
    button_size_x.value = props._button.size[0];
    button_size_y.value = props._button.size[1];
    imgfile.value = Array<File>();
    if (props._button.actionType === AcctionType.None) {
      file_name.value = "";
      gcode.value = "";
    } else if (props._button.actionType === AcctionType.ExecuteFile) {
      file_name.value = props._button.action;
    } else if (props._button.actionType === AcctionType.SendGcode) {
      gcode.value = props._button.action;
    } else file_name.value = "";
  } else {
    //新規のボタンのためのリセット
    xCoordinate.value = newButton.x;
    yCoordinate.value = newButton.y;
    btcolor.value = newButton.color;
    button_ipaddress.value = ipadress.value[0] ?? "";
    selected_action.value = newButton.actionType;
    buttontitle.value = newButton.label;
    is_image.value = newButton.is_use_image;
    is_use_size.value = newButton.is_use_size;
    button_size_x.value = newButton.size[0];
    button_size_y.value = newButton.size[1];
    imgfile.value = Array<File>();
    file_name.value = "";
    gcode.value = "";
  }
  if (settingdata) ipadress.value = settingdata.controlBoardAddresses;
}

function closeDialog() {
  // Handle close dialog logic here
  basicDialog.value.close();
}

function confirmButton() {
  if (props.is_edit && props._button) {
    editButton(props._button);
  } else makeButton();
}

async function makeButton() {
  const selected_action_index = selected_action.value;

  const button = new ActionButton(
    button_ipaddress.value,
    buttontitle.value,
    xCoordinate.value,
    yCoordinate.value,
    [button_size_x.value, button_size_y.value],
    is_use_size.value,
    selected_action_index as (typeof AcctionType)[keyof typeof AcctionType],
    is_image.value,
    false
  );
  button.color = btcolor.value;

  if (selected_action_index === AcctionType.ExecuteFile)
    button.action = file_name.value;
  else if (selected_action_index === AcctionType.SendGcode)
    button.action = gcode.value;
  else button.action = "";

  if (is_image.value) await button.set_image_from_file(imgfile.value[0]);

  settingdata?.actionButtons.push(button);
  closeDialog();
}

function editButton(button: ActionButton) {
  settingdata?.actionButtons.filter(async (item) => {
    if (item === button) {
      item.x = xCoordinate.value;
      item.y = yCoordinate.value;
      item.label = buttontitle.value;
      item.color = btcolor.value;
      item.actionType =
        selected_action.value as (typeof AcctionType)[keyof typeof AcctionType];

      if (item.actionType === AcctionType.ExecuteFile)
        item.action = file_name.value;
      else if (item.actionType === AcctionType.SendGcode)
        item.action = gcode.value;
      else button.action = "";

      item.destination = button_ipaddress.value;
      item.size = [button_size_x.value, button_size_y.value];
      item.is_use_size = is_use_size.value;
      item.is_use_image = is_image.value;

      if (is_image.value && imgfile.value.length > 0) {
        await item.set_image_from_file(imgfile.value[0]);
      } else if (!is_image.value) {
        item.image_base64 = "";
      }
    }
  });

  closeDialog();
}
</script>
