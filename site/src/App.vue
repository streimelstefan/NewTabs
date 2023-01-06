<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import clock from './components/clock.vue';
import settings from './components/settings.vue';
import { useBackgroundStore } from './stores/background';
import { useShortcutStore } from './stores/shortcuts';
import { FailureMode, useStateStore } from './stores/state';
import SearchField from './components/search-field.vue';
import ShortcutOverview from './components/shortcut-overview.vue';
import { useSearchEngineStore } from './stores/searchEngine';
import NtButton from './components/el/nt-button.vue';

const background = useBackgroundStore();
const state = useStateStore();
const shortcuts = useShortcutStore();
const searchEngine = useSearchEngineStore();

state.transitions = [
  {
    from: 'clock',
    to: 'search',
  },
  {
    from: 'clock',
    to: 'menu',
  },
  {
    from: 'shortcuts',
    to: 'clock',
  },
  {
    from: 'shortcuts',
    to: 'search',
  },
  {
    from: 'shortcuts',
    to: 'menu',
  },
  {
    from: 'clock',
    to: 'shortcuts',
  },
  {
    from: 'menu',
    to: 'clock',
  },
  {
    from: 'search',
    to: 'clock',
  },
];

state.state = 'clock';
state.failureMode = FailureMode.log;

searchEngine.load();
shortcuts.loadShortcuts();

// @ts-ignore
const mainDiv = ref<HTMLElement>(null);

onMounted(async () => {
  if (await shortcuts.checkForOldShortcuts()) {
    shortcuts.importOldShortcuts();
  }
  document.addEventListener('keydown', changeToSearch);

  // load the image from the cache if there is no image in the cache
  // load a new one
  await background.loadSettings();
  if (!(await background.loadCachedImage())) {
    await background.loadImage();
    await background.saveImage();
  }

  await background.start();
});

onUnmounted(async () => {
  document.removeEventListener('keydown', changeToSearch);
});

function changeToSearch(event: KeyboardEvent) {
  // if the key is a white space character or a special character like shift delete.
  if (event.key.length !== 1) return;

  state.changeState('search');
}
</script>

<template>
  <div
    class="h-screen w-screen bg-no-repeat bg-cover bg-center"
    :style="{ 'background-image': background.background }"
  >
    <div
      class="h-screen w-screen flex items-center justify-center bg-no-repeat bg-contain bg-center bg-black bg-opacity-20 backdrop-blur-md"
      ref="mainDiv"
      @click.self="state.changeState('clock')"
      :style="{ 'background-image': background.background }"
    >
      <NtButton
        class="absolute top-0 right-0 w-16 h-16 m-0"
        @click="state.changeState('menu')"
      >
        <img src="./assets/icons/settings.svg" alt="settings" />
      </NtButton>
      <clock
        v-if="state.state === 'clock'"
        @click="state.changeState('shortcuts')"
      ></clock>
      <settings v-if="state.state === 'menu'"></settings>
      <SearchField v-if="state.state === 'search'"></SearchField>
      <ShortcutOverview v-if="state.state === 'shortcuts'"></ShortcutOverview>
    </div>
  </div>
</template>
