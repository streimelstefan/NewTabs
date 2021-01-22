import { readable } from 'svelte/store';

interface ImgData {
    lastUpdate: Date;
    img: string;
    largestWidth: number;
    largestHeight: number;
}

const background = readable(null, set => {

});

/**
 * Loads a picture 
 * 
 * @param url The url to get the picture from
 */
async function loadImage(url: string) {
    let reader = new FileReader();
    reader.onloadend = function () {
        chrome.storage.local.set( { Image : reader.result } );
        chrome.storage.local.set({LIG: new Date()});
        if (callback) {
            callback();
        }
    };
    let imgxhr = new XMLHttpRequest();
    imgxhr.open("GET", url);
}

export = background;
