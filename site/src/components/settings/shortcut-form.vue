<script lang="ts" setup>
import { ref } from 'vue';
import ntButton from '../el/nt-button.vue';

const { name, url, shortcut, addDelete } = defineProps({
  addDelete: Boolean,
  name: String,
  url: String,
  shortcut: String,
  category: String,
});
const emits = defineEmits([
  'update:name',
  'update:url',
  'update:shortcut',
  'update:category',
  'submit',
  'cancel',
  'delete',
]);

function updateName(event: Event) {
  emits('update:name', (event.target as HTMLInputElement).value);
}

function updateUrl(event: Event) {
  emits('update:url', (event.target as HTMLInputElement).value);
}

function updateShortcut(event: Event) {
  emits('update:shortcut', (event.target as HTMLInputElement).value);
}

function updateCategory(event: Event) {
  emits('update:category', (event.target as HTMLInputElement).value);
}

const form = ref(null);
</script>

<template>
  <form
    class="grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-5 mt-5"
    ref="form"
    @submit.prevent="$emit('submit', $event)"
  >
    <div class="w-full col-span-2">
      <label
        for="shortcutName"
        class="text-white after:content-['*'] after:ml-0.5 after:text-red-500"
        >Name</label
      >
      <input
        type="text"
        id="shortcutName"
        class="nt-input w-full"
        placeholder="My nice shortcut"
        :value="name"
        @input="updateName"
      />
    </div>
    <div class="w-full col-span-2 sm:col-span-1">
      <label
        for="shortcutName"
        class="text-white after:content-['*'] after:ml-0.5 after:text-red-500"
        >Shortcut</label
      >
      <input
        type="text"
        id="shortcutName"
        class="nt-input w-full"
        placeholder="mns"
        :value="shortcut"
        @input="updateShortcut"
      />
    </div>
    <div class="w-full col-span-2 sm:col-span-1">
      <label for="shortcutCategory" class="text-white">Category</label>
      <input
        type="text"
        id="shortcutCategory"
        class="nt-input w-full"
        placeholder="category"
        :value="category"
        @input="updateCategory"
      />
    </div>
    <div class="w-full col-span-2">
      <label
        for="shortcutName"
        class="text-white after:content-['*'] after:ml-0.5 after:text-red-500"
        >URL</label
      >
      <input
        type="url"
        id="shortcutName"
        class="nt-input w-full"
        placeholder="https://example.com"
        :value="url"
        @input="updateUrl"
      />
    </div>
    <div class="flex items-end w-full col-span-2">
      <ntButton danger v-if="addDelete" @click="$emit('delete', $event)">
        <img
          class="w-6 float-left"
          src="../../assets/icons/delete.svg"
          alt="Delete shortcut"
        />
        <span class="ml-1"> Delete </span>
      </ntButton>
      <div class="flex-auto"></div>
      <span>
        <ntButton class="mr-2 ml-auto" @click="$emit('cancel', $event)"
          >cancel</ntButton
        >
        <ntButton primary submit>save</ntButton>
      </span>
    </div>
  </form>
</template>
