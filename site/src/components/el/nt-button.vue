<script lang="ts" setup>
const { primary } = defineProps({ primary: Boolean });
defineEmits(['click']);
</script>
<template>
    <button
        class="mt-5 p-3 uppercase text-white rounded-md hover:bg-sky-300 hover:bg-opacity-10"
        :class="primary ? 'bg-opacity-70 backdrop-opacity-80 bg-gray-900' : ''"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>
