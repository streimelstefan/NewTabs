import { clearInterface } from './interface';
import { backgroundAction, bingAction, categoryAction, duckduckgoAction, editAction, exportAction, googleAction, refreshAction, shortcutAction, setStandardSearchProviderAction, yahooAction, importAction } from './commands';
import db from './database';
import { getIfOnServer } from './utils';
import { backgroundAutoComplete, editAutoComplete, setStandardSearchProviderAutoComplete, exportAutoComplete, importAutoComplete, categoryAutoComplete, shortcutAutoComplete, yahooAutoComplete, bingAutoComplete, duckduckgoAutoComplete, googleAutoComplete, refreshAutoComplete } from './advancedAutoComplete';

interface Shortcut {
    key: string;
    url: string;
    name: string;
    stopFromSeeing: boolean;
    category: string;
    color: string;
}

interface Command {
    key: string;
    action: (query: string[]) => Promise<boolean>;
    stopFromSeeing: boolean;
}

interface SearchProvider {
    name: string;
    searchPrefix: string;
}

interface SaveConfig {
    useBackgroundPhoto: boolean;
    shortCuts: Shortcut[];
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

    public async isCommandStart(input: string) {
        input = input.slice(1, input.length);
        input = input.split(' ')[0];
        for (let i = 0; i < this.commands.length; i++) {
            if (input === this.commands[i].key) {
                return true;
            }
        }
        return false;
    }

    public async getSearchProviderPrefixOf(provider: string): Promise<string> {
        const wantedProvider = await this.getSearchProvider(provider);

        if (wantedProvider !== undefined) {
            return wantedProvider.searchPrefix;
        }
        return "";
    }

    public async getSearchProvider(provider: string): Promise<SearchProvider | null> {
        if (await this.isSearchProvider(provider)) {
            for (let i = 0; i < this.searchProviders.length; i++) {
                if (this.searchProviders[i].name === provider) 
                    return this.searchProviders[i];
            }
            return null;
        }
    }

    public async getCommandOfKey(key: string) {
        for (let i = 0; i < this.commands.length; i++) {
            if (this.commands[i].key === key) {
                return this.commands[i];
            }
        }
    }

    private async save() {
        const data: SaveConfig = {
            searchProviders: this.searchProviders,
            shortCuts: this.shortCuts,
            standardSearchProvider: this.standardSearchProvider,
            useBackgroundPhoto: this.useBackgroundPhoto
        };

        await db.set('config', data, true);
    }

    public async executeCommand(command: string) {
        command = command.slice(1, command.length);
        for (let i = 0; i < this.commands.length; i++) {
            const commandParts = command.split(' ');
            if (this.commands[i].key === commandParts[0]) {
                commandParts.shift();
                if (await this.commands[i].action(commandParts)) {
                    clearInterface.set(true);
                }
            }
        }
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
        this.shortCuts = data.shortCuts;
        this.standardSearchProvider = data.standardSearchProvider;
        this.useBackgroundPhoto = data.useBackgroundPhoto;
    }

    public async isSearchProvider(provider: string) {
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

    private standardSearchProvider = 'Google';

    private commands = [
        {
            key: 'backgroundPhoto',
            action: backgroundAction,
            autoComplete: backgroundAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'edit',
            action: editAction,
            autoComplete: editAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'standard',
            action: setStandardSearchProviderAction,
            autoComplete: setStandardSearchProviderAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'export',
            action: exportAction,
            autoComplete: exportAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'import',
            action: importAction,
            autoComplete: importAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'cat',
            action: categoryAction,
            autoComplete: categoryAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'sc',
            action: shortcutAction,
            autoComplete: shortcutAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'y',
            action: yahooAction,
            autoComplete: yahooAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'b',
            action: bingAction,
            autoComplete: bingAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'd',
            action: duckduckgoAction,
            autoComplete: duckduckgoAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'g',
            action: googleAction,
            autoComplete: googleAutoComplete,
            stopFromSeeing: false
        },
        {
            key: 'r',
            action: refreshAction,
            autoComplete: refreshAutoComplete,
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
