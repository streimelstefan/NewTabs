import { config } from "./config.js";
import { displayCategories, removeCategories } from './shortcutCategories.js';


const input = document.getElementById('searchText');
const form = document.getElementById('command-field');
const searchHint = document.getElementById('searchHint');

document.addEventListener('keydown', (e) => {

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'CapsLock') {
        return;
    }

    // if tab is pressedn and the searchfield is not empty activate shortcuts again
    if (e.code === "Tab") {
        if (searchHint.value.length !== 0) {
            input.value = searchHint.value;
        }
        activateAllAutocompletes();
        showShortcut(input);

        e.preventDefault();
    }

    // deactivate the current Shortcut
    if (e.code === 'Backspace' && e.shiftKey) {
        deactivateAllAutocompletes();
        searchHint.value = '';
        e.preventDefault();
        return;
    }
    
    if (e.code === 'Backspace' && searchHint.value.length !== 0 && !(searchHint.value.length <= input.value.length)) {
        deactivateAutocomplete(searchHint.value);
        searchHint.value = '';
        e.preventDefault();
        return;
    }


    setTimeout(() => {
        showShortcut(input);
    }, 50);

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
        return;
    }

    if (document.activeElement === input) {
        if (input.value === '' && e.code === "Backspace") {
            clock.style.display = 'block';
            form.style.display = 'none';
            removeCategories();
        }
    } else {
        clock.style.display = 'none';
        form.style.display = 'inline';
        removeCategories();
    }
    input.focus();
});

clock.addEventListener('click', () => {
    clock.style.display = 'none';
    form.style.display = 'none';
    displayCategories();
});

input.addEventListener('focusout', () => {
    let value = input.value.replace(/ /g,'');
    if (value.length < 1) {
        clock.style.display = 'block';
        form.style.display = 'none';
        removeCategories();
    }
    activateAllAutocompletes();
});

document.querySelector('.shortcut-category-close').addEventListener('click', () => {
    clock.style.display = 'block';
    form.style.display = 'none';
    removeCategories();
});

function deactivateAutocomplete(value) {
    let found = false;
    config.shortCuts.forEach(sc => {
        if (sc.key === value) {
            sc.stopFromSeeing = true;
            found = false;
        }
    });

    if (!found) {
        config.commands.forEach(com => {
            if (com.key === value) {
                com.stopFromSeeing = true;
            }
        })
    }
}

function activateAllAutocompletes() {
    config.shortCuts.forEach(sc => {
        sc.stopFromSeeing = false;
    });
    config.commands.forEach(com => {
        com.stopFromSeeing = false;
    })
}

function deactivateAllAutocompletes() {
    config.shortCuts.forEach(sc => {
        sc.stopFromSeeing = true;
    });
    config.commands.forEach(com => {
        com.stopFromSeeing = true;
    })
}

function showShortcut(input) {
    if (input.value.length !== 0) {

        let changed = false;

        if (input.value.startsWith(':')) {
            config.commands.forEach(command => {
                if ((':' + command.key).startsWith(input.value)  && !command.stopFromSeeing) {
                    searchHint.value = ':' + command.key;
                    changed = true;
                }
            });
        } else {
            config.shortCuts.forEach(shortcut => {
                if (shortcut.key.startsWith(input.value) && !shortcut.stopFromSeeing) {
                    searchHint.value = shortcut.key;
                    changed = true;
                }
            });
        }

        if (!changed) {
            searchHint.value = '';
        }

    } else {
        searchHint.value = '';
    }
}