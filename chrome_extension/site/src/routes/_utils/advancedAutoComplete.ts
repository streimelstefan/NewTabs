import { autocomplete } from './interface';
import config from './config'; 



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

    console.log(config.advancedAutocompleteHintSelected);

    if (command.length === 1) {
        return autocomplete.set(':' + command.join(' ') + (command.length > 1 ? "" : " ") + "[PROVIDER]");
    }

    if (command.length === 2) {
        const providers = await config.getSearchProviders();
        for (let i = 0; i < providers.length; i++) {
            console.log({
                selected: config.advancedAutocompleteHintSelected,
                provider: providers[i].name,
                command
            });
            if (config.advancedAutocompleteHintSelected === providers[i].name) {
                return autocomplete.set(':' + command.join(' ') + providers[i].name)
            }
            if (providers[i].name.startsWith(command[1]) && command[i].length !== 0) {
                command.pop();
                return autocomplete.set(':' + command.join(' ') + ' ' + providers[i].name);
            }
        };

        return autocomplete.set(':' + command.join(' ') + (command.length > 1 ? "" : " ") + "[PROVIDER]");
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
