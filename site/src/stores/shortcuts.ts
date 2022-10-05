import { defineStore } from 'pinia';
import type { l } from 'vitest/dist/index-4a906fa4';
import { useDbStore } from './db';

export interface ShortCut {
    // name of the shortcut just for organisation sake
    name: string;
    // the url to wich the shortcut should resolve
    url: string;
    // the string that should trigger a shortcut
    shortcut: string;
}

export const useShortcutStore = defineStore('shortcut', {
    state: () => {
        return { shortcuts: {} as Record<string, ShortCut> };
    },
    actions: {
        async saveShortcuts() {
            const db = useDbStore();
            await db.save('shortcuts', JSON.stringify(this.shortcuts), true);
        },
        async loadShortcuts() {
            const db = useDbStore();
            let scString = await db.get('shortcuts', true);
            console.log(`Got shorcuts from database: ${scString}`);
            if (scString !== null) {
                if (scString.startsWith('"')) {
                    scString = JSON.parse(scString) as string;
                }
                this.shortcuts = JSON.parse(scString);
                console.log(this.shortcuts);
            }
        },
        async addShortcut(sc: ShortCut, saveMode = true) {
            if (this.shortcuts[sc.shortcut] && saveMode) {
                return false;
            }

            this.shortcuts[sc.shortcut] = sc;
            await this.removeDuplicates();
            await this.saveShortcuts();
            return true;
        },
        async removeDuplicates() {
            Object.keys(this.shortcuts).forEach((key) => {
                if (this.shortcuts[key].shortcut !== key) {
                    delete this.shortcuts[key];
                }
            });
        },
        async removeShortcut(sc: ShortCut) {
            if (!this.shortcuts[sc.shortcut]) {
                return false;
            }
            delete this.shortcuts[sc.shortcut];
            await this.saveShortcuts();
            return true;
        },
        getByKey(key: string) {
            return this.shortcuts[key];
        },
    },
});
