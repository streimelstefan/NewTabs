import { config, getSearchProviderPrefix} from "./config.js";
import { validURL, getTopDomain } from "./utils.js";
import { refreshBackground } from './getBackground.js';
import { showInfoToast, showErrorToastSimple, showErrorToast } from './com.js';

export function googleAction(query) {
    const searchQuery = getSearchProviderPrefix('Google') + query;

    window.location.href = searchQuery;
}

export function yahooAction(query) {
    const searchQuery = getSearchProviderPrefix('Yahoo') + query;

    window.location.href = searchQuery;
}

export function duckduckgoAction(query) {
    const searchQuery = getSearchProviderPrefix('DuckDuckGo') + query;

    window.location.href = searchQuery;
}

export function bingAction(query) {
    const searchQuery = getSearchProviderPrefix('Bing') + query;

    window.location.href = searchQuery;
}

export function standardAction(query) {
    query = query.replace(/ /g,'');

    let found = false;

    config.searchproviders.forEach(provider => {
        if (provider.name.toUpperCase() === query.toUpperCase()) {
            config.standadSearchProvider = provider.name;
            document.getElementById('searchText').value = '';
            showInfoToast(`${provider.name} is now your standard search provider!`);
            found = true;
            return;
        }
    });

    if (!found) {
        showErrorToastSimple(`I was not abel to find a search provider of the name ${query}!`);
    }

    chrome.storage.sync.set({ssp: config.standadSearchProvider});
}

export function shortcutAction(query) {
    const command = query.split(' ');

    if (command.length >= 3) {
        if (command[0] === 'add') {
            
            if (!command[2].startsWith('http://') && !command[2].startsWith('https://')) {
                command[2] = 'http://' + command[2];
            }

            if (validURL(command[2])) {
                if (command[3]) {
                    if (!config.categories.includes(command[3])) {
                        showErrorToastSimple(`I could not find the category ${command[3]}`);
                        return;
                    }
                }
                for (let i = 0; i < config.shortCuts.length; i++) {
                    if (config.shortCuts[i].key === command[1]) {
                        showErrorToastSimple(`A shortcut with the key ${command[1]} does already exist!`);
                        return;
                    }
                }

                config.shortCuts.push({key: command[1], url: command[2], category: command[3] || null, color: command[4] || null, name: command[5] || command[1]});
                sortShortcutArray();
                chrome.storage.sync.set({sc: config.shortCuts});                    
                document.getElementById('searchText').value = '';
                showInfoToast(`Added shortcut!`);
            } else {
                showErrorToastSimple('The provided URL is not valid');
            }

        }
    } else if (command.length === 2) {
        
        if (command[0] === 'add') {
            if (validURL(command[1]) || validURL("http://" + command[1])) {

                let domain = command[1].replace('http://', '');
                domain = domain.replace('https://', '');
                if (domain.indexOf('/') !== -1) {
                    domain = domain.slice(0, domain.indexOf('/'));
                }

                const topLvlDomain = getTopDomain(domain);

                if (topLvlDomain) {
                    for (let i = 0; i < config.shortCuts.length; i++) {
                        if (config.shortCuts[i].key === command[1]) {
                            showErrorToastSimple(`A Shortcut with the key ${command[1]} does already exist`);
                            return;
                        }
                    }
                    config.shortCuts.push({key: topLvlDomain, url: command[1], name: topLvlDomain, category: null, color: null});
                    sortShortcutArray();
                    chrome.storage.sync.set({sc: config.shortCuts});
                    document.getElementById('searchText').value = '';
                    showInfoToast(`Your shortcut was created! Key = ${topLvlDomain}`);
                } else {
                    showErrorToastSimple('I could not create a key from the URL please provide one separately!');
                }
            } else {
                showErrorToastSimple('Your provided URL is invalid');
            }
        } else if (command[0] === 'remove') {
            config.shortCuts = config.shortCuts.filter(shortcut => {
                    const result = !(shortcut.key === command[1] ||
                                     shortcut.name === command[1] ||
                                    shortcut.url == command[1]);

                    if (!result) {
                        showInfoToast(`Deleted shortcut ${shortcut.name}`);
                    }

                    return result;
                });
            chrome.storage.sync.set({sc: config.shortCuts});
            document.getElementById('searchText').value = '';
        }

    } else {
        showErrorToastSimple('To add a shortcut please write: :sc add KEY URL');
    }
}

export function backgroundAction(query) {
    if (query.trim() === 'on') {
        config.useBackgroundPhoto = true;
        chrome.storage.sync.set({ubp: true});
        refreshBackground();
        document.getElementById('searchText').value = '';
        showInfoToast('Background photos are now on');
    } else if (query.trim() === 'off') {
        config.useBackgroundPhoto = false;
        chrome.storage.sync.set({ubp: false});
        document.querySelector('body').style.backgroundImage = '';
        document.getElementById('searchText').value = '';
        showInfoToast('Background photos are now off');
    } else {
        showErrorToastSimple(`Unknown command: ${query}! Please enter "on/off"`);
    }
}

export function refreshAction(query) {
    refreshBackground();
    document.getElementById('searchText').value = '';
    showInfoToast('Getting a new Image please wait.');
} 

export function editAction(query) {
    const command = query.split(' ');
    let found = false;
    let edited = false;
    if (command.length === 3) {
        
        for (let i = 0; i < config.shortCuts.length; i++) {
            if (config.shortCuts[i].name === command[0]) {
                found = true;

                switch (command[1]) {
                    case 'key':    
                        config.shortCuts[i].key = command[2];
                        edited = true;
                        sortShortcutArray();
                        showInfoToast(`The Key of ${command[0]} was set to ${command[2]}!`);
                        break;
                    case 'url':
                        if (!command[2].startsWith('http://') && !command[2].startsWith('https://')) {
                            command[2] = 'http://' + command[2];
                        }

                        config.shortCuts[i].url = command[2];
                        edited = true;
                        showInfoToast(`The URL of ${command[0]} was set to ${command[2]}!`);
                        break;

                    case 'name':
                        config.shortCuts[i].name = command[2];
                        edited = true;
                        showInfoToast(`The Name of ${command[0]} was set to ${command[2]}!`);
                        break;

                    case 'category':
                        if (config.categories.includes(command[2])) {
                            config.shortCuts[i].category = command[2];
                            edited = true;
                            showInfoToast(`The Category of ${command[0]} was set to ${command[2]}!`);
                        } else {
                            showErrorToastSimple(`Die Kategorie ${command[2]} konnte nicht gefunden werden.`);
                        }
                        break;

                    case 'color': 
                        showErrorToastSimple('This command is currently under development');
                        config.shortCuts[i].color = command[2];
                        break;

                    default:
                        showErrorToastSimple(`Field ${command[1]} does not exist! You can edit: [name, url, category, key]`);
                        break;
                }
            }
        }

        if (!found) {
            showErrorToastSimple(`Could not find shortcut with the name: ${command[0]}`);
        }

        if (edited) {
            chrome.storage.sync.set({sc: config.shortCuts});
            document.getElementById('searchText').value = '';
        }
    } else {
        showErrorToastSimple(`To edit a shortcut please write: ":edit NAME FIELDTOEDIT NEWVALUE"`);
    }
}

export function categoryAction(query) {
    const command = query.split(' ');

    if (command[0] === 'add') {
        if (command.length === 2) {
            addCategory(command[1]);
        } else {
            showErrorToastSimple('To add a category write: ":kat add NAME"');
        }
    } else if (command[0] === 'remove') {
        if (command.length === 2) {
            removeCategory(command[1]);
        } else {
            showErrorToastSimple('To Remove a category write: ":kat remove NAME"');
        }
    } else if (command[0] === 'edit') {
        if (command.length === 4) {
            editCategory(command[1], command[2], command[3]);
        } else {
            showErrorToastSimple('To edit a category write: ":kat edit NAME FIELDTOEDIT NEWVALUE"');
        }
    } else {
        showErrorToastSimple(`To add/edit/remove a category write: ":kat add/edit/remove NAME`);
    }

}

export function exportAction(query) {
    let dataConf = {
        sc: config.shortCuts,
        cat: config.categories,
        ssp: config.standadSearchProvider,
        ubp: config.useBackgroundPhoto
    };

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataConf));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "newTabs-config.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

export function importAction(query) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 

        var file = e.target.files[0]; 

        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            parseConfig(content);
        }

    }

    input.click();
}

function addCategory(name) {
    if (!config.categories.includes(name)) {
        config.categories.push(name);
        chrome.storage.sync.set({cat: config.categories});
        document.getElementById('searchText').value = '';
        console.log(config);
        showInfoToast(`Category ${name} was added`);
    } else {
        showErrorToastSimple(`A category with the name ${name} does already exist`);
    }
}

function removeCategory(name) {

    config.categories = config.categories.filter(category => {
        const result = !(category === name);

        if (!result) {
            for (let i = 0; i < config.shortCuts.length; i++) {
                if (config.shortCuts[i].category === name) {
                    config.shortCuts[i].category = null;
                    console.log(config.shortCuts[i]);
                }
            }
            
            showInfoToast(`Category ${name} was deleted`);
        }

        return result;
    })

    console.log(config);

    chrome.storage.sync.set({cat: config.categories});
    document.getElementById('searchText').value = '';
}

function editCategory(name, field, newValue) {
    let found = false;
    let edited = false;
    console.log(config.categories.length);
    console.log(config);
    for (let i = 0; i < config.categories.length; i++) {
        if (config.categories[i] === name) {
            found = true;
            
            if (field === 'name') {
                edited = true;
                
                for (let i = 0; i < config.shortCuts.length; i++) {
                    if (config.shortCuts[i].category === name) {
                        console.log(config);
                    }
                }

                showInfoToast(`Name of ${config.categories[i]} was set to ${newValue}.`);
                config.categories[i] = newValue;
            } else {
                showErrorToastSimple(`${field} kann not be edited. Fields that can be edited: 'name'`);
            }
            
        }
    }    
        
    if (edited) {
        chrome.storage.sync.set({cat: config.categories});
        document.getElementById('searchText').value = '';
    }

    if (!found) {
        showErrorToastSimple(`Could not find category ${name}!`);
    }
}

function sortShortcutArray() {
    config.shortCuts.sort((a, b) => {
        return b.key.length - a.key.length;
    });
}

function parseConfig(content) {
    try {
        const parsedContent = JSON.parse(content);
        if (parsedContent.sc && parsedContent.cat && parsedContent.ssp && parsedContent.ubp) {
            config.shortCuts = parsedContent.sc;
            config.categories = parsedContent.cat;
            config.standadSearchProvider = parsedContent.ssp;
            config.useBackgroundPhoto = parsedContent.ubp;
            chrome.storage.sync.set({cat: config.categories, sc: config.shortCuts, ssp: config.standadSearchProvider, ubp: config.useBackgroundPhoto});
            showInfoToast('Config imported!');
        } else {
           throw 'error'; 
        }
    } catch (e) {
        showErrorToastSimple('Your Config is not valid!');
    }
}