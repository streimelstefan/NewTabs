import { config, getSearchProviderPrefix} from "./config.js";
import { validURL } from "./utils.js";
import { showErrorToastSimple } from "./com.js";

const input = document.getElementById('searchText');

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();

    Sentry.addBreadcrumb({
        category: 'search',
        message: 'User just submitted something',
        data: {
            query: input.value
        },
        levle: Sentry.Severity.Info 
    });

    if (validURL('https://' + input.value)) {
        window.location.href = 'https://' + input.value;
        return;
    } else if (validURL(input.value)) {
        window.location.href = input.value;
        return;
    }

    if (input.value.startsWith(':')) {

        const query = input.value;
        const command = query.replace(':', '').split(' ')[0];
        const param = concatStringArray(query.split(' '), 1);

        let foundCommand = false;

        config.commands.forEach(configCommand => {
            if (configCommand.key === command) {
                configCommand.action(param);
                foundCommand = true;
                return;
            }
        });

        if (!foundCommand) {
            showErrorToastSimple(`Es konnte kein Command für "${command}" gefunden werden`)
        }

    } else {
        // if there is a coresponding Shortcut move there.
        if (!executeShortCut(input.value)) {
            const query = getSearchProviderPrefix(config.standadSearchProvider) + input.value;
            
            window.location.href = query;
        }

    }
});




function executeShortCut(query) {
    for (let i = 0; i < config.shortCuts.length; i++) {
        if (config.shortCuts[i].key === query) {
            window.location.href = config.shortCuts[i].url;
            return true;
        }
    }
    return false;
}

function concatStringArray(array, start) {
    let string = '';

    for (let i = start; i < array.length - 1; i++) {
        if (array[i].length > 0) {
            string += array[i] + ' ';
        }
    }

    if (array[array.length - 1].length > 0) {
        string += array[array.length - 1];
    } else {
        string.substring(0, string.length - 1);
    }

    return string;
}
