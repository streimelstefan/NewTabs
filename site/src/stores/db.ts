import { defineStore } from 'pinia';

enum DbProviders {
    local,
    chrome,
}

export const useDbStore = defineStore('db', {
    state: () => {
        // @ts-ignore
        if (!chrome) {
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
                        return chrome.storage.sync.set(dbObj);
                    }
                    // @ts-ignore
                    return chrome.storage.local.set(dbObj);
                }

                localStorage.setItem(key, value);
            });
        },
        get(key: string, sync: boolean = false): Promise<string | null> {
            return new Promise<string | null>((res, rej) => {
                if (this.dbProvider === DbProviders.chrome) {
                    if (sync) {
                        // @ts-ignore
                        return chrome.storage.sync.get(
                            [key],
                            (data: string) => {
                                res(data);
                            }
                        );
                    }

                    // @ts-ignore
                    return chrome.storage.sync.get([key], (data: string) => {
                        res(data);
                    });
                }

                res(localStorage.getItem(key));
            });
        },
    },
});
