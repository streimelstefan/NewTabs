import { writable, readable } from 'svelte/store';
import config from './config';
import { getIfOnServer } from '../_utils/utils';
import { getIfImgIsTooOld } from './background';

export const interfaceValue = writable("");

export const clock = readable("", set => {
    const interval = setInterval(() => {
        const date = new Date();
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

        set(`${hours}:${minutes}:${seconds}`);
	}, 1000);

	return () => clearInterval(interval);
});

export const autocomplete = readable("", set => {
    const interfaceValueUnsubscribe = interfaceValue.subscribe(data => {
        if (data === null || data === undefined) {
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