<template>
  <v-navigation-drawer v-model="props.drawer" absolute bottom temporary>
    <v-list nav dense>
      <v-list-subheader>Settings</v-list-subheader>
      <!-- List No.1 -->
      <AddButtonDialog :ipadress="settingdata.controlBoardAddresses">
        <template v-slot:openmethod="diag">
          <v-list-item color="primary" @click="diag.show()">
            <template v-slot:prepend>
              <v-icon>mdi-cursor-default-click</v-icon>
            </template>
            <v-list-item-title>ボタン追加</v-list-item-title>
          </v-list-item>
        </template>
      </AddButtonDialog>

      <!-- List No.2 -->
      <ButtonsListDialog :action-buttons="settingdata.actionButtons">
        <template v-slot:openmethod="diag">
          <v-list-item color="primary" @click="diag.show()">
            <template v-slot:prepend>
              <v-icon>mdi-information-outline</v-icon>
            </template>
            <v-list-item-title>ボタン情報</v-list-item-title>
          </v-list-item>
        </template>
      </ButtonsListDialog>

      <!-- List No.3 -->

      <SettingDialog>
        <template v-slot:openmethod="diag">
          <v-list-item color="primary" @click="diag.show()">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>設定</v-list-item-title>
          </v-list-item>
        </template>
      </SettingDialog>

      <!-- List No.4 -->
      <SettingLoader>
        <template v-slot:openmethod="diag">
          <v-list-item color="primary" @click="diag.show()">
            <template v-slot:prepend>
              <v-icon>mdi-file-import-outline</v-icon>
            </template>
            <v-list-item-title>データ読込</v-list-item-title>
          </v-list-item>
        </template>
      </SettingLoader>

      <!-- List No.5 -->
      <SettingSaver
        :action-buttons="settingdata.actionButtons"
        :settings="'aaa'"
      >
        <template v-slot:openmethod="diag">
          <v-list-item color="primary" @click="diag.show()">
            <template v-slot:prepend>
              <v-icon>mdi-content-save</v-icon>
            </template>
            <v-list-item-title>データ保存</v-list-item-title>
          </v-list-item>
        </template>
      </SettingSaver>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref, inject } from "vue";
import type { Ref } from "vue";
import AddButtonDialog from "@/components/AddButtonDialog.vue";
import SettingDialog from "./SettingDialog.vue";
import BasicDialog from "./BasicDialog.vue";
import ButtonsListDialog from "./ButtonsListDialog.vue";
import SettingSaver from "./SettingSaver.vue";
import SettingLoader from "./SettingLoader.vue";
import { ActionButton } from "./ActionButton";
import { SettingData } from "./SettingData";

const settingdata = inject<SettingData>("settingDatas"); //設定値を取得
if (!settingdata) throw new Error("No SettingDatas provided");

const props = defineProps<{
  drawer: boolean;
}>();
</script>
