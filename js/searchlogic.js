import { config, getSearchProviderPrefix} from "./config.js";

const input = document.getElementById('searchText');

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('https://' + input.value);

    if (isValidUrl('https://' + input.value)) {
        console.log('true');
        window.location.href = 'https://' + input.value;
        return;
    }

    if (input.value.startsWith(':')) {

        const query = input.value;
        const command = query.replace(':', '').split(' ')[0];
        const param = concatStringArray(query.split(' '), 1);

        config.commands.forEach(configCommand => {
            if (configCommand.key === command) {
                configCommand.action(param);
            }
        })

    } else {
        console.log('test');
        // if there is a coresponding Shortcut move there.
        if (!executeShortCut(input.value)) {
            const query = getSearchProviderPrefix(config.standadSearchProvider) + input.value;
            
            window.location.href = query;
        }

    }
});

const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
}

function executeShortCut(query) {
    for (let i = 0; i < config.shortCuts.length; i++) {
        if (config.shortCuts[i].key === query) {
            console.log("test");
            window.location.href = config.shortCuts[i].url;
            return true;
        }
    }
    return false;
}

function concatStringArray(array, start) {
    let string = '';

    for (let i = start; i < array.length; i++) {
        string += array[i] + ' ';
    }

    return string;
}
