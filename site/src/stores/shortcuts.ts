import { defineStore } from 'pinia';
import type { l } from 'vitest/dist/index-4a906fa4';

export interface ShortCut {
    // name of the shortcut just for organisation sake
    name: string;
    // the url to wich the shortcut should resolve
    url: string;
    // the string that should trigger a shortcut
    shortcut: string;
}

export const useShortcutStore = defineStore('shortcut', {
    state: () => ({ shortcuts: [] as ShortCut[] }),
    actions: {
        saveShortcuts() {
            localStorage.setItem('shortcuts', JSON.stringify(this.shortcuts));
        },
        loadShortcuts() {
            const scString = localStorage.getItem('shortcuts');
            if (scString) {
                this.shortcuts = JSON.parse(scString);
            }
        },
        addShortcut(sc: ShortCut) {
            this.shortcuts.push(sc);
        },
        removeShortcut(sc: ShortCut) {
            for (var i = 0; i < this.shortcuts.length; i++) {
                if (this.shortcuts[i] === sc) {
                    this.shortcuts.splice(i, 1);
                    i--;
                }
            }
        },
        getByKey(key: string) {
            for (const sc of this.shortcuts) {
                if ((sc.shortcut = key)) return sc;
            }
        },
    },
});
