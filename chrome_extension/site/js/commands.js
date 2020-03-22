import { config, getSearchProviderPrefix} from "./config.js";
import { validURL } from "./utils.js";

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
    const command = query.split(' ');

    if (command.length >= 3) {
        if (command[0] === 'add') {
            
            if (!command[2].startsWith('http://') || command[2].startsWith('https://')) {
                command[2] = 'http://' + command[2];
            }

            if (validURL(command[2])) {
                config.shortCuts.push({key: command[1], url: command[2], name: command[3] || command[1]});
            }

            console.log(config.shortCuts);
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