<script setup lang="ts">
import shortcuts from './settings/shortcuts.vue';
import { State, useStateStore } from '@/stores/state';
import { ref } from 'vue';
import Background from './settings/background.vue';
let openMenu = ref(false);
const state = useStateStore();
enum SettingState {
    shortcuts = 'Shortcuts',
    background = 'Background',
    searchEngine = 'Search Engine',
}

let settingState = ref(SettingState.shortcuts);

function changePage(page: SettingState) {
    settingState.value = page;
    console.log(settingState);
    openMenu.value = false;
}
</script>

<template>
    <div
        class="w-full h-full md:h-4/5 lg:w-4/5 lg:rounded-2xl glass-bg overflow-hidden flex flex-col md:flex-row items-center"
    >
        <!-- <div
            class="bg-gray-900 bg-opacity-70 backdrop-opacity-80 backdrop-blur-2xl h-full w-1/4 flex items-center pl-5"
        > -->
        <div
            class="bg-gray-900 md:hidden bg-opacity-70 backdrop-opacity-80 backdrop-blur-2xl w-full text-center flex items-center"
        >
            <div class="w-full">
                <h1
                    class="text-white sm:pl-3 py-3 text-lg w-full h-full leading-none mt-1 relative"
                >
                    {{ settingState }}
                    <button
                        @click="openMenu = !openMenu"
                        class="w-10 h-10 mr-3 absolute left-3 -translate-y-1/2 top-1/2"
                    >
                        <img
                            src="../assets/icons/dropdown-menu.svg"
                            alt="open settings menu"
                            v-show="!openMenu"
                        />
                        <img
                            class="p-1.5"
                            src="../assets/icons/menu-close.svg"
                            alt="close settings menu"
                            v-show="openMenu"
                        />
                    </button>
                    <button
                        @click="state.changeState(State.clock)"
                        class="w-8 h-8 mr-3 absolute right-3 -translate-y-1/2 top-1/2"
                    >
                        <img
                            class="p-1.5"
                            src="../assets/icons/menu-close-ring.svg"
                            alt="close settings"
                        />
                    </button>
                </h1>
                <nav>
                    <ol class="mt-3" v-show="openMenu">
                        <li
                            class="settings-menu-item"
                            v-if="settingState !== SettingState.shortcuts"
                            @click="changePage(SettingState.shortcuts)"
                        >
                            Shortcuts
                        </li>
                        <li
                            class="settings-menu-item"
                            v-if="settingState !== SettingState.background"
                            @click="changePage(SettingState.background)"
                        >
                            Background
                        </li>
                        <li
                            class="settings-menu-item"
                            v-if="settingState !== SettingState.searchEngine"
                            @click="changePage(SettingState.searchEngine)"
                        >
                            Search Engine
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
        <div
            class="hidden basis-52 grow-0 shrink-0 justify-end items-center md:inline-flex h-full bg-opacity-70 bg-gray-900 backdrop-opacity-80 backdrop-blur-2xl"
        >
            <nav class="w-full">
                <ol>
                    <li
                        class="settings-menu-item"
                        @click="changePage(SettingState.shortcuts)"
                        :class="
                            settingState === SettingState.shortcuts
                                ? 'bg-sky-300 bg-opacity-10'
                                : ''
                        "
                    >
                        Shortcuts
                    </li>
                    <li
                        class="settings-menu-item"
                        @click="changePage(SettingState.background)"
                        :class="
                            settingState === SettingState.background
                                ? 'bg-sky-300 bg-opacity-10'
                                : ''
                        "
                    >
                        Background
                    </li>
                    <li
                        class="settings-menu-item"
                        @click="changePage(SettingState.searchEngine)"
                        :class="
                            settingState === SettingState.searchEngine
                                ? 'bg-sky-300 bg-opacity-10'
                                : ''
                        "
                    >
                        Search Engine
                    </li>
                </ol>
            </nav>
        </div>
        <div
            class="p-5 w-full md:h-full flex-auto md:flex-1 overflow-y-auto scrollbar"
        >
            <shortcuts
                v-if="settingState === SettingState.shortcuts"
            ></shortcuts>
            <Background
                v-if="settingState === SettingState.background"
            ></Background>
        </div>
    </div>
</template>
