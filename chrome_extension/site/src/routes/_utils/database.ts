
enum DatabaseProvider {
    Localhost,
    ChromeStorage,
    Cloud
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
     */
    public async get(path: string): Promise<any> {

    }

    /**
     * Saves data under a specific path
     * 
     * @param path The path under wich the data should be deposited
     * @param data The data to be deposited
     */
    public async set(path: string, data: any): Promise<boolean> {
        return true;
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
        return DatabaseProvider.Localhost;
    }

    /**
     * Returns the Provider that should be used from localstorage.
     */
    private async loadCurrentProvider(): Promise<DatabaseProvider> {
        return DatabaseProvider.Localhost;
    }
}

const db = new Database();

export = db;
