import { defineStore } from 'pinia';
import type { VNodeNormalizedChildren } from 'vue';

export enum DbProviders {
  local,
  chrome,
}

export const useDbStore = defineStore('db', {
  state: () => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      return {
        dbProvider: DbProviders.local,
      };
    }

    return {
      dbProvider: DbProviders.chrome,
    };
  },
  actions: {
    save(
      key: string,
      value: string,
      sync: boolean = false
    ): Promise<undefined> {
      return new Promise<undefined>((res, rej) => {
        if (this.dbProvider === DbProviders.chrome) {
          const dbObj: any = {};
          dbObj[key] = value;
          if (sync) {
            // @ts-ignore
            return res(chrome.storage.sync.set(dbObj));
          }
          // @ts-ignore
          return res(chrome.storage.local.set(dbObj));
        }

        localStorage.setItem(key, value);
        res(undefined);
      });
    },
    get(key: string, sync: boolean = false): Promise<string | null> {
      return new Promise<string | null>((res, rej) => {
        if (this.dbProvider === DbProviders.chrome) {
          if (sync) {
            // @ts-ignore
            return chrome.storage.sync.get([key], (data: object) => {
              if (Object.keys(data).length === 0) {
                res(null);
              }
              // @ts-ignore
              res(data[key]);
            });
          }

          // @ts-ignore
          return chrome.storage.local.get([key], (data: string) => {
            if (Object.keys(data).length === 0) {
              res(null);
            }
            // @ts-ignore
            res(data[key]);
          });
        }

        res(localStorage.getItem(key));
      });
    },
    remove(key: string, sync: boolean = false) {
      return new Promise<void>((res, rej) => {
        if (this.dbProvider === DbProviders.chrome) {
          if (sync) {
            return chrome.storage.sync.remove([key], () => {
              res();
            });
          }

          return chrome.storage.local.remove([key], () => {
            res();
          });
        }

        res(localStorage.removeItem(key));
      });
    },
  },
});
