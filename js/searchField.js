import { config } from "./config.js";

const input = document.getElementById('searchText');
const form = document.getElementById('command-field');
const searchHint = document.getElementById('searchHint');

document.addEventListener('keydown', (e) => {

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'CapsLock') {
        return;
    }

    if (e.code === "Tab") {
        if (searchHint.value.length !== 0) {
            input.value = searchHint.value;
        }
        e.preventDefault();
    }

    
    console.log(searchHint.value.length);
    console.log(input.value.length);
    console.log(!(searchHint.value.length <= input.value.length));

    if (e.code === 'Backspace' && e.ctrlKey) {
        searchHint.value = '';
    }

    if (e.code === 'Backspace' && searchHint.value.length !== 0 && !(searchHint.value.length <= input.value.length)) {
        searchHint.value = '';
        e.preventDefault();
        return;
    }


    setTimeout(() => {
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
                    if (shortcut.key.startsWith(input.value)) {
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