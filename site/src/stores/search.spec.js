import { describe, expect, test, beforeEach } from 'vitest';
import { SearchAction, useSearchStore } from './search';
import { setActivePinia, createPinia } from 'pinia';
import { useShortcutStore } from './shortcuts';
import { useSearchEngineStore } from './searchEngine';

describe('searchStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('search', () => {
    beforeEach(() => {
      delete window.location;
      window.location = new URL('http://example.com');
    });

    test('https://google.com should redirect to https://google.com', () => {
      const search = useSearchStore();

      search.search('https://google.com');

      expect(window.location.href).toEqual('https://google.com/');
    });

    test('google.com should redirect to http://google.com', () => {
      const search = useSearchStore();

      search.search('google.com');

      expect(window.location.href).toEqual('http://google.com/');
    });

    test('youtube.com/test should redirect to http://youtube.com/test', () => {
      const search = useSearchStore();

      search.search('youtube.com/test');

      expect(window.location.href).toEqual('http://youtube.com/test');
    });

    test('https://youtube.at/test2 should redirect to https://youtube.at/test2', () => {
      const search = useSearchStore();

      search.search('https://youtube.at/test2');

      expect(window.location.href).toEqual('https://youtube.at/test2');
    });

    test('youtube.de#something-interesting should redirect to http://youtube.de/#something-interesting', () => {
      const search = useSearchStore();

      search.search('youtube.de#something-interesting');

      expect(window.location.href).toEqual(
        'http://youtube.de/#something-interesting'
      );
    });

    test('https://youtube.cz/#something should redirect to https://youtube.cz/#something', () => {
      const search = useSearchStore();

      search.search('https://youtube.cz/#something');

      expect(window.location.href).toEqual('https://youtube.cz/#something');
    });

    test('https://youtube.cz/?split=true should redirect to https://youtube.cz/?split=true', () => {
      const search = useSearchStore();

      search.search('https://youtube.cz/?split=true');

      expect(window.location.href).toEqual('https://youtube.cz/?split=true');
    });

    test('youtube.xyz/?split=true should redirect to http://youtube.xyz/?split=true', () => {
      const search = useSearchStore();

      search.search('youtube.xyz/?split=true');

      expect(window.location.href).toEqual('http://youtube.xyz/?split=true');
    });

    test('youtube.xyz/test#something?split=true should redirect to http://youtube.xyz/test#somthing?split=true', () => {
      const search = useSearchStore();

      search.search('youtube.xyz/test#something?split=true');

      expect(window.location.href).toEqual(
        'http://youtube.xyz/test#something?split=true'
      );
    });

    test('https://youtube.xyz/test#somthing?split=true should redirect to https://youtube.xyz/test#somthing?split=true', () => {
      const search = useSearchStore();

      search.search('https://youtube.xyz/test#somthing?split=true');

      expect(window.location.href).toEqual(
        'https://youtube.xyz/test#somthing?split=true'
      );
    });

    test('localhost should redirect to http://localhost/', () => {
      const search = useSearchStore();

      search.search('localhost');

      expect(window.location.href).toEqual('http://localhost/');
    });

    test('https://localhost should redirect to https://localhost/', () => {
      const search = useSearchStore();

      search.search('https://localhost');

      expect(window.location.href).toEqual('https://localhost/');
    });

    test('localhost:5432 should redirect to http://localhost:5432/', () => {
      const search = useSearchStore();

      search.search('localhost:5432');

      expect(window.location.href).toEqual('http://localhost:5432/');
    });

    test('https://localhost:5432 should redirect to https://localhost:5432/', () => {
      const search = useSearchStore();

      search.search('https://localhost:5432');

      expect(window.location.href).toEqual('https://localhost:5432/');
    });

    test('"this_is_a_search" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('this_is_a_search');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('this_is_a_search')).toBeTruthy();
    });

    test('"Error:test" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('Error:test');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('Error:test')).toBeTruthy();
    });

    test('"Error%test" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('Error%test');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('Error%test')).toBeTruthy();
    });

    test('"Error#test" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('Error#test');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('Error#test')).toBeTruthy();
    });

    test('"Error?test" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('Error?test');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('Error?test')).toBeTruthy();
    });

    test('"search for .error" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search('search for .error');

      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(
        window.location.href.includes('search%20for%20.error')
      ).toBeTruthy();
    });

    test('" test.txt" should be searched with the default search engine', () => {
      const search = useSearchStore();
      const searchEngine = useSearchEngineStore();

      search.search(' test.txt');

      console.log(window.location.href);
      console.log(searchEngine.getSearchPrefix());
      expect(
        window.location.href.includes(searchEngine.getSearchPrefix())
      ).toBeTruthy();
      expect(window.location.href.includes('%20test.txt')).toBeTruthy();
    });
  });
});
