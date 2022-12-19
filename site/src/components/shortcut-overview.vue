<script setup lang="ts">
import { computed } from 'vue';
import { useShortcutStore, type ShortCut } from '@/stores/shortcuts';
import type { Category } from './shortcutOverview/category.vue';
import category from './shortcutOverview/category.vue';

const shortcuts = useShortcutStore();

const categories = computed(() => {
  const _categories: Record<string, Category> = {};

  for (const key of Object.keys(shortcuts.shortcuts)) {
    const sc = shortcuts.shortcuts[key];
    if (!sc.category) {
      if (!_categories['No Category']) {
        _categories['No Category'] = {
          name: 'No Category',
          shortcuts: [],
        };
      }

      _categories['No Category'].shortcuts.push(sc);
      continue;
    }

    if (!_categories[sc.category]) {
      _categories[sc.category] = {
        name: sc.category,
        shortcuts: [],
      };
    }

    _categories[sc.category].shortcuts.push(sc);
  }

  return _categories;
});

const keys = computed(() => {
  const _keys = Object.keys(categories.value);

  _keys.sort((a: string, b: string) => {
    return a.localeCompare(b);
  });

  return _keys;
});
</script>

<template>
  <div class="w-4/5 glass-bg h-4/5 p-5 overflow-auto scrollbar">
    <div
      class="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      <category v-for="cat of keys" :category="categories[cat]"></category>
    </div>
  </div>
</template>
