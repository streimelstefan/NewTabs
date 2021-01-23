import { writable, readable } from 'svelte/store';
import config from './config';
import { getIfOnServer } from '../_utils/utils';
import { getIfImgIsTooOld } from './background';
import { doAdvancedAutoComplete } from './advancedAutoComplete'

export const interfaceValue = writable("");

export const clock = readable(getTimeString(new Date()), set => {
    const interval = setInterval(() => {
        const date = new Date();
        

        set(getTimeString(date));
	}, 1000);

	return () => clearInterval(interval);
});

export const autocomplete = writable("", set => {
    const interfaceValueUnsubscribe = interfaceValue.subscribe(data => {
        if (data === null || data === undefined) {
            return;
        }
        if (config.advancedAutocompleteActive) {
            doAdvancedAutoComplete(data);
            return;
        }
        config.getNextAutoComplete(data).then(autocomplete => {
            set(autocomplete);
        });
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
    if (value.startsWith(':')) {
        return config.executeCommand(value);
    }
    parseSearch(value);
}

async function parseSearch(search: string) {
    window.location.href = await config.getSearchProviderPrefixOf( await config.getStandardSearchProvider()) + search;
}