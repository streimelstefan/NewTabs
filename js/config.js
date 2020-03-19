import { googleAction, yahooAction, duckduckgoAction, bingAction, standardAction, shortcutAction } from './commands.js';

let ssp = window.localStorage.getItem('ssp');
if (!ssp) {
    ssp = 'Google';
    window.localStorage.setItem('ssp', ssp);
}

let sc = window.localStorage.getItem('sc');
if (!sc) {
    sc = [
        {
            key: 'g',
            url: 'https://www.google.com',
            name: 'Google'
        },
        {
            key: 'yt',
            url: 'https://www.youtube.com',
            name: 'Youtube'
        },
        {
            key: 'r',
            url: 'https://www.reddit.com',
            name: 'Reddit'
        }
    ]
} else {
    sc = JSON.parse(sc);
}

export const config = {
    searchproviders: [
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
    ],
    standadSearchProvider: ssp,
    commands: [
        {
            key: 'g',
            action: googleAction
        },
        {
            key: 'y',
            action: yahooAction
        },
        {
            key: 'd',
            action: duckduckgoAction
        },
        {
            key: 'b',
            action: bingAction
        },
        {
            key: 'standard',
            action: standardAction
        }, 
        {
            key: 'sc',
            action: shortcutAction
        }
    ],
    shortCuts: sc
}

console.log(config);

export function getSearchProviderPrefix(name) {
    let prefix = null;
    config.searchproviders.forEach(provider => {
        if (provider.name === name) {
            prefix = provider.searchPrefix;
        }
    });
    return prefix;
}