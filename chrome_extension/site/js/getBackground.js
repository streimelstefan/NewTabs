import { config } from "./config.js";

function loadImage( url, callback ){
    var imgxhr = new XMLHttpRequest();
        imgxhr.open( "GET", url + "?" + new Date().getTime() );
        imgxhr.responseType = "blob";
        imgxhr.onload = function (){
            if ( imgxhr.status===200 ){
                reader.readAsDataURL(imgxhr.response);
            }
        };
    var reader = new FileReader();
        reader.onloadend = function () {
            chrome.storage.local.set( { Image : reader.result } );
            if (callback) {
                callback();
            }
        };
    imgxhr.send();
    window.localStorage.setItem('LIG', new Date());
}

function addBackgroundImg() {
    chrome.storage.local.get(['Image'], (image) => {
        document.querySelector('body').style.backgroundImage = "url(" + image.Image + ")";
    });
}

if (config.useBackgroundPhoto) {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const url = "https://picsum.photos/" + vw + "/" + vh + "?grayscale"
    console.log(url);
    if (config.lastImageGrap) {
        let today = new Date();
        console.log(config.lastImageGrap);

        if (today.getTime() - new Date(config.lastImageGrap).getTime() > 86400000) {
            console.log("Yesterday");

            loadImage(url, null);
        }
    } else {
        loadImage(url, null);
    }

    addBackgroundImg();
}

export function refreshBackground() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const url = "https://picsum.photos/" + vw + "/" + vh + "?grayscale"
    console.log("refreshing");
    loadImage(url, () => {
        addBackgroundImg()
    });
}
