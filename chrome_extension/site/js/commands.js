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
                config.shortCuts.push({key: command[1], url: command[2], category: command[3] || null, color: command[4] || null, name: command[5] || command[1]});
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
                    config.shortCuts.push({key: topLvlDomain, url: command[1], name: topLvlDomain, category: null, color: null});
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
                })
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
                        config.shortCuts[i].category = command[2];
                        edited = true;
                        showInfoToast(`Die Kategorie von ${command[0]} wurde auf ${command[2]} gesetzt!`);
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