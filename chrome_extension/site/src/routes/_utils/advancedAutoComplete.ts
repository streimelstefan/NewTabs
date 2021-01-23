import config from './config'; 
import { autocomplete } from './interface';

export async function doAdvancedAutoComplete(query: string) {
    query.trim();
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
    console.log(command);
    console.log(command[1].length);
    if (command.length === 2 && command[1].length === 0) {
        return autocomplete.set(':' + command[0] + ' [ProviderName]');
    }

    if (command.length === 2 && command[1].length !== 0) {
        const providers = await config.getSearchProviders();
        for (let i = 0; i < providers.length; i++) {
            if (providers[i].name.startsWith(command[1])) {
                return autocomplete.set(':' + command[0] + ' ' + providers[i].name);
            }
        };
    }

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
