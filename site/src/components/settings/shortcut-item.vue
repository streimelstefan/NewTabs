<script lang="ts" setup>
import ntButton from '../el/nt-button.vue';
import shortcutForm from './shortcut-form.vue';
import { ref } from 'vue';
const { name, url, shortcut } = defineProps(['name', 'url', 'shortcut']);

const openEdit = ref(false);
</script>
<template>
    <div
        class="group w-full relative text-base p-3 bg-opacity-70 backdrop-opacity-80 text-white bg-gray-900 rounded-md my-5"
    >
        <button
            class="absolute right-4 top-4 w-3 h-3 hidden group-hover:inline-block"
            @click="openEdit = !openEdit"
            v-if="!openEdit"
        >
            <img src="../../assets/icons/edit.svg" alt="Edit shortcut" />
        </button>
        <button
            class="absolute right-4 top-4 w-4 h-4 hidden group-hover:inline-block"
            @click="openEdit = !openEdit"
            v-if="openEdit"
        >
            <img
                src="../../assets/icons/menu-close.svg"
                alt="Cancel edit shortcut"
            />
        </button>
        <div>{{ name }}</div>
        <span>:{{ shortcut }}</span>
        ->
        <span>{{ url }}</span>
        <div v-if="openEdit">
            <shortcutForm
                v-model:url="url"
                v-model:name="name"
                v-model:shortcut="shortcut"
            ></shortcutForm>
            <div class="flex items-end w-full">
                <div class="flex-auto"></div>
                <span>
                    <ntButton class="mr-2 ml-auto">cancel</ntButton>
                    <ntButton primary>save</ntButton>
                </span>
            </div>
        </div>
    </div>
</template>
