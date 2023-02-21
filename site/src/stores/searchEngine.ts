/**
 * @file Contains the logic to save, delete, modify and find search engines and the default search engine.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { defineStore } from 'pinia';
import { useDbStore } from './db';

/**
 * Saves the backgournd
 * @summary Contains logic to decides how a search query should be handled.
 * @author Streimel Stefan
 * @since 4.3.0
 * @constant
 */
export const useSearchEngineStore = defineStore('searchEngine', {
  state: () => {
    return {
      default: 'google',
      searchEngines: {
        google: 'https://www.google.com/search?q=',
        yahoo: 'https://search.yahoo.com/search?p=',
        bing: 'https://www.bing.com/search?q=',
        duckDuckGo: 'https://duckduckgo.com/?q=',
      } as Record<string, string>,
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
      if (!this.searchEngines[of]) {
        of = this.default;
      }

      // @ts-ignore
      return this.searchEngines[of];
    },
    async setDefault(engine: string) {
      if (!this.searchEngines[engine]) {
        return console.error(`Search engine ${engine} does not exist!`);
      }
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
        await this.setDefault(defaultSe);
      }
    },
  },
});
