<template>
  <HelloWorld2 />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import HelloWorld2 from "../components/HelloWorld2.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    HelloWorld2,
  },
});
</script>
