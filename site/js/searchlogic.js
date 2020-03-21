import { config, getSearchProviderPrefix} from "./config.js";

const input = document.getElementById('searchText');

document.getElementById('searchForm').addEventListener('submit', (event) => {
    event.preventDefault();

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

        config.commands.forEach(configCommand => {
            if (configCommand.key === command) {
                configCommand.action(param);
            }
        })

    } else {
        // if there is a coresponding Shortcut move there.
        if (!executeShortCut(input.value)) {
            const query = getSearchProviderPrefix(config.standadSearchProvider) + input.value;
            
            window.location.href = query;
        }

    }
});

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}


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

    for (let i = start; i < array.length; i++) {
        string += array[i] + ' ';
    }

    return string;
}
