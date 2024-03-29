<script setup lang="ts">
import { useSearchStore } from '@/stores/search';
import { useSearchEngineStore } from '@/stores/searchEngine';
import { useShortcutStore } from '@/stores/shortcuts';
import { useStateStore } from '@/stores/state';
import { computed, ref } from '@vue/reactivity';
import { onMounted, onUnmounted, watch } from 'vue';

const query = ref<string>('');
const state = useStateStore();
const shortcuts = useShortcutStore();
const searchEngine = useSearchEngineStore();

// @ts-ignore
const searchField = ref<HTMLInputElement>(null);
// @ts-ignore
const urlChecker = ref<HTMLInputElement>(null);

const hintIgnore = ref(0);
const maxHintIgnore = ref(0);

async function search() {
  const searchStore = useSearchStore();

  searchStore.search(query.value);
}

function setQuery(event: Event) {
  query.value = (event.target as HTMLInputElement).value;
}

function checkHintAction(event: KeyboardEvent) {
  const actionKeys = ['ArrowUp', 'ArrowDown'];
  if (actionKeys.includes(event.code)) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (event.code === 'ArrowUp' && hintIgnore.value !== 0) {
      return (hintIgnore.value -= 1);
    }

    if (
      event.code === 'ArrowDown' &&
      hintIgnore.value < maxHintIgnore.value - 1
    ) {
      return (hintIgnore.value += 1);
    }
  }
}

function globalKeyListener(event: KeyboardEvent) {
  if (event.code === 'Tab') {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (searchHint.value) {
      query.value = searchHint.value;
      searchField.value.value = searchHint.value;
    }
  }

  if (event.code === 'Enter') {
    search();
  }
}

const shortcutUrl = computed(() => {
  const sc = shortcuts.getByKey(query.value);
  if (sc) {
    return sc.url;
  }

  return '';
});

const searchHint = computed(() => {
  if (query.value) {
    const hint = shortcuts.getBestMatchingShortcut(
      query.value,
      hintIgnore.value
    );

    maxHintIgnore.value = hint.maxIgnorable;

    return hint.hint;
  }
  return '';
});

watch(query, (value) => {
  if (value === '') {
    state.changeState('clock');
  }
});

onMounted(() => {
  searchField.value.focus();
  document.addEventListener('keydown', globalKeyListener);
});

onUnmounted(() => {
  document.removeEventListener('keydown', globalKeyListener);
});
</script>

<template>
  <form @submit.prevent="search()" class="relative">
    <input
      class="font-semibold text-black text-6xl p-3 pb-1 px-5 bg-transparent"
      readonly
      id="searchHint"
      :value="searchHint"
    />
    <input
      class="absolute top-0 left-0 font-semibold text-white text-6xl p-3 pb-1 px-5 glass-bg rounded-2xl focus:border-white border border-transparent box-border outline-none"
      autofocus
      name="search"
      ref="searchField"
      @input="setQuery"
      type="search"
      @keydown="checkHintAction"
    />
    <span class="absolute text-white text-sm -bottom-5 left-7">{{
      shortcutUrl
    }}</span>
  </form>

  <input
    type="url"
    name="urlChecker"
    id="urlChecker"
    ref="urlChecker"
    class="hidden"
  />
</template>
