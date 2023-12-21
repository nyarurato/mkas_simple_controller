<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";

const props = defineProps({
  name: String,
});
</script>

<template>
  <h2>{{ name }}</h2>
  <slot name="item"> </slot>
</template>
