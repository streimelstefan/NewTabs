import { googleAction, yahooAction, duckduckgoAction, bingAction, standardAction, shortcutAction, backgroundAction, refreshAction } from './commands.js';
import { initBackground } from './getBackground.js';

Sentry.init({ 
    dsn: 'https://a3587e3b77964656bdf5942aaf34f1f6@sentry.streimel.com/5',
    release: 'newtabs@${CI_COMMIT_TAG}' // In the ci process this will be set to the App version
});

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
    useBackgroundPhoto: true
}

console.log("lul");

chrome.storage.sync.get(['ssp', 'sc', 'ubp'], (items) => {
    let ssp = items.ssp;
    let sc = items.sc;
    let ubp = items.ubp;
    if (!ssp) {
        ssp = 'Google';
        chrome.storage.sync.set({ssp: ssp});
    }

    if (!sc) {
        sc = [
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
    }

    if (!ubp) {
        ubp = true;

        chrome.storage.sync.set({ubp: ubp});
    }

    config.standadSearchProvider = ssp;
    config.shortCuts = sc;
    config.useBackgroundPhoto = ubp;
    initBackground();
    console.log(config);
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