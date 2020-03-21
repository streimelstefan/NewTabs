import { config } from "./config.js";

const input = document.getElementById('searchText');
const form = document.getElementById('command-field');
const searchHint = document.getElementById('searchHint');

document.addEventListener('keydown', (e) => {

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'CapsLock') {
        return;
    }

    console.log(e);

    // if tab is pressedn and the searchfield is not empty activate shortcuts again
    if (e.code === "Tab") {
        if (searchHint.value.length !== 0) {
            input.value = searchHint.value;
        }
        activateAllSortCuts(input);
        e.preventDefault();
    }

    // deactivate the current Shortcut
    if (e.code === 'Backspace' && e.shiftKey) {
        deactivateAllShortcuts();
        searchHint.value = '';
        e.preventDefault();
    }

    
    if (e.code === 'Backspace' && searchHint.value.length !== 0 && !(searchHint.value.length <= input.value.length)) {
        deactivateShortcut(searchHint.value);
        searchHint.value = '';
        e.preventDefault();
        return;
    }


    setTimeout(() => {
        showShortcut(input);
        console.log(config.shortCuts);
    }, 50);

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
        return;
    }

    if (document.activeElement === input) {
        if (input.value === '' && e.code === "Backspace") {
            clock.style.display = 'block';
            form.style.display = 'none';
        }
    } else {
        clock.style.display = 'none';
        form.style.display = 'inline';
    }
    input.focus();
});

function deactivateShortcut(value) {
    config.shortCuts.forEach(sc => {
        if (sc.key === value) {
            sc.stopFromSeeing = true;
        }
    });
}

function activateAllSortCuts(input) {
    config.shortCuts.forEach(sc => {
        sc.stopFromSeeing = false;
    });
    showShortcut(input);
}

function deactivateAllShortcuts() {
    config.shortCuts.forEach(sc => {
        sc.stopFromSeeing = true;
    });
}

function showShortcut(input) {
    if (input.value.length !== 0) {

        let changed = false;

        if (input.value.startsWith(':')) {
            config.commands.forEach(command => {
                if ((':' + command.key).startsWith(input.value)) {
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