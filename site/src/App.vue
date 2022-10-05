<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import clock from './components/clock.vue';
import settings from './components/settings.vue';
import { useBackgroundStore } from './stores/background';
import { useShortcutStore } from './stores/shortcuts';
import { useStateStore, State } from './stores/state';

const background = useBackgroundStore();
const state = useStateStore();
const shortcuts = useShortcutStore();
shortcuts.loadShortcuts();
// @ts-ignore
const mainDiv = ref<HTMLElement>(null);

onMounted(async () => {
    // load the image from the cache if there is no image in the cache
    // load a new one
    await background.loadSettings();
    if (!(await background.loadCachedImage())) {
        background.loadImage();
    }
    background.saveImage();
    // background.getImage();
});
</script>

<template>
    <div
        class="h-screen w-screen bg-no-repeat bg-cover"
        :style="{ 'background-image': background.background }"
    >
        <div
            class="h-screen w-screen flex items-center justify-center bg-no-repeat bg-center bg-black bg-opacity-20 backdrop-blur-md"
            ref="mainDiv"
            @click.self="state.changeState(State.clock)"
            :style="{ 'background-image': background.background }"
        >
            <clock
                v-if="state.state === State.clock"
                @click="state.changeState(State.settings)"
            ></clock>
            <settings v-if="state.state === State.settings"></settings>
        </div>
    </div>
</template>
