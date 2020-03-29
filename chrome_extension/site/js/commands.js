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
            showInfoToast(`${provider.name} ist nun Ihre Standardsuchmaschiene!`);
            found = true;
            return;
        }
    });

    if (!found) {
        showErrorToastSimple(`Es konnte keine Suchmaschiene mit dem Namen ${query} gefunden werden!`);
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
                        showErrorToastSimple(`Konnte die Kategorie ${command[3]} nicht finden!`);
                        return;
                    }
                }
                for (let i = 0; i < config.shortCuts.length; i++) {
                    if (config.shortCuts[i].key === command[1]) {
                        showErrorToastSimple(`Ein Shortcut mit dem key ${command[1]} existiert bereits`);
                        return;
                    }
                }

                config.shortCuts.push({key: command[1], url: command[2], category: command[3] || null, color: command[4] || null, name: command[5] || command[1]});
                sortShortcutArray();
                chrome.storage.sync.set({sc: config.shortCuts});                    
                document.getElementById('searchText').value = '';
                showInfoToast(`Shortcut hinzugefügt!`);
            } else {
                showErrorToastSimple('Die URL die Sie angegeben haben ist nicht correct!');
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
                            showErrorToastSimple(`Ein Shortcut mit dem key ${command[1]} existiert bereits`);
                            return;
                        }
                    }
                    config.shortCuts.push({key: topLvlDomain, url: command[1], name: topLvlDomain, category: null, color: null});
                    sortShortcutArray();
                    chrome.storage.sync.set({sc: config.shortCuts});
                    document.getElementById('searchText').value = '';
                    showInfoToast(`Shortcut wurde erstellt! KEY = ${topLvlDomain}`);
                } else {
                    showErrorToastSimple('Konnte KEY nicht aus URL erstellen bitte geben Sie den KEY seperat an!');
                }
            } else {
                showErrorToastSimple('Die von Ihnen angegebene URL ist nicht richtig!');
            }
        } else if (command[0] === 'remove') {
            config.shortCuts = config.shortCuts.filter(shortcut => {
                    const result = !(shortcut.key === command[1] ||
                                     shortcut.name === command[1] ||
                                    shortcut.url == command[1]);

                    if (!result) {
                        showInfoToast(`Shortcut ${shortcut.name} wurde entfernt`);
                    }

                    return result;
                });
            chrome.storage.sync.set({sc: config.shortCuts});
            document.getElementById('searchText').value = '';
        }

    } else {
        showErrorToastSimple('Um einen Shortcut hinzu zufügen müssens Sie den Command so Schreiben: :sc add KEY URL');
    }
}

export function backgroundAction(query) {
    if (query.trim() === 'on') {
        config.useBackgroundPhoto = true;
        chrome.storage.sync.set({ubp: true});
        refreshBackground();
        document.getElementById('searchText').value = '';
        showInfoToast('Hintergrund Photos wurden eingeschalten');
    } else if (query.trim() === 'off') {
        config.useBackgroundPhoto = false;
        chrome.storage.sync.set({ubp: false});
        document.querySelector('body').style.backgroundImage = '';
        document.getElementById('searchText').value = '';
        showInfoToast('Hintergrund Photos wurden ausgeschalten!');
    } else {
        showErrorToastSimple(`Unbekannter Befehl: ${query}! Bitte geben Sie entweder "on/off" ein`);
    }
}

export function refreshAction(query) {
    refreshBackground();
    document.getElementById('searchText').value = '';
    showInfoToast('Es wird einen neues Bild heruntergeladen bitte etwas gedult!');
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
                        showInfoToast(`Der Key von ${command[0]} wurde auf ${command[2]} gesetzt!`);
                        break;
                    case 'url':
                        if (!command[2].startsWith('http://') && !command[2].startsWith('https://')) {
                            command[2] = 'http://' + command[2];
                        }

                        config.shortCuts[i].url = command[2];
                        edited = true;
                        showInfoToast(`Die URL von ${command[0]} wurde auf ${command[2]} gesetzt!`);
                        break;

                    case 'name':
                        config.shortCuts[i].name = command[2];
                        edited = true;
                        showInfoToast(`Der Name von ${command[0]} wurde auf ${command[2]} gesetzt!`);
                        break;

                    case 'kategorie':
                        if (config.categories.includes(command[2])) {
                            config.shortCuts[i].category = command[2];
                            edited = true;
                            showInfoToast(`Die Kategorie von ${command[0]} wurde auf ${command[2]} gesetzt!`);
                        } else {
                            showErrorToastSimple(`Die Kategorie ${command[2]} konnte nicht gefunden werden.`);
                        }
                        break;

                    case 'farbe': 
                        showErrorToastSimple('Dieser Command ist noch unter Entwicklung');
                        config.shortCuts[i].color = command[2];
                        showInfoToast(`Die Farbe von ${command[0]} wurde auf ${command[2]} gesetzt!`);
                        break;

                    default:
                        showErrorToastSimple(`Feld ${command[1]} exestiert nicht! Sie können bearbeiten: [name, url, kategorie, farbe, key]`);
                        break;
                }
            }
        }

        if (!found) {
            showErrorToastSimple(`Wir konnten keinen Shortcut mit dem Namen: ${command[0]} finden`);
        }

        if (edited) {
            chrome.storage.sync.set({sc: config.shortCuts});
            document.getElementById('searchText').value = '';
        }
    } else {
        showErrorToastSimple(`Um einen Shortcuts zu bearbeiten schreiben Sie bitte: ":bearbeiten NAME SACHEZUÄNDERN NEUERWERT"`);
    }
}

export function categoryAction(query) {
    const command = query.split(' ');

    if (command[0] === 'add') {
        if (command.length === 2) {
            addCategory(command[1]);
        } else {
            showErrorToastSimple('Der Command um eine Kategorie hinzuzufügen nimmt nur 1 Argumet: ":kat add NAME"');
        }
    } else if (command[0] === 'remove') {
        if (command.length === 2) {
            removeCategory(command[1]);
        } else {
            showErrorToastSimple('Der Command um eine Kategorie zu entfernen nimmt nur 1 Argumet: ":kat remove NAME"');
        }
    } else if (command[0] === 'edit') {
        if (command.length === 4) {
            editCategory(command[1], command[2], command[3]);
        } else {
            showErrorToastSimple('Der Command um eine Kategorie zu bearbeiten nimmt genau 3 Argumete: ":kat edit NAME ZUBEARBEITEN NEUERWERT"');
        }
    } else {
        showErrorToastSimple(`Um Kategorie zu erstellen/bearbeiten/löschen schrieben Sie bitte: ":kat add/edit/remove NAME`);
    }

}

function addCategory(name) {
    if (!config.categories.includes(name)) {
        config.categories.push(name);
        chrome.storage.sync.set({cat: config.categories});
        document.getElementById('searchText').value = '';
        console.log(config);
        showInfoToast(`Kategorie ${name} wurde hinzugefügt`);
    } else {
        showErrorToastSimple(`Es existiert bereits eine Kategorie mit dem Namen ${name}`);
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
            
            showInfoToast(`Kategorie ${name} wurde entfernt`);
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

                showInfoToast(`Name von Kategorie ${config.categories[i]} wurde auf ${newValue} gesetzt.`);
                config.categories[i] = newValue;
            } else {
                showErrorToastSimple(`${field} kann bei Kategorien nicht bearbeited werden! Werte die bearbeited werden können: 'name'`);
            }
            
        }
    }    
        
    if (edited) {
        chrome.storage.sync.set({cat: config.categories});
        document.getElementById('searchText').value = '';
    }

    if (!found) {
        showErrorToastSimple(`Wir konnte Kategorie ${name} nicht finden!`);
    }
}

function sortShortcutArray() {
    config.shortCuts.sort((a, b) => {
        return b.key.length - a.key.length;
    });
}