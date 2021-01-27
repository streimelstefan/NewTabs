import { keys, keysInited, autocomplete } from './interface';
import config from './config'; 
import {readable} from 'svelte/store';

let setAutocompleteHintTop;
let setAutocompleteHintBottom;
let setAutocompleteHint;

export const autocompleteHintsTop = readable(null, (set) => {
    setAutocompleteHintTop = set;
});

export const autocompleteHintsBottom = readable(null, (set) => {
    setAutocompleteHintBottom = set;
});

export const autoCompleteHint = readable(null, (set) => {
    setAutocompleteHint = set;
});

export async function doAdvancedAutoComplete(query: string) {
    query = query.slice(1, query.length);
    const commandParts = query.split(' ');
    const command = await config.getCommandOfKey(commandParts[0])
    if (command !== undefined) {
        await command.autoComplete(commandParts);
    }
}

export async function backgroundAutoComplete(command: string[]) {

}

export async function editAutoComplete(command: string[]) {

}

export async function setStandardSearchProviderAutoComplete(command: string[]) {
    autocomplete.set(':' + command[0] + ' [ProviderName]');

    if (command.length === 1 || command.length === 2 && command[1].length === 0) {
        return autocomplete.set(':' + command.join(' ') + (command.length > 1 ? "" : " ") + "[PROVIDER]");
    }

    if (command.length === 2 && command[1].length !== 0) {
        const providers = await config.getSearchProviders();
        for (let i = 0; i < providers.length; i++) {
            if (providers[i].name.startsWith(command[1])) {
                command.pop();
                return autocomplete.set(':' + command.join(' ') + ' ' + providers[i].name);
            }
        };
    }

    console.log(command);

    return autocomplete.set(':' + command.join(' ') + ' !ERROR!');
}

export async function exportAutoComplete(command: string[]) {

}

export async function importAutoComplete(command: string[]) {

}

export async function categoryAutoComplete(command: string[]) {

}

export async function shortcutAutoComplete(command: string[]) {

}

export async function yahooAutoComplete(command: string[]) {

}

export async function bingAutoComplete(command: string[]) {

}

export async function duckduckgoAutoComplete(command: string[]) {

}

export async function googleAutoComplete(command: string[]) {

}

export async function refreshAutoComplete(command: string[]) {

}
