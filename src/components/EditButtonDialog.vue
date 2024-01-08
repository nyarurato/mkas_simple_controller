<template>
  <BasicButtonDialog :is_edit="true" :_button="props._button">
    <template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot>
    </template>
  </BasicButtonDialog>
</template>

<script lang="ts" setup>
import BasicButtonDialog from "./BasicButtonDialog.vue";
import { ActionButton } from "./ActionButton";
import { SettingData } from "./SettingData";
import { inject } from "vue";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const props = defineProps<{
  _button: ActionButton;
}>();
</script>
