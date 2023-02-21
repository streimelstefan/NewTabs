<script lang="ts" setup>
import { useBackgroundStore } from '@/stores/background';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const backgroundStore = useBackgroundStore();

const enum State {
  default,
  decline,
  accept,
}

const state = ref<State>(State.default);
//@ts-ignore
const input = ref<HTMLInputElement>(null);

async function handleFile(event: DragEvent) {
  event.preventDefault();

  // called from input click event
  if (event.type === 'change') {
    const reader = new FileReader();
    reader.onloadend = async () => {
      backgroundStore.backgroundBlob = await backgroundStore.getImageFromBase64(
        reader.result as string
      );

      backgroundStore.setBackgroundUrl(
        await backgroundStore.getImageUrl(backgroundStore.backgroundBlob)
      );
      backgroundStore.saveImage();
    };
    // @ts-ignore
    reader.readAsDataURL(input.value.files[0]);
  }

  // called from drag area
  if (event.dataTransfer) {
    // @ts-ignore
    const fileArr = [...event.dataTransfer.items];
    if (fileArr.length > 1) return;

    if (!fileArr[0].type.startsWith('image')) {
      console.error(
        'User provided wrong kind of file. Only images are allowed'
      );
      state.value = State.decline;
      return;
    }

    state.value = State.default;

    const reader = new FileReader();
    reader.onloadend = async () => {
      backgroundStore.backgroundBlob = await backgroundStore.getImageFromBase64(
        reader.result as string
      );

      backgroundStore.setBackgroundUrl(
        await backgroundStore.getImageUrl(backgroundStore.backgroundBlob)
      );
      backgroundStore.saveImage();
    };
    reader.readAsDataURL(fileArr[0].getAsFile() as Blob);
  }
}

async function checkFiles(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    //@ts-ignore
    const fileArr = [...event.dataTransfer.items];
    if (fileArr.length > 1) return;

    if (fileArr[0].type.startsWith('image')) {
      state.value = State.accept;
    } else {
      state.value = State.decline;
    }
  }
}

const classesCon = computed(() => {
  switch (state.value) {
    case State.accept:
      return ['bg-opacity-60', 'backdrop-opacity-80', 'bg-green-500'];
    case State.decline:
      return ['bg-opacity-60', 'backdrop-opacity-80', 'bg-red-500'];
    case State.default:
      return [''];
  }
});

const classesBorder = computed(() => {
  switch (state.value) {
    case State.accept:
      return ['border-green-700'];
    case State.decline:
      return ['border-red-600'];
    case State.default:
      return [''];
  }
});

const text = computed(() => {
  switch (state.value) {
    case State.accept:
      return 'Drop off your new background now';
    case State.decline:
      return 'You can only use images as a background!';
    case State.default:
      return 'Drop your background here';
  }
});
</script>

<template>
  <div class="h-full w-full relative group">
    <div
      @dragenter.prevent="checkFiles"
      @dragover.prevent="checkFiles"
      @drop.prevent="handleFile"
      @dragleave="state = State.default"
      class="absolute top-0 left-0 h-full w-full z-10 cursor-pointer"
      @click.self.prevent.stop="input.click()"
    ></div>
    <div class="h-full w-full flex flex-col">
      <label for="set-background" class="text-white text-center w-full text-lg"
        >Set your custom background</label
      >
      <form
        id="background-drop-zone"
        class="h-full w-full bg-opacity-70 backdrop-opacity-80 text-white bg-gray-900 rounded-md p-3 group-hover:p-2 transition-[padding]"
        :class="classesCon"
      >
        <div
          class="flex justify-center items-center border-dashed border-white border-2 w-full h-full rounded"
          :class="classesBorder"
        >
          <span class="p-14 text-lg">{{ text }} </span>
        </div>
        <input
          @change="handleFile($event as DragEvent)"
          ref="input"
          type="file"
          name="set-background"
          id="set-background"
          class="hidden"
          accept="image/*"
        />
      </form>
    </div>
  </div>
</template>
