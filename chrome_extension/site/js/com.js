export function showInfoToast(text) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('show');
    toast.innerHTML = text;

    const body = document.querySelector('body');
    body.appendChild(toast);

    setTimeout(() =>{
        body.removeChild(toast);
    }, 2900); 
}

export function showErrorToast(text, callback) {
    let toast = document.createElement('div');
    toast.classList.add('errorToast');
    toast.classList.add('show');

    let toastText = document.createElement('div');
    toastText.classList.add('errorToastText');
    toastText.innerText = text;
    toast.appendChild(toastText);

    let toastButton = document.createElement('div');
    toastButton.classList.add('errorToastButton');
    toastButton.innerText = 'ok';
    toast.appendChild(toastButton);

    toastButton.addEventListener('click', () => {
        toast.classList.add('dismiss');
        callback();
        setTimeout(() => {
            body.removeChild(toast);
        }, 450);
    });

    setTimeout(() => {
        toast.classList.add('dismiss');

        setTimeout(() => {
            body.removeChild(toast);
        }, 450);
    }, 5000);   

    const body = document.querySelector('body');
    body.appendChild(toast);
}

export function showErrorToastSimple(text) {
    showErrorToast(text, () => {});
}
