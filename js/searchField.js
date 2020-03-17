
document.addEventListener('keydown', (e) => {
    
    const clock = document.getElementById('clock');
    const input = document.getElementById('searchText');
    const form = document.getElementById('command-field');

    if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
        return;
    }

    if (document.activeElement === input) {
        if (input.value === '') {
            clock.style.display = '';
            form.style.display = 'none';
        }
    } else {
        clock.style.display = 'none';
        form.style.display = '';
        input.focus();
    }
});