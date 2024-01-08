<template>
  <div>
    <ActionConfirmDialog
      v-for="(button, index) in settingdata.actionButtons"
      :key="index"
      :actionbutton="button"
      ><template v-slot:openmethod="diag">
        <v-btn
          :style="{
            top: button.y + 100 + 'px',
            left: button.x + 40 + 'px',
          }"
          :color="button.color"
          class="button"
          @click="diag.show()"
        >
          {{ button.label }}
        </v-btn></template
      >
    </ActionConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ActionButton } from "@/components/ActionButton";
import { ref, inject } from "vue";
import { SettingData } from "./SettingData";
import ActionConfirmDialog from "./ActionConfirmDialog.vue";

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
