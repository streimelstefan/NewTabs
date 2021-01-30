import { writable, readable } from 'svelte/store';
import config from './config';
import { getIfOnServer } from '../_utils/utils';
import { doAdvancedAutoComplete, setStandardSearchProviderAutoComplete } from './advancedAutoComplete'

export const interfaceValue = writable("");

export const clock = readable(getTimeString(new Date()), set => {
    const interval = setInterval(() => {
        const date = new Date();
        

        set(getTimeString(date));
	}, 1000);

	return () => clearInterval(interval);
});

let autocompleteSet;
let lastInterfaceValue = "";

export async function calculateAutocomplete(data: string) {
    if (data === null || data === undefined) {
        return;
    }

    lastInterfaceValue = data;

    if (await config.isCommandStart(data)) {
        doAdvancedAutoComplete(data);
        return;
    }
    config.getNextAutoComplete(data).then(autocomplete => {
        autocompleteSet(autocomplete);
    });
}

export async function reCalculateAutocomplete() {
    calculateAutocomplete(lastInterfaceValue);
}

export const autocomplete = writable("", set => {
    autocompleteSet = set;
    const interfaceValueUnsubscribe = interfaceValue.subscribe(data => {
        calculateAutocomplete(data);
    });
    
    return () => {
        interfaceValueUnsubscribe();
    }
});

export const keys = readable(null, set => {
    if (!getIfOnServer()) {
        document.addEventListener('keyup', event => {
            set(event);
        });
    }
});

export const length = writable(0);


function getTimeString(date: Date): string {
    let seconds = '';
    let minutes = '';
    let hours = '';

    if (date.getSeconds() < 10) {
        seconds = '0' + date.getSeconds();
    } else {
        seconds = '' + date.getSeconds();
    }

    if (date.getMinutes() < 10) {
        minutes = '0' + date.getMinutes();
    } else {
        minutes = '' + date.getMinutes();
    }

    if (date.getHours() < 10) {
        hours = '0' + date.getHours();
    } else {
        hours = '' + date.getHours();
    }

    return `${hours}:${minutes}:${seconds}`;
}

export const clearInterface = writable(false);

export async function parseInterfaceValue(value: string) {
    if (value === undefined) return;
    if (value.startsWith(':')) {
        return config.executeCommand(value);
    }
    parseSearch(value);
}

async function parseSearch(search: string) {
    window.location.href = await config.getSearchProviderPrefixOf( await config.getStandardSearchProvider()) + search;
}