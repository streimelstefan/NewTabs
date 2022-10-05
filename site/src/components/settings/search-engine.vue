<script lang="ts" setup>
import { useSearchEngineStore } from '@/stores/searchEngine';

const searchEngine = useSearchEngineStore();
</script>

<template>
    <div class="h-full">
        <h1 class="w-full text-center text-lg text-white">Search Engine</h1>

        <ol class="grid grid-cols-2 gap-10">
            <li
                v-for="engine in searchEngine.engines"
                :class="
                    engine === searchEngine.default
                        ? 'bg-opacity-70 bg-gray-900'
                        : 'hover:bg-opacity-70 bg-sky-300 bg-opacity-10 backdrop-opacity-80 hover:bg-gray-900'
                "
                class="w-full h-48 text-center flex items-center text-white text-2xl justify-center rounded-md uppercase"
                @click="searchEngine.setDefault(engine)"
            >
                <span>
                    {{ engine }}
                </span>
            </li>
        </ol>
    </div>
</template>
