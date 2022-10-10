import { defineStore } from 'pinia';

enum DbProviders {
    local,
    chrome,
}

export const useDbStore = defineStore('db', {
    state: () => {
        // @ts-ignore
        if (!chrome.storage) {
            console.log('Db provider set to localhost');
            return {
                dbProvider: DbProviders.local,
            };
        }

        console.log('Db provider set to chrome storage');
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
                        return chrome.storage.sync.get(
                            [key],
                            (data: object) => {
                                if (Object.keys(data).length === 0) {
                                    res(null);
                                }
                                // @ts-ignore
                                res(data[key]);
                            }
                        );
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
    },
});
