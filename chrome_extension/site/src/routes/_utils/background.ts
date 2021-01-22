import { readable } from 'svelte/store';

interface ImgData {
    lastUpdate: Date;
    img: string;
    largestWidth: number;
    largestHeight: number;
}

export const background = readable(null, set => {

});

/**
 * Loads a picture 
 * 
 * @param url The url to get the picture from
 */
export async function loadImage(url: string) {
    
}

/**
 * Loads Image from an URL and returns the string as a base64 encoded string
 * @param url URL to load the Image from
 */
export async function loadImgFromUrl(url: string): Promise<String> {
    return new Promise<any>((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            const reader = new FileReader();
            reader.onloadend = () => {
                res(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

export async function saveImage(imgString: string) {
}

