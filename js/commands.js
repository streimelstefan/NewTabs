import { config, getSearchProviderPrefix} from "./config.js";

export function googleAction(query) {
    const searchQuery = getSearchProviderPrefix('Google') + query;

    window.location.href = searchQuery;
}

export function yahooAction(query) {
    const searchQuery = getSearchProviderPrefix('Yahoo') + query;

    window.location.href = searchQuery;
}

export function duckduckgoAction(query) {
    const searchQuery = getSearchProviderPrefix('DuckDuckGo') + query;

    window.location.href = searchQuery;
}

export function bingAction(query) {
    const searchQuery = getSearchProviderPrefix('Bing') + query;

    window.location.href = searchQuery;
}

export function standardAction(query) {
    query = query.replace(/ /g,'');

    config.searchproviders.forEach(provider => {
        if (provider.name.toUpperCase() === query.toUpperCase()) {
            config.standadSearchProvider = provider.name;
            document.getElementById('searchText').value = '';
        }
    });

    window.localStorage.setItem('ssp', config.standadSearchProvider);
}

export function shortcutAction(query) {
    console.log(query);
    const command = query.split(' ');

    if (command.length >= 3) {
        if (command[0] === 'add') {
            config.shortCuts.push({key: command[1], url: command[2], name: command[3] || command[1]});
        } else if (command[0] === 'remove') {
            config.shortCuts = config.shortCuts.filter(shortcut => {
                return !(shortcut.key === command[1] ||
                         shortcut.name === command[1] ||
                         shortcut.url == command[1]);
            });
        }
        window.localStorage.setItem('sc', JSON.stringify(config.shortCuts));
        document.getElementById('searchText').value = '';
    }
}