<script setup lang="ts">
import { ref, reactive, computed, toRefs } from "vue";
import type { Ref } from "vue";
import SlideMenuItem from "./SlideMenuItem.vue";

const props = defineProps({
  name: String,
});
</script>

<template>
  <SlideMenuItem :name="props.name">
    <template v-slot:item>
      <div>
        <div class="buttonadd-column">
          <div class="buttonadd-colunmname">ボタン名</div>
          <input type="text" />
        </div>
        <div class="buttonadd-column">
          <div class="buttonadd-colunmname">ボタン画像</div>
          <input type="file" />
        </div>
        <div class="buttonadd-column">
          <div class="buttonadd-colunmname">送信先</div>
          <input type="text" />
        </div>
        <div class="buttonadd-column">
          <div class="buttonadd-colunmname">送信コマンド</div>
          <div>
            <div>
              <input type="radio" /> コマンド実行
              <input type="text" />
            </div>
            <br />
            <div>
              <input type="radio" /> ファイル実行
              <select>
                <option value="1">ファイル1</option>
                <option value="2">ファイル2</option>
                <option value="3">ファイル3</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <button>ボタンを追加</button>
        </div>
      </div>
    </template>
  </SlideMenuItem>
</template>

<style>
.buttonadd-column {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.buttonadd-colunmname {
  font-weight: bold;
  width: 10rem;
}
</style>
