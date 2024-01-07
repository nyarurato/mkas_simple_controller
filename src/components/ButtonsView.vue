<template>
  <div>
    <v-btn
      v-for="(button, index) in settingdata.actionButtons"
      :key="index"
      :style="{ top: button.y + 'px', left: button.x + 'px' }"
      :color="button.color"
      class="button"
    >
      {{ button.label }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ActionButton } from "@/components/ActionButton";
import { ref, inject } from "vue";
import { SettingData } from "./SettingData";

const settingdata = inject<SettingData>("settingDatas");
if (!settingdata) throw new Error("No SettingDatas provided");

function decodeImageBase64(imageBase64: string): string {
  // Decode image_base64 here
  // Return the decoded image URL
  const decodedImageURL = imageBase64;
  return decodedImageURL;
}
</script>

<style scoped>
.button {
  position: absolute;
  /*height: auto;
  min-height: auto;*/
}
</style>
