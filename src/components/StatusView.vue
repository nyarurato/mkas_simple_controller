<template>
  <div>
    <v-btn icon :color="getBtnColor()" @click="togglePopover">
      <v-badge
        :content="$props.index"
        color="transparent"
        location="bottom right"
        ><v-icon>mdi-chip</v-icon></v-badge
      >
      <v-tooltip v-model="popoverOpen" location="bottom" activator="parent">
        <v-card>
          <v-card-item>
            <p>IPアドレス: {{ props.api.duetAddress }}</p>
            <p>
              接続状況:
              <v-icon
                :color="props.api.is_connected ? 'green' : 'red'"
                size="small"
                >mdi-circle</v-icon
              >{{ props.api.is_connected ? "接続中" : "未接続" }}
            </p>
            <p>
              ステータス:
              <v-icon :color="getStatusColor()" size="small">mdi-circle</v-icon
              >{{ getStatusDiscription() }}
            </p>

            <!--
              <div v-if="!props.api.is_connected">
              <v-btn variant="outlined">再接続</v-btn>
            </div>
            -->
          </v-card-item>
        </v-card>
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { APIComunicator, DUETSTATUS } from "./APIComunicator";

const props = defineProps<{
  api: APIComunicator;
  index: number;
}>();
const popoverOpen = ref(false);

function togglePopover() {
  popoverOpen.value = !popoverOpen.value;
}

function getStatusDiscription(): string {
  return (
    DUETSTATUS.find((status) => status.key === props.api.status)?.description ??
    "不明"
  );
}

function getBtnColor(): string {
  return props.api.is_connected ? "primary" : "#666666";
}

function getStatusColor(): string {
  return (
    DUETSTATUS.find((status) => status.key === props.api.status)?.color ??
    "#808080" //gray
  );
}

onMounted(() => {
  const intervalId = setInterval(() => {
    props.api.getDuetStatus();
    //props.api.getDuetLastMessage();
  }, 3000);

  // Cleanup the interval when the component is unmounted
  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>
