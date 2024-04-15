<template>
  <div>
    <ActionConfirmDialog
      v-for="(button, index) in settingdata.actionButtons"
      :key="index"
      :actionbutton="button"
    >
      <template v-slot:openmethod="diag">
        <v-btn
          :style="{
            top: button.y + 100 + 'px',
            left: button.x + 40 + 'px',
            width: button.is_use_size ? button.size[0] + 'px' : 'auto',
            height: button.is_use_size
              ? button.size[1] + 'px'
              : button.is_use_image
              ? 'auto'
              : 'calc(var(--v-btn-height) + 0px)',
          }"
          :color="button.color"
          class="button"
          :class="button.is_use_image ? 'button-image' : ''"
          @click="diag.show()"
          :stacked="button.is_use_image"
        >
          <v-img
            v-if="button.is_use_image"
            :src="button.image_base64"
            :height="button.is_use_size ? 'auto' : '100px'"
            :width="button.is_use_size ? 'auto' : '100px'"
          ></v-img>
          <v-icon v-if="button.is_use_icon"></v-icon>
          {{ button.label }}
        </v-btn>
      </template>
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
</script>

<style scoped>
.button {
  position: absolute;
  /*height: auto;
  min-height: auto;*/
}

.button-image {
  position: absolute;
  height: auto;
  min-height: auto;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
