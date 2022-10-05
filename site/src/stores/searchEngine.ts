import { defineStore } from 'pinia';
import { useDbStore } from './db';

export const useSearchEngineStore = defineStore('searchEngine', {
    state: () => {
        return {
            default: 'google',
            searchEngines: {
                google: 'https://www.google.com/search?q=',
                yahoo: 'https://search.yahoo.com/search?p=',
                bing: 'https://www.bing.com/search?q=',
                duckDuckGo: 'https://duckduckgo.com/?q=',
            },
        };
    },
    getters: {
        engines(): string[] {
            return Object.keys(this.searchEngines);
        },
    },
    actions: {
        getSearchPrefix(of: string | undefined = undefined) {
            if (of === undefined) {
                of = this.default;
            }
            // @ts-ignore
            return this.searchEngines[of];
        },
        async setDefault(engine: string) {
            this.default = engine;
            await this.save();
        },
        async save() {
            const db = useDbStore();

            await db.save('searchEngine', this.default, true);
        },
        async load() {
            const db = useDbStore();

            const defaultSe = await db.get('searchEngine', true);
            if (defaultSe) {
                this.default = defaultSe;
            }
        },
    },
});
