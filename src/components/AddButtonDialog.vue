<template>
  <BasicButtonDialog :is_edit="false"
    ><template v-slot:openmethod="diag">
      <slot name="openmethod" v-bind:show="diag.show"></slot> </template
  ></BasicButtonDialog>
</template>

<script setup lang="ts">
import BasicButtonDialog from "./BasicButtonDialog.vue";
</script>
