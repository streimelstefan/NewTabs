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