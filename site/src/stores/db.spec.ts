import { describe, expect, it, beforeEach } from 'vitest';
import { useDbStore, DbProviders } from './db';
import { setActivePinia, createPinia } from 'pinia';

describe('useDbStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with the correct db provider', () => {
    const store = useDbStore();
    expect(store.dbProvider).toEqual(
      typeof chrome === 'undefined' || !chrome.storage
        ? DbProviders.local
        : DbProviders.chrome
    );
  });

  it('should save data to the correct storage location', async () => {
    const store = useDbStore();
    const key = 'test_key';
    const value = 'test_value';

    // Save to local storageq
    await store.save(key, value, false);
    expect(localStorage.getItem(key)).toEqual(value);

    // Save to sync storage (if available)
    if (store.dbProvider === DbProviders.chrome) {
      await store.save(key, value, true);
      expect(
        await new Promise((res) =>
          // @ts-ignore
          chrome.storage.sync.get([key], (data: any) => res(data[key]))
        )
      ).toEqual(value);
    }
  });

  it('should retrieve data from the correct storage location', async () => {
    const store = useDbStore();
    const key = 'test_key';
    const value = 'test_value';

    // Save to local storage
    localStorage.setItem(key, value);
    expect(await store.get(key, false)).toEqual(value);

    // Save to sync storage (if available)
    if (store.dbProvider === DbProviders.chrome) {
      await new Promise((res) =>
        // @ts-ignore
        chrome.storage.sync.set({ [key]: value }, () => res())
      );
      expect(await store.get(key, true)).toEqual(value);
    }
  });

  it('should remove data from the correct storage location', async () => {
    const store = useDbStore();
    const key = 'test_key';
    const value = 'test_value';

    // Save to local storage
    localStorage.setItem(key, value);
    await store.remove(key, false);
    expect(localStorage.getItem(key)).toBeNull();

    // Save to sync storage (if available)
    if (store.dbProvider === DbProviders.chrome) {
      await new Promise((res) =>
        // @ts-ignore
        chrome.storage.sync.set({ [key]: value }, () => res())
      );
      await store.remove(key, true);
      expect(
        await new Promise((res) =>
          // @ts-ignore
          chrome.storage.sync.get([key], (data: any) => res(data[key]))
        )
      ).toBeUndefined();
    }
  });
});
