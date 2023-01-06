/**
 * @file Contains the logic of what query should exepcute what search action.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { defineStore } from 'pinia';
import { useSearchEngineStore } from './searchEngine';
import { useShortcutStore } from './shortcuts';

import { parseURL, type URLRecord } from 'whatwg-url';

/**
 * Represents the actions that can be taken for a search query
 *
 * - search: The query should be appended to the default search engine
 * - site: The query should be used as url for the site
 * - siteWithoutProtocol: The query should be used as url for the site but the protocol still needs to be added
 * - shortcut: The query represents a shortcut key. The shortcut should be resolved and the url of the shortcut should be used as the new site url
 * @enum
 * @readonly
 * @author Streimel Stefan
 * @since 4.3.0
 */
export enum SearchAction {
  search,
  site,
  siteWithoutProtocol,
  shortcut,
}

enum UrlParseMode {
  url,
  urlWithoutProtocol,
  noUrl,
}

/**
 * Decides how a search query should be handled. There are three different types of ways a
 * query can be handeled.
 *
 * They are:
 *
 * - if the query represents a url or localhost
 *   - the query will be used as api for the tab
 * - if the query is the key of a shortcut
 *   - the shortcut will be resolved and the shortcut url will be used as the new url
 * - if the query is none of the above
 *   - the query will be treated as a search term and will be appended to the default search query
 * @summary Contains logic to decides how a search query should be handled.
 * @author Streimel Stefan
 * @since 4.3.0
 * @constant
 */
export const useSearchStore = defineStore('search', {
  getters: {},
  actions: {
    /**
     * Looks at the query and decides what search action should be called.
     *
     * There are currently three different actions that can be called:
     *
     *  - If the query is a valid url: `SearchAction.site`
     *    - The query should be just opened in a new tab with the query as the url.
     *  - If the query is a shortcut key: `SearchAction.shortcut`
     *    - The query represents a shortcut and the url that should be opend can be gotten from the `shortcutsStore`
     *  - If the sites does not match anything above then the query is: `SearchAction.search`
     *    - The query should be appended to the search provided that should be gotten from the `searchEngineStore`
     *
     * @param query The query that should be evaluated
     */
    _getQueryAction(query: string): SearchAction {
      // check if the query is a shortcut
      const shortcutStore = useShortcutStore();
      if (shortcutStore.getByKey(query)) {
        return SearchAction.shortcut;
      }

      // check if the query is a url
      const isUrl = this._isUrl(query);
      if (isUrl === UrlParseMode.url) return SearchAction.site;

      if (isUrl === UrlParseMode.urlWithoutProtocol)
        return SearchAction.siteWithoutProtocol;

      return SearchAction.search;
    },

    /**
     * Looks at the query provided and returns true if the query represents a url.
     * @param query The query that should be eveluated
     * @returns true if the query is a url
     */
    _isUrl(query: string): UrlParseMode {
      let url: URLRecord | null = null;
      let parseMode = UrlParseMode.noUrl;

      try {
        url = parseURL(query);
        parseMode = UrlParseMode.url;
      } catch (error) {}

      // add protocol to detect sites that dont have their protocol if first parse failed
      if (url === null) {
        try {
          url = parseURL('http://' + query);
          parseMode = UrlParseMode.urlWithoutProtocol;
        } catch (error) {}
      }

      // if the url is undefined the parse failed!
      if (!url) return UrlParseMode.noUrl;

      // "localhost" is a special case and needs to be true as well
      if (url.host === 'localhost') return parseMode;

      // if the port is specified on localhost, localhost will be detected as the protocol
      // so we need to check that too...
      if (url.scheme === 'localhost') return UrlParseMode.urlWithoutProtocol;

      if (url.host === null) return UrlParseMode.noUrl;

      // check wheter the host has at least two parts.
      // if we would not check this stuff like: "error: this is an error"
      // would be valid
      if (typeof url.host === 'string' && url.host.split('.').length !== 2)
        return UrlParseMode.noUrl;

      return parseMode;
    },

    /**
     * Searches for the query string.
     *
     * ! After this function is called the tab will switch sides so no more functions can be called afterwards!
     *
     * Depending on the query different actions will occur.
     * There are currently three different actions that can be called:
     *
     *  - If the query is a valid url: `SearchAction.site`
     *    - The query should be just opened in a new tab with the query as the url.
     *  - If the query is a shortcut key: `SearchAction.shortcut`
     *    - The query represents a shortcut and the url that should be opened can be gotten from the `shortcutsStore`
     *  - If the sites does not match anything above then the query is: `SearchAction.search`
     *    - The query should be appended to the search provided that should be gotten from the `searchEngineStore`
     * @param query The query that should be searched for.
     * @summary Decides how the query provided should be handled
     * @since 4.3.0
     * @author Streimel Stefan
     * @public
     */
    search(query: string): void {
      const action = this._getQueryAction(query);
      switch (action) {
        case SearchAction.search:
          return this._searchFor(query);
        case SearchAction.site:
          return this._goToSite(query);
        case SearchAction.siteWithoutProtocol:
          return this._goToSite('http://' + query);
        case SearchAction.shortcut:
          return this._gotToShortcut(query);
      }
    },

    _goToSite(url: string) {
      window.location.href = url;
    },
    _searchFor(query: string) {
      const searchEngine = useSearchEngineStore();

      window.location.href =
        searchEngine.getSearchPrefix() + encodeURIComponent(query);
    },
    _gotToShortcut(shortcutKey: string) {
      const shortcutStore = useShortcutStore();

      const shortcut = shortcutStore.getByKey(shortcutKey);

      if (!shortcut) {
        return;
      }

      window.location.href = shortcut.url;
    },
  },
});
