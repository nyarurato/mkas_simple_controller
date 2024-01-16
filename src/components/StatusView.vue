<template>
  <div>
    <v-btn icon color="primary" @click="togglePopover">
      <v-badge content="0" color="transparent" location="bottom right"
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
            <p>
              最後のログ:
              <v-icon
                :color="props.api.is_connected ? 'green' : 'red'"
                size="small"
                >mdi-circle</v-icon
              >{{ props.api.last_message }}
            </p>
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
}>();
const popoverOpen = ref(false);
const index = ref(0);

function togglePopover() {
  popoverOpen.value = !popoverOpen.value;
}

function getStatusDiscription(): string {
  return (
    DUETSTATUS.find((status) => status.key === props.api.status)?.description ??
    "不明"
  );
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
