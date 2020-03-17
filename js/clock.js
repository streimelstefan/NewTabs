const clock = document.getElementById('clock');

function getTimeString() {
    const date = new Date();
    let seconds = '';
    let minutes = '';
    let hours = '';

    if (date.getSeconds() < 10) {
        seconds = '0' + date.getSeconds();
    } else {
        seconds = date.getSeconds();
    }

    if (date.getMinutes() < 10) {
        minutes = '0' + date.getMinutes();
    } else {
        minutes = date.getMinutes();
    }

    if (date.getHours() < 10) {
        hours = '0' + date.getHours();
    } else {
        hours = date.getHours();
    }

    return `${hours}:${minutes}:${seconds}`;
}

function updateClock() {
    clock.innerHTML = getTimeString();
}

setInterval(() => {updateClock()}, 250);