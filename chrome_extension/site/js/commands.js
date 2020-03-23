import { config, getSearchProviderPrefix} from "./config.js";
import { validURL } from "./utils.js";
import { refreshBackground } from './getBackground.js';

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

    chrome.storage.sync.set({ssp: config.standadSearchProvider});
}

export function shortcutAction(query) {
    const command = query.split(' ');

    if (command.length >= 3) {
        if (command[0] === 'add') {
            
            console.log(command[2]);
            if (!command[2].startsWith('http://') && !command[2].startsWith('https://')) {
                command[2] = 'http://' + command[2];
            }

            console.log(command[2]);
            console.log(validURL(command[2]));
            if (validURL(command[2])) {
                config.shortCuts.push({key: command[1], url: command[2], name: command[3] || command[1]});
                chrome.storage.sync.set({sc: config.shortCuts});
            }

            console.log(config.shortCuts);
        } else if (command[0] === 'remove') {
            config.shortCuts = config.shortCuts.filter(shortcut => {
                return !(shortcut.key === command[1] ||
                         shortcut.name === command[1] ||
                         shortcut.url == command[1]);
            });
        }
        chrome.storage.sync.set({sc: config.shortCuts});
        document.getElementById('searchText').value = '';
    }
}

export function backgroundAction(query) {
    if (query.trim() === 'on') {
        config.useBackgroundPhoto = true;
        refreshBackground();
        document.getElementById('searchText').value = '';
    } else if (query.trim() === 'off') {
        config.useBackgroundPhoto = false;
        document.querySelector('body').style.backgroundImage = '';
        document.getElementById('searchText').value = '';
    }
} 

export function refreshAction(query) {
    refreshBackground();
    document.getElementById('searchText').value = '';
} 