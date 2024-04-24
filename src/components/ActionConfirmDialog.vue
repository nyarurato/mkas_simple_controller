<template>
  <BasicDialog ref="basicDialog">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
    <template v-slot:title>確認</template>
    <template v-slot:content>
      <p>
        以下のアクションを実行します。<br />
        「{{ ActionTypeLabel[props.actionbutton.actionType].title }}」
      </p>
      <p v-if="props.actionbutton.actionType === AcctionType.ExecuteFile">
        {{ props.actionbutton.action }}
      </p>
      <p v-if="props.actionbutton.actionType === AcctionType.SendGcode">
        {{ props.actionbutton.action }}
      </p>

      <p>よろしいですか？</p>

      <v-btn @click="performAction" color="success">OK</v-btn>
      <v-btn @click="cancel" color="warning">Cancel</v-btn>
    </template>
  </BasicDialog>
  <WaitingCircular
    ref="waitingCircular"
    :duration="settingdata.waitingTime"
  ></WaitingCircular>
</template>

<script lang="ts" setup>
import BasicDialog from "./BasicDialog.vue";
import { ref, inject, Ref } from "vue";
import { ActionButton, ActionTypeLabel, AcctionType } from "./ActionButton";
import { APIComunicator } from "./APIComunicator";
import { popScopeId } from "vue";
import { SettingData } from "./SettingData";
import { toast } from "vuetify-sonner";
import WaitingCircular from "./WaitingCircular.vue";

const basicDialog = ref<InstanceType<typeof BasicDialog> | null>(null);
const waitingCircular = ref<InstanceType<typeof WaitingCircular> | null>(null);

const apis = inject<Array<APIComunicator>>("apis");
if (!apis) throw new Error("No API provided");

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const props = defineProps<{
  actionbutton: ActionButton;
}>();

const showLoading = ref(false);

function closeDialog() {
  basicDialog.value?.close();
}

function cancel() {
  closeDialog();
}

async function performAction() {
  if (props.actionbutton.actionType === AcctionType.None) {
    closeDialog();
  }

  if (settingdata?.isUseWaitingAfterCommand) {
    showLoading.value = true;
    waitingCircular.value.open();
  }

  const api = apis?.find(
    (api) => api.duetAddressWithoutHttp === props.actionbutton.destination
  );

  if (!api) {
    console.log("API not found");
    toast.error("接続先が確認できていません", {
      description:
        props.actionbutton.destination + " への接続の確認ができていません<br>",
    });
    closeDialog();
    return;
  }

  // Perform the action here
  if (props.actionbutton.actionType === AcctionType.ExecuteFile) {
    // ファイルを実行
    const command = "M32 " + props.actionbutton.action;
    console.log("Send Gcode: " + command);
    const res = await api?.sendDuetCommand(command);
    console.log("Send Gcode: " + command + " res: " + res);
  } else if (props.actionbutton.actionType === AcctionType.SendGcode) {
    // gcodeを送信
    console.log("Send Gcode: " + props.actionbutton.action);
    const res = await api?.sendDuetCommand(props.actionbutton.action);
    console.log("Send Gcode: " + props.actionbutton.action + " res: " + res);
  } else if (
    props.actionbutton.actionType === AcctionType.ExecuteRegisteredMotion
  ) {
    //登録済みのモーションを実行

    const command =
      "M32 " + settingdata?.executionFolder + settingdata?.executionFileName;
    console.log("Send Gcode: " + command);
    const res = await api?.sendDuetCommand(command);

    // Send Gcode
    console.log("Send Gcode: " + command + " res: " + res);
  }

  closeDialog();
}
</script>
