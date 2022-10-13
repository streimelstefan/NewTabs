<script lang="ts" setup>
import ntButton from '../el/nt-button.vue';
import shortcutForm from './shortcut-form.vue';
import { ref } from 'vue';
import type { ShortCut } from '@/stores/shortcuts';

const { shortcut } = defineProps(['shortcut']);
let scBackup: ShortCut;

const openEdit = ref(false);

defineEmits(['update', 'cancel', 'delete']);

function canceled() {
    openEdit.value = false;
    shortcut.name = scBackup.name;
    shortcut.shortcut = scBackup.shortcut;
    shortcut.url = scBackup.url;
}

function openEditor() {
    openEdit.value = true;
    scBackup = {
        name: shortcut.name,
        shortcut: shortcut.shortcut,
        url: shortcut.url,
    };
}
</script>
<template>
    <div
        class="group w-full relative text-base p-3 bg-opacity-70 backdrop-opacity-80 text-white bg-gray-900 rounded-md my-5 overflow-hidden"
    >
        <button
            class="absolute hidden group-hover:flex justify-center items-center left-[95%] right-0 top-0 bottom-0 bg-sky-300 bg-opacity-10"
            @click="openEditor()"
            v-if="!openEdit"
        >
            <img
                class="w-4 h-4"
                src="../../assets/icons/edit.svg"
                alt="Edit shortcut"
            />
        </button>
        <div
            class="w-[95%]"
            :class="{ 'truncate whitespace-nowrap': !openEdit }"
        >
            {{ shortcut.name }}
        </div>
        <div
            class="w-[95%]"
            :class="{ 'truncate whitespace-nowrap': !openEdit }"
        >
            {{ shortcut.shortcut }}
            ->
            {{ shortcut.url }}
        </div>
        <div v-if="openEdit">
            <shortcutForm
                v-model:url="shortcut.url"
                v-model:name="shortcut.name"
                v-model:shortcut="shortcut.shortcut"
                @submit="
                    $emit('update', $event);
                    openEdit = false;
                "
                @cancel="canceled()"
                @delete="$emit('delete', $event)"
                addDelete
            ></shortcutForm>
        </div>
    </div>
</template>
