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
        getBestMatchingShortcut(key: string, ignoreFirst: number) {
            const scs = Object.keys(this.shortcuts);

            scs.sort(function (a, b) {
                return a.length - b.length;
            });

            let ignored = 0;
            let lastMatch = '';
            let match = '';
            for (const sc of scs) {
                if (sc.startsWith(key)) {
                    if (ignored === ignoreFirst) {
                        match = sc;
                    }
                    lastMatch = sc;
                    ignored += 1;
                }
            }

            if (!match) {
                match = lastMatch;
            }

            return { hint: match, ignored: ignored };
        },
        async checkForOldShortcuts() {
            const db = useDbStore();

            const sc = await db.get('sc', true);

            return !!sc;
        },
        async importOldShortcuts() {
            const db = useDbStore();

            // here it is not a string because I only used chrome storage then
            const sc: {
                category: string;
                color: string;
                key: string;
                name: string;
                stopFromSeeing: boolean;
                url: string;
            }[] = (await db.get('sc', true)) as unknown as {
                category: string;
                color: string;
                key: string;
                name: string;
                stopFromSeeing: boolean;
                url: string;
            }[];

            if (sc) {
                console.log(
                    'Found a old shortcut config. Converting to new one'
                );
                console.log(sc);

                sc.forEach(async (shortcut) => {
                    if (
                        !(await this.addShortcut({
                            name: shortcut.name,
                            shortcut: shortcut.key,
                            url: shortcut.url,
                        }))
                    ) {
                        console.log(
                            `Unable to import shortcut (${shortcut.name}) ${shortcut.key} -> ${shortcut.url}`
                        );
                    } else {
                        console.log(
                            `Shortcut (${shortcut.name}) ${shortcut.key} -> ${shortcut.url} imported`
                        );
                    }
                });
            }
        },
    },
});
