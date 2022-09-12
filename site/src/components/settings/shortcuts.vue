<script lang="ts" setup>
import shortcutItem from './shortcut-item.vue';
import shortcutForm from './shortcut-form.vue';

import { useShortcutStore, type ShortCut } from '@/stores/shortcuts';
import { reactive } from 'vue';

const shortcuts = useShortcutStore();
const newSc = reactive({
    name: '',
    shortcut: '',
    url: '',
} as ShortCut);

function addNewShortcut(shortcut: ShortCut) {
    console.log(newSc);
    shortcuts.addShortcut({
        name: newSc.name,
        shortcut: newSc.shortcut,
        url: newSc.url,
    });
    newSc.name = '';
    newSc.shortcut = '';
    newSc.url = '';
}
</script>

<template>
    <div>
        <h1 class="w-full text-center text-lg text-white">Add a shortcut</h1>
        <shortcutForm
            v-model:url="newSc.url"
            v-model:name="newSc.name"
            v-model:shortcut="newSc.shortcut"
            @submit="addNewShortcut($event)"
        ></shortcutForm>
        <h1 class="w-full text-center text-lg text-white my-5">My shortcuts</h1>
        <shortcut-item
            v-for="sc in shortcuts.shortcuts"
            :shortcut="sc"
        ></shortcut-item>
    </div>
</template>
