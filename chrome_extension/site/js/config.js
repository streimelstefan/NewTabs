import { googleAction, yahooAction, duckduckgoAction, bingAction, standardAction, shortcutAction, backgroundAction, refreshAction } from './commands.js';
import { initBackground } from './getBackground.js';

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
    standadSearchProvider: "Google",
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
        },
        {
            key: 'r',
            action: refreshAction
        },
        {
            key: 'bgp',
            action: backgroundAction
        }
    ],
    shortCuts: [],
    useBackgroundPhoto: true,
    lastImageGrap: null
}

console.log("lul");

chrome.storage.sync.get(['ssp', 'sc'], (items) => {
    if (!items.ssp) {
        const ssp = 'Google';
        chrome.storage.sync.set({ssp: ssp});
        config.standadSearchProvider = ssp;
    }

    if (!items.sc) {
        const sc = [
            {
                key: 'g',
                url: 'https://www.google.com',
                name: 'Google',
                stopFromSeeing: false
            },
            {
                key: 'yt',
                url: 'https://www.youtube.com',
                name: 'Youtube',
                stopFromSeeing: false
            },
            {
                key: 'r',
                url: 'https://www.reddit.com',
                name: 'Reddit',
                stopFromSeeing: false
            }
        ]

        chrome.storage.sync.set({sc: sc});
        config.shortCuts = sc;
    }

    config.standadSearchProvider = items.ssp;
    config.shortCuts = items.sc;
    console.log(config);
});

chrome.storage.local.get(['LIG'], items => {
    config.lastImageGrap = items.LIG;
    initBackground();
});



export function getSearchProviderPrefix(name) {
    let prefix = null;
    config.searchproviders.forEach(provider => {
        if (provider.name === name) {
            prefix = provider.searchPrefix;
        }
    });
    return prefix;
}