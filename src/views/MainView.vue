<template>
  <v-container>
    <v-row class="text-center">
      <v-app-bar color="orange">
        <template v-slot:prepend>
          <v-app-bar-nav-icon
            @click.stop="drawer2 = !drawer2"
          ></v-app-bar-nav-icon>
          <v-spacer />
          <StatusView
            v-for="(api, id) in apis"
            :api="api"
            :key="id"
          ></StatusView>
        </template>

        <v-app-bar-title class="align-items-center">
          <!--
          <v-img
            :src="mkas_icon"
            height="1.7rem"
            max-width="1.7rem"
            class="d-inline-flex align-items-center mr-2"
          />
          -->
          <v-icon :icon="MkasIcon" color="#2b2b2b" size="large"></v-icon>
          MKA Simple Controller</v-app-bar-title
        >
        <template v-slot:append>
          <v-btn icon href="https://github.com/nyarurato/mkas_simple_controller"
            ><!-- temporary link -->
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
      </v-app-bar>
      <slide-menu :drawer="drawer2"></slide-menu>
      <ButtonsView />
      <VSonner :duration="5000" expand position="bottom-right" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineComponent, ref, reactive } from "vue";
import type { Ref } from "vue";
import SlideMenu from "../components/SlideMenu.vue";
import ButtonsView from "@/components/ButtonsView.vue";
import { provide } from "vue";
import { SettingData } from "../components/SettingData";
import { ActionButton } from "../components/ActionButton";
import { APIComunicator } from "../components/APIComunicator";
import { VSonner } from "vuetify-sonner";
import StatusView from "@/components/StatusView.vue";
import MkasIcon from "@/components/MkasIcon.vue";

const settingDatas = reactive(new SettingData());
const sample_action_button = new ActionButton(
  "kas.local",
  "Sample",
  300,
  100,
  0,
  false,
  false
);
sample_action_button.color = "#ff0000";

settingDatas.actionButtons.push(sample_action_button);

const sample_action_button2 = new ActionButton(
  "kas.local",
  "Sample2",
  500,
  100,
  0,
  false,
  false
);

settingDatas.actionButtons.push(sample_action_button2);

provide("settingDatas", settingDatas); //設定値を共有するためのprovide

const drawer2 = ref(false);

provide("drawer", drawer2); //設定値を共有するためのprovide

const apis = new Array<APIComunicator>();

provide("apis", apis); //設定値を共有するためのprovide

const props = defineComponent({
  name: "About-2",
});
</script>
