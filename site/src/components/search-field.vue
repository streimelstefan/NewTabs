<script setup lang="ts">
import { useSearchEngineStore } from '@/stores/searchEngine';
import { useShortcutStore } from '@/stores/shortcuts';
import { State, useStateStore } from '@/stores/state';
import { ref } from '@vue/reactivity';
import { onMounted, watch } from 'vue';

const query = ref<string>('');
const state = useStateStore();
const shortcuts = useShortcutStore();
const searchEngine = useSearchEngineStore();

// @ts-ignore
const searchField = ref<HTMLInputElement>(null);
// @ts-ignore
const urlChecker = ref<HTMLInputElement>(null);

async function search() {
    // if the query is meant for a shortcut
    if (shortcuts.getByKey(query.value)) {
        const sc = shortcuts.getByKey(query.value);

        console.log(sc);

        return goTo(sc.url);
    }

    // if the string is a url set the query to the href of the site
    if (isUrl(query.value)) {
        return goTo(query.value);
    }

    // if it is a normal search query
    goTo(searchEngine.getSearchPrefix() + query.value);
}

function goTo(url: string) {
    console.log(`Going to ${url}`);
    window.location.href = url;
}

function isUrl(query: string) {
    urlChecker.value.value = '';
    urlChecker.value.value = query;

    urlChecker.value.checkValidity();
    console.log(urlChecker.value.value);
    console.log(urlChecker.value.validity.valid);
    return urlChecker.value.validity.valid;
}

function setQuery(event: Event) {
    query.value = (event.target as HTMLInputElement).value;
}

watch(query, (value) => {
    if (value === '') {
        state.state = State.clock;
    }
});

onMounted(() => {
    searchField.value.focus();
});
</script>

<template>
    <form @submit.prevent="search()">
        <input
            class="font-bold text-white text-6xl p-3 pb-1 px-5 glass-bg rounded-2xl focus:border-white border border-transparent box-border outline-none"
            autofocus
            name="search"
            ref="searchField"
            @input="setQuery"
            type="search"
        />
    </form>

    <input
        type="url"
        name="urlChecker"
        id="urlChecker"
        ref="urlChecker"
        class="hidden"
    />
</template>
