import { googleAction, exportAction, yahooAction, duckduckgoAction, bingAction, standardAction, shortcutAction, backgroundAction, refreshAction, editAction, categoryAction } from './commands.js';
import { initBackground } from './getBackground.js';
import { removeCategories } from './shortcutCategories.js';
import { hideShortcutInfo } from './searchField.js';

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
            key: 'hintergrundBild',
            action: backgroundAction,
            stopFromSeeing: false
        },
        {
            key: 'bearbeiten',
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
            key: 'kat',
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
    ],
    shortCuts: [],
    categories: [],
    useBackgroundPhoto: true
}


chrome.storage.sync.get(['ssp', 'sc', 'ubp', 'cat'], (items) => {
    Sentry.addBreadcrumb({
        category: 'startup',
        message: 'Parsing users config',
        level: Sentry.Severity.Info 
    });
    let ssp = items.ssp;
    let sc = items.sc;
    let ubp = items.ubp;
    let cat = items.cat;
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
        ]

        chrome.storage.sync.set({sc: sc});
    }

    if (!ubp && ubp !== false) {
        ubp = true;

        chrome.storage.sync.set({ubp: ubp});
    }

    if (!cat) {
        cat = [],
        chrome.storage.sync.set({cat: cat});
    }

    config.standadSearchProvider = ssp;
    config.shortCuts = sc;
    config.useBackgroundPhoto = ubp;
    config.categories = cat;

    Sentry.addBreadcrumb({
        category: 'startup',
        message: 'Finished parsing users config',
        data: {
            standardSearchProvider: ssp,
            shortCuts: sc,
            useBackgroundPhoto: ubp,
            categories: cat
        },
        levle: Sentry.Severity.Info 
    });

    console.log(config);
    initBackground();
    removeCategories();
    hideShortcutInfo();
});

export function getSearchProviderPrefix(name) {
    let prefix = null;
    config.searchproviders.forEach(provider => {
        if (provider.name === name) {
            prefix = provider.searchPrefix;
        }
    });
    if (prefix === null) {
        Sentry.addBreadcrumb({
            category: 'search',
            message: 'Was not able to find a coresponding Searchprovider prefix',
            level: Sentry.Severity.error,
            data: {
                askedProviderName: name,
                registeredSearchProviders: config.searchproviders
            }
        })
    }
    return prefix;
}