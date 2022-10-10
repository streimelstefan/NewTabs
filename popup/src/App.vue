<script setup>
import NtButton from "./components/el/nt-button.vue";
import { useShortcutStore } from "./stores/shortcuts";
import { ref, onMounted } from "vue";
import { checkCompatEnabled } from "@vue/compiler-core";
import { useBackgroundStore } from "./stores/background";

const shortcuts = useShortcutStore();
const background = useBackgroundStore();

const url = ref("");
const name = ref("");
const shortcut = ref("");
let savedShortcut = "";

const isSaved = ref(false);

async function saveSC() {
  if (!(name.value && url.value && shortcut.value)) return;

  if (isSaved.value) {
    await deleteOldSc();
  }
  await shortcuts.addShortcut(
    {
      name: name.value,
      shortcut: shortcut.value,
      url: url.value,
    },
    !isSaved.value
  );

  checkIfScIsSaved();
}

async function deleteOldSc(check = false) {
  await shortcuts.removeShortcut({
    name: "",
    url: "",
    shortcut: savedShortcut,
  });

  if (check) {
    shortcut.value = "";
    await checkIfScIsSaved();
  }
}

async function checkIfScIsSaved() {
  console.log("test");
  const savedSc = await shortcuts.getScWithUrl(url.value);
  console.log(savedSc);

  if (!savedSc) {
    isSaved.value = false;
    return;
  }

  name.value = savedSc.name;
  shortcut.value = savedSc.shortcut;
  savedShortcut = savedSc.shortcut;

  isSaved.value = true;
}

onMounted(async () => {
  await shortcuts.loadShortcuts();
  await background.loadCachedImage();
  if (chrome.tabs) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
      console.log(tabs);
      name.value = tabs[0].title;
      url.value = tabs[0].url;
      checkIfScIsSaved();
    });
  } else {
    url.value = window.location.href;
    name.value = document.title;
  }
});
</script>

<template>
  <div
    class="text-white bg-no-repeat bg-cover"
    style="width: 500px; height: 300px"
    :style="{ 'background-image': background.background }"
  >
    <div
      :style="{ 'background-image': background.background }"
      class="bg-no-repeat bg-center bg-black bg-opacity-20 backdrop-blur-md w-full h-full"
    >
      <div
        class="p-5 pb-0 text-center text-lg bg-black bg-opacity-70 w-full h-full"
      >
        <h1>Add site to shortcuts</h1>
        <form
          @submit.prevent="saveSC()"
          class="grid grid-cols-2 text-md text-left gap-5"
        >
          <div class="col-span-2">
            <label for="url">URL</label>
            <input
              type="text"
              name="url"
              id="url"
              v-model="url"
              class="nt-input w-full"
            />
          </div>
          <div>
            <label for="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              v-model="name"
              class="nt-input w-full"
            />
          </div>
          <div>
            <label for="shorcut">Shortcut</label>
            <input
              type="text"
              name="shorcut"
              id="shorcut"
              class="nt-input w-full"
              v-model="shortcut"
            />
          </div>
          <div>
            <NtButton
              danger
              v-show="isSaved"
              id="delete"
              @click="deleteOldSc(true)"
              >Delete</NtButton
            >
          </div>
          <NtButton submit id="submit">{{
            isSaved ? "update" : "save"
          }}</NtButton>
        </form>
      </div>
    </div>
  </div>
</template>
