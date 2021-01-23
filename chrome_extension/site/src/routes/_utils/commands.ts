import { element } from 'svelte/internal';
import config from './config';

export async function googleAction(query: string[]) {
    window.location.href = await config.getSearchProviderPrefixOf('Google') + query.join(' ');
    return true;
}

export async function yahooAction(query: string[]) {
    window.location.href = await config.getSearchProviderPrefixOf('Yahoo') + query.join(' ');
    return true;
}

export async function duckduckgoAction(query: string[]) {
    window.location.href = await config.getSearchProviderPrefixOf('DuckDuckGo') + query.join(' ');
    return true;
}

export async function bingAction(query: string[]) {
    window.location.href = await config.getSearchProviderPrefixOf('Bing') + query.join(' ');
    return true;
}

export function setStandardSearchProviderAction(query: string[]) {
    if (query.length > 1) {
        console.warn("To many elements in command only using first one");
    }
    if (query.length < 1) {
        console.error("To little parameters. setStandardSearchProvider needs at least on parameter in query");
        return;
    } 

    if (config.isSearchProvider(query[0])) {
        config.setStandardSearchProvider(query[0]);
        console.log("Standard search provider set");
        return true;
    } else {
        console.error("Searchprovider " + query[0] + "does not exist");
        return false;
    }
}

export function shortcutAction(query: string[]) {
    return true;
}

export function backgroundAction(query: string[]) {
    return true;
}

export function refreshAction(query: string[]) {
    return true;
} 

export function editAction(query: string[]) {
    return true;
}

export function categoryAction(query: string[]) {
    return true;
}

export function exportAction(query: string[]) {
    return true;
}

export function importAction(query: string[]) {
    return true;
}
