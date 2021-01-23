import { backgroundAction, bingAction, categoryAction, duckduckgoAction, editAction, exportAction, googleAction, refreshAction, shortcutAction, standardAction, yahooAction } from './commands';
import db from './database';
import { getIfOnServer } from './utils';

interface Shortcut {
    key: string;
    url: string;
    name: string;
    stopFromSeeing: false;
    category: string;
    color: string;
}

interface Command {
    key: string;
    action: (query: any) => void;
    stopFromSeeing: boolean;
}

interface SearchProvider {
    name: string;
    searchPrefix: string;
}

interface SaveConfig {
    useBackgroundPhoto: boolean;
    shortCuts: Shortcut[];
    commands: Command[];
    standardSearchProvider: string;
    searchProviders: SearchProvider[];
}


class Config {

    constructor() {
        if (!getIfOnServer()) {
            this.load();
        }
    }

    /**
     * Returns the Shortcut array
     */
    public async getShortCuts() {   
        return this.shortCuts;
    }

    public async getCommands() {
        return this.commands;
    }

    public async getStandardSearchProvider() {
        return this.standardSearchProvider;
    }

    public async getSearchProviders() {
        return this.searchProviders;
    }

    public async getUseBackgroundPhoto() {
        return this.useBackgroundPhoto;
    }

    public async addShortCut(shortcut: Shortcut) {
        this.shortCuts.push(shortcut);
        await this.save();
    }

    public async setUseBackground(use: boolean) {
        this.useBackgroundPhoto = use;
        await this.save();
    }

    public async setStandardSearchProvider(searchProvider: string) {
        if (! await this.isSearchProvider(searchProvider)) {
            console.error(searchProvider + ' is not a search provider');
        }
        this.standardSearchProvider = searchProvider;
        await this.save();
    }

    public async getNextAutoComplete(search: string) {
        if (search.trimEnd() === "") {
            return "";
        }
        if (search.startsWith(':')) {
            return await this.getNextAutoCompleteCommands(search);
        }

        return await this.getNextAutoCompleteShortcuts(search);
    }

    private async save() {
        const data: SaveConfig = {
            searchProviders: this.searchProviders,
            commands: this.commands,
            shortCuts: this.shortCuts,
            standardSearchProvider: this.standardSearchProvider,
            useBackgroundPhoto: this.useBackgroundPhoto
        };

        await db.set('config', data, true);
    }

    private async getNextAutoCompleteCommands(search: string) {
        for (let i = 0; i < this.commands.length; i++) {
            if (!this.commands[i].stopFromSeeing && (':' + this.commands[i].key).startsWith(search)) {
                return ':' + this.commands[i].key;
            }
        }
    }

    private async getNextAutoCompleteShortcuts(search: string) {
        for (let i = 0; i < this.shortCuts.length; i++) {
            if (!this.shortCuts[i].stopFromSeeing && this.shortCuts[i].key.startsWith(search)) {
                return this.shortCuts[i].key;
            }
        }
    }

    private async load() {
        const data: SaveConfig = await db.get('config', true);
        if (data === null) {
            return await this.save();
        }

        this.searchProviders = data.searchProviders;
        this.commands = data.commands;
        this.shortCuts = data.shortCuts;
        this.standardSearchProvider = data.standardSearchProvider;
        this.useBackgroundPhoto = data.useBackgroundPhoto;
    }

    private async isSearchProvider(provider: string) {
        for (let i = 0; i < this.searchProviders.length; i++) {
            if (this.searchProviders[i].name === provider) return true;
        }
        return false;
    }

    private searchProviders: SearchProvider[] = [
        {
            name: 'Google',
            searchPrefix: 'https://www.google.com/search?q='
        }, 
        {
            name: 'Yahoo',
            searchPrefix: 'https://search.yahoo.com/search?p='
        },
        {
            name: 'Bing',
            searchPrefix: 'https://www.bing.com/search?q='
        },
        {
            name: 'DuckDuckGo',
            searchPrefix: 'https://duckduckgo.com/?q='
        }
    ];

    private standardSearchProvider = 'g';

    private commands = [
        {
            key: 'backgroundPhoto',
            action: backgroundAction,
            stopFromSeeing: false
        },
        {
            key: 'edit',
            action: editAction,
            stopFromSeeing: false
        },
        {
            key: 'standard',
            action: standardAction,
            stopFromSeeing: false
        },
        {
            key: 'export',
            action: exportAction,
            stopFromSeeing: false
        },
        {
            key: 'import',
            action: exportAction,
            stopFromSeeing: false
        },
        {
            key: 'cat',
            action: categoryAction,
            stopFromSeeing: false
        },
        {
            key: 'sc',
            action: shortcutAction,
            stopFromSeeing: false
        },
        {
            key: 'y',
            action: yahooAction,
            stopFromSeeing: false
        },
        {
            key: 'b',
            action: bingAction,
            stopFromSeeing: false
        },
        {
            key: 'd',
            action: duckduckgoAction,
            stopFromSeeing: false
        },
        {
            key: 'g',
            action: googleAction,
            stopFromSeeing: false
        },
        {
            key: 'r',
            action: refreshAction,
            stopFromSeeing: false
        }
    ];

    private shortCuts = [
        {
            key: 'g',
            url: 'https://www.google.com',
            name: 'Google',
            stopFromSeeing: false,
            category: null,
            color: '#FFFFFF'
        },
        {
            key: 'yt',
            url: 'https://www.youtube.com',
            name: 'Youtube',
            stopFromSeeing: false,
            category: null,
            color: '#FF0000'
        },
        {
            key: 'r',
            url: 'https://www.reddit.com',
            name: 'Reddit',
            stopFromSeeing: false,
            category: null,
            color: '#ED001C'
        }
    ];
    private useBackgroundPhoto = true;
}

let config = new Config();

export default config;
