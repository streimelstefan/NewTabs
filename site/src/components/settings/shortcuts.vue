<script lang="ts" setup>
import shortcutItem from './shortcut-item.vue';
import shortcutForm from './shortcut-form.vue';

import { useShortcutStore, type ShortCut } from '@/stores/shortcuts';
import { reactive } from 'vue';
import { computed } from '@vue/reactivity';

const shortcuts = useShortcutStore();
const newSc = reactive({
  name: '',
  shortcut: '',
  url: '',
} as ShortCut);

function addNewShortcut() {
  if (!newSc.name) return;
  if (!newSc.shortcut) return;
  if (!newSc.url) return;

  shortcuts.addShortcut({
    name: newSc.name,
    shortcut: newSc.shortcut,
    url: newSc.url,
  });

  clearNewSc();
}

function clearNewSc() {
  newSc.name = '';
  newSc.shortcut = '';
  newSc.url = '';
}

function deleteSc(sc: ShortCut) {
  shortcuts.removeShortcut(sc);
}

function updateSc(sc: ShortCut) {
  shortcuts.addShortcut(sc, false);
}

const scs = computed(() => {
  const scs = Object.values(shortcuts.shortcuts);

  scs.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  return scs;
});
</script>

<template>
  <div>
    <h1 class="w-full text-center text-lg text-white">Add a shortcut</h1>
    <shortcutForm
      v-model:url="newSc.url"
      v-model:name="newSc.name"
      v-model:shortcut="newSc.shortcut"
      @submit="addNewShortcut()"
      @cancel="clearNewSc()"
    ></shortcutForm>
    <h1 class="w-full text-center text-lg text-white my-5">My shortcuts</h1>
    <shortcut-item
      v-for="sc in scs"
      :shortcut="sc"
      @delete="deleteSc(sc)"
      @update="updateSc($event)"
    ></shortcut-item>
  </div>
</template>
