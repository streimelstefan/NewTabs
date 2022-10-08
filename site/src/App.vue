<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import clock from './components/clock.vue';
import settings from './components/settings.vue';
import { useBackgroundStore } from './stores/background';
import { useShortcutStore } from './stores/shortcuts';
import { useStateStore, State } from './stores/state';
import SearchField from './components/search-field.vue';
import { useSearchEngineStore } from './stores/searchEngine';

const background = useBackgroundStore();
const state = useStateStore();
const shortcuts = useShortcutStore();
const searchEngine = useSearchEngineStore();
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
});

onUnmounted(async () => {
    document.removeEventListener('keydown', changeToSearch);
});

function changeToSearch() {
    if (state.state === State.clock) {
        state.state = State.search;
    }
}
</script>

<template>
    <div
        class="h-screen w-screen bg-no-repeat bg-cover"
        :style="{ 'background-image': background.background }"
    >
        <div
            class="h-screen w-screen flex items-center justify-center bg-no-repeat bg-center bg-black bg-opacity-20 backdrop-blur-md"
            ref="mainDiv"
            @click.self="
                state.state === State.settings
                    ? state.changeState(State.clock)
                    : undefined
            "
            :style="{ 'background-image': background.background }"
        >
            <clock
                v-if="state.state === State.clock"
                @click="state.changeState(State.settings)"
            ></clock>
            <settings v-if="state.state === State.settings"></settings>
            <SearchField v-if="state.state === State.search"></SearchField>
        </div>
    </div>
</template>
