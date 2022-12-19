<script lang="ts" setup>
import FileDropOff from './background/file-drop-off.vue';
import NtButton from '../el/nt-button.vue';
import { useBackgroundStore } from '../../stores/background';
import { ref } from 'vue';

const background = useBackgroundStore();

async function saveSettings() {
  await background.saveSettings();
}

async function getNewImage() {
  await saveSettings();
  await background.loadImage();
  await background.saveImage();
}
</script>

<template>
  <div class="h-full">
    <h1 class="w-full text-center text-lg text-white">Background</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 mt-5 h-1/3">
      <form class="flex flex-col items-center" @submit.prevent="">
        <h2 class="w-full text-center text-lg text-white">
          Get a random image
        </h2>
        <div
          class="2xl:w-2/3 w-full bg-opacity-70 backdrop-opacity-80 text-white bg-gray-900 rounded-md p-3"
        >
          <span class="text-gray-200 text-lg"
            >Get a random image from a 3rd party image provider. Provide an
            inset to shrink the image size by this percentige on all sides</span
          >
          <br />
          <span class="flex items-center w-full">
            <label for="shortcutName" class="text-white text-lg"
              >Inset in %:
            </label>
            <div class="flex-grow"></div>
            <input
              @change="saveSettings"
              type="number"
              id="imageInset"
              v-model="background.inset"
              class="nt-input w-12 float-right text-center"
              placeholder="0"
            />
          </span>
          <NtButton submit class="mt-5 float-right" @click="getNewImage()"
            >Get Image</NtButton
          >
        </div>
      </form>
      <div class="flex flex-col items-center">
        <div class="2xl:w-2/3 w-full h-full">
          <FileDropOff></FileDropOff>
        </div>
      </div>
    </div>
  </div>
</template>
