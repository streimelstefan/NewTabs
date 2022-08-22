<script lang="ts" setup>
import shortcutItem from './shortcut-item.vue';
import shortcutForm from './shortcut-form.vue';
import ntButton from '../el/nt-button.vue';
</script>

<template>
    <div>
        <h1 class="w-full text-center text-lg text-white">Add a shortcut</h1>
        <shortcutForm></shortcutForm>
        <div class="flex items-end w-full">
            <div class="flex-auto"></div>
            <span>
                <ntButton class="mr-2 ml-auto">cancel</ntButton>
                <ntButton primary>save</ntButton>
            </span>
        </div>
        <h1 class="w-full text-center text-lg text-white my-5">My shortcuts</h1>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
        <shortcut-item
            name="Youtube"
            url="https://youtube.com"
            shortcut="yt"
        ></shortcut-item>
    </div>
</template>
