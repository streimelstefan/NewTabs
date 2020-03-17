const clock = document.getElementById('clock');

function getTimeString() {
    let date = new Date();

    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function updateClock() {
    console.log(getTimeString());
    clock.innerHTML = getTimeString();
}

setInterval(() => {updateClock()}, 250);