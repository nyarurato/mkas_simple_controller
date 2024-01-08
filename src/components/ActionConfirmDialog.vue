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
import { ref } from "vue";
import { ActionButton, ActionTypeLabel, AcctionType } from "./ActionButton";

const basicDialog = ref();

const props = defineProps<{
  actionbutton: ActionButton;
}>();

function closeDialog() {
  basicDialog.value.close();
}

function cancel() {
  closeDialog();
}

function performAction() {
  // Perform the action here
  closeDialog();
}
</script>
