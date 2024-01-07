<template>
  <v-container>
    <v-row class="text-center">
      <v-app-bar color="orange">
        <v-app-bar-nav-icon
          @click.stop="drawer2 = !drawer2"
        ></v-app-bar-nav-icon>

        <v-app-bar-title class="align-items-center"
          ><v-img
            :src="mkas_icon"
            height="1.7rem"
            max-width="1.7rem"
            class="d-inline-flex align-items-center mr-2"
          />
          MKA Simple Controller</v-app-bar-title
        >
        <template v-slot:append>
          <v-btn icon href="https://github.com/nyarurato"
            ><!-- temporary link -->
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
      </v-app-bar>
      <slide-menu :drawer="drawer2"></slide-menu>
      <ButtonsView />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
import type { Ref } from "vue";
import SlideMenu from "../components/SlideMenu.vue";
import ButtonsView from "@/components/ButtonsView.vue";
import { provide } from "vue";
import { SettingData } from "../components/SettingData";
import { ActionButton } from "../components/ActionButton";

const settingDatas = reactive(new SettingData());
const sample_action_button = new ActionButton(
  "111",
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
  "111",
  "Sample2",
  500,
  100,
  0,
  false,
  false
);

settingDatas.actionButtons.push(sample_action_button2);

provide("settingDatas", settingDatas); //設定値を共有するためのprovide

// Logo
import mkas_icon from "../assets/mkas_icon.svg";
import { reactive } from "vue";

const drawer2: Ref<boolean> = ref(false);

const props = defineComponent({
  name: "About-2",
  //drawer2,
});
</script>
