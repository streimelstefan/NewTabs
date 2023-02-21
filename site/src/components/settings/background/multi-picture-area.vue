<script lang="ts" setup>
import { useBackgroundStore } from '@/stores/background';
import { watch, ref, onMounted, onUnmounted } from 'vue';
import NtButton from '../../el/nt-button.vue';

const backgroundStore = useBackgroundStore();
backgroundStore.multiPictureMode = true;

let images = ref<string[]>([]);
watch(
  backgroundStore.multiPictureImages,
  async () => {
    images.value = [];
    for (const image of backgroundStore.multiPictureImages) {
      const imageBlob = await backgroundStore.getMultiImage(image);
      images.value.push(await backgroundStore.getImageUrl(imageBlob));
    }
  },
  { immediate: true }
);

function removePic(index: number) {
  backgroundStore.removeMultiImage(backgroundStore.multiPictureImages[index]);
}

onMounted(() => {
  backgroundStore.multiPictureMode = false;
});

onUnmounted(() => {
  backgroundStore.multiPictureMode = true;
});
</script>

<template>
  <h1 class="w-full text-center text-lg text-white">
    Multi-picture Backgrounds
  </h1>

  <NtButton
    @click="
      backgroundStore.addImageToMultiImage(backgroundStore.backgroundBlob)
    "
    >Add current Background</NtButton
  >

  <div class="mt-5 grid grid-cols-4 gap-5">
    <div
      v-for="(picture, index) in images"
      class="rounded-md aspect-square bg-cover bg-center group"
      :style="{ 'background-image': `url(${picture})` }"
    >
      <button
        @click="removePic(index)"
        class="invisible group-hover:visible flex h-full w-full justify-center items-center bg-opacity-70 backdrop-opacity-80 text-white bg-gray-900 rounded-md"
      >
        <img src="../../../assets/icons/delete.svg" alt="delete" class="h-10" />
      </button>
    </div>
  </div>
</template>
