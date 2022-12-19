<script lang="ts" setup>
import type { ShortCut } from '@/stores/shortcuts';

export type Category = {
  name: string;
  shortcuts: ShortCut[];
};

const { category } = defineProps({
  category: {
    type: Object as () => Category,
    required: true,
  },
});
</script>

<template>
  <div class="glass-bg rounded-lg p-5 text-white">
    <h1 class="text-lg pb-5 text-center">{{ category.name }}</h1>
    <ol class="pl-5">
      <li
        class="list-disc relative w-full text-base cursor-pointer before:w-0 before:h-1 before:rounded-full before:absolute before:bottom-0 before:right-0 before:bg-white before:transition-all before:duration-300 hover:before:w-full hover:before:left-0"
        v-for="shortcut of category.shortcuts"
      >
        <a class="block w-full" :href="shortcut.url">{{ shortcut.name }}</a>
      </li>
    </ol>
  </div>
</template>
