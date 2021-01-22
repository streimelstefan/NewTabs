
enum DatabaseProvider {
    LocalStorage,
    ChromeStorage,
    CloudStorage
}

class Database {

    /**
     * The provider that should be used to save and retrieve data
     */
    public provider: DatabaseProvider;

    constructor() {

    }

    /**
     * Retrieves a entity coresponding to the path provided
     * 
     * @param path Path to the entity
     * @param syncing If the data should be returned from a syncing database or should remain local
     */
    public async get(path: string, syncing = false): Promise<any> {
        switch (this.provider) {
            case DatabaseProvider.LocalStorage:
                return await this.getFromLocalStorage(path);

            case DatabaseProvider.ChromeStorage:
                return await this.getFromChromeStorage(path, syncing);            

            case DatabaseProvider.CloudStorage:
                console.error("Provider Cloud is not supported yet");
                return null;

            default:
                break;
        }
    }

    /**
     * Saves data under a specific path
     * 
     * @param path The path under wich the data should be deposited
     * @param data The data to be deposited
     * @param syncing If the data should be returned from a syncing database or should remain local
     */
    public async set(path: string, data: any, syncing = false): Promise<boolean> {
        switch (this.provider) {
            case DatabaseProvider.LocalStorage:
                return await this.setToLocalStorage(path, data);

            case DatabaseProvider.ChromeStorage:
                return await this.setToChromeStorage(path, data, syncing);

            case DatabaseProvider.CloudStorage:
                console.error("Provider Cloud is not supported yet");
                return null;

            default:
                break;
        }
    }

    /**
     * Sets the new Provider to be used. It also migrates all data
     * from the old provider to the new one
     * 
     * @param provider The new Provider to be used
     */
    public async setProvider(provider: DatabaseProvider): Promise<boolean> {
        return true;
    }

    /**
     * Returns the provider that is currently in use
     */
    public async getProvider(): Promise<DatabaseProvider> {
        return this.provider;
    }

    /**
     * Returns the Provider that should be used from localstorage.
     */
    private async loadCurrentProvider(): Promise<DatabaseProvider> {
        return DatabaseProvider.LocalStorage;
    }

    /**
     * Loads data from LocalStorage and returns it
     * 
     * @param path Path to retrieve data from
     */
    private async getFromLocalStorage(path: string): Promise<any> {
        const data = localStorage.getItem(path);
        try {
            return JSON.parse(data);
        } catch(error) {
            console.error("Error parsing data retrieved from " + path + ". Data: " + data);
        }
    }

    /**
     * Loads data from ChromeStorage
     * 
     * @param path Path to retrieve data from
     * @param syncing Wether or not the syncing api should be used 
     */
    private async getFromChromeStorage(path: string, syncing: boolean): Promise<any> {
        return new Promise<any>((res, rej) => {
            if (syncing) {
                chrome.storage.sync.get([path], data => {
                    res(JSON.parse(data[path]));
                });
            } else {
                chrome.storage.local.get([path], data => {
                    res(JSON.parse(data[path]));
                });
            }
        });
    }

    /**
     * Saves the data to local storage
     * 
     * @param path Path where data should be saved to
     * @param data Data to be saved
     */
    private async setToLocalStorage(path: string, data: any): Promise<boolean> {F
        localStorage.setItem(path, JSON.stringify(data));
        return true;
    }

    private async setToChromeStorage(path: string, data: any, syncing: boolean): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            if (syncing) {
                chrome.storage.sync.set({[path]: JSON.stringify(data)}, () => {
                    res(true); 
                });
            } else {
                chrome.storage.local.set({[path]: JSON.stringify(data)}, () => {
                    res(true);
                });
            }
        });
    }
}

const db = new Database();

export = db;
