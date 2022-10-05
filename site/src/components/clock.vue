<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

let time = ref(getTimeString());

function getTimeString() {
    const date = new Date();
    let seconds = '';
    let minutes = '';
    let hours = '';

    if (date.getSeconds() < 10) {
        seconds = '0' + date.getSeconds();
    } else {
        seconds = '' + date.getSeconds();
    }

    if (date.getMinutes() < 10) {
        minutes = '0' + date.getMinutes();
    } else {
        minutes = '' + date.getMinutes();
    }

    if (date.getHours() < 10) {
        hours = '0' + date.getHours();
    } else {
        hours = '' + date.getHours();
    }

    return `${hours}:${minutes}:${seconds}`;
}

let interval: any;

onMounted(() => {
    interval = setInterval(() => {
        time.value = getTimeString();
    }, 100);
});

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <div
        class="font-bold text-white text-6xl p-3 pb-1 px-5 glass-bg rounded-2xl"
    >
        {{ time }}
    </div>
</template>
