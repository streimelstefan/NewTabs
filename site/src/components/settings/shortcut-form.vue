<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';

const { name, url, shortcut } = defineProps(['name', 'url', 'shortcut']);
const emits = defineEmits(['update:name', 'update:url', 'update:shortcut']);
</script>

<template>
    <form class="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-5 mt-5">
        <div class="w-full">
            <label for="shortcutName" class="text-white">Name</label>
            <input
                type="text"
                id="shortcutName"
                class="nt-input w-full"
                placeholder="My nice shortcut"
                :value="name"
                @input="$emit('update:name', $event.target.value)"
            />
        </div>
        <div class="w-full">
            <label for="shortcutName" class="text-white">Shortcut</label>
            <input
                type="text"
                id="shortcutName"
                class="nt-input w-full"
                placeholder="mns"
                :value="shortcut"
                @input="$emit('update:shortcut', $event.target.value)"
            />
        </div>
        <div class="w-full col-span-2">
            <label for="shortcutName" class="text-white">URL</label>
            <input
                type="url"
                id="shortcutName"
                class="nt-input w-full"
                placeholder="https://example.com"
                :value="url"
                @input="$emit('update:url', $event.target.value)"
            />
        </div>
    </form>
</template>
