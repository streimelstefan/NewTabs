import { writable, readable } from 'svelte/store';

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
    set("test");
});