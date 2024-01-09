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
</template>

<script lang="ts" setup>
import BasicDialog from "./BasicDialog.vue";
import { ref, inject } from "vue";
import { ActionButton, ActionTypeLabel, AcctionType } from "./ActionButton";
import { APIComunicator } from "./APIComunicator";
import { popScopeId } from "vue";

const basicDialog = ref();

const apis = inject<Array<APIComunicator>>("apis");
if (!apis) throw new Error("No API provided");

const props = defineProps<{
  actionbutton: ActionButton;
}>();

function closeDialog() {
  basicDialog.value.close();
}

function cancel() {
  closeDialog();
}

async function performAction() {
  if (props.actionbutton.actionType === AcctionType.None) closeDialog();

  const api = apis?.find(
    (api) => api.duetAddressWithoutHttp === props.actionbutton.destination
  );
  console.log(api);
  if (!api) {
    console.log("API not found");
    return;
  }

  // Perform the action here
  if (props.actionbutton.actionType === AcctionType.ExecuteFile) {
    // Execute file
    console.log("Execute file: " + props.actionbutton.action);
  } else if (props.actionbutton.actionType === AcctionType.SendGcode) {
    // Send Gcode
    console.log("Send Gcode: " + props.actionbutton.action);
    const res = await api?.sendDuetCommand(props.actionbutton.action);
    console.log("Send Gcode: " + props.actionbutton.action + " res: " + res);
  } else if (
    props.actionbutton.actionType === AcctionType.ExecuteRegisteredMotion
  ) {
    // Send Gcode
    console.log("Send Gcode: " + props.actionbutton.action);
  }

  closeDialog();
}
</script>
