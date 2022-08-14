<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import clock from './components/clock.vue';
import settings from './components/settings.vue';
import { useBackgroundStore } from './stores/background';

const background = useBackgroundStore();
// @ts-ignore
const mainDiv = ref<HTMLElement>(null);

onMounted(() => {
    background.loadImage();
    background.saveImage();
    // background.getImage();
});
</script>

<template>
    <div
        class="h-screen w-screen bg-no-repeat bg-cover"
        :style="{ 'background-image': background.background }"
    >
        <div class="h-screen w-screen bg-black bg-opacity-20 backdrop-blur-md">
            <div
                class="h-screen w-screen flex items-center justify-center bg-no-repeat bg-center"
                ref="mainDiv"
                :style="{ 'background-image': background.background }"
            >
                <!-- <clock></clock> -->
                <settings></settings>
            </div>
        </div>
    </div>
</template>
