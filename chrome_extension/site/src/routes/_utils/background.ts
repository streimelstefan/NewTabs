import { readable } from 'svelte/store';
import db from './database';

interface ImgData {
    lastUpdate: Date;
    img: string;
    imgHeight: number;
    imgWidth: number;
}

export const background = readable(null, set => {

});

/**
 * Saves the img to the database
 * @param img Image base64 string to be saved
 * @param imgHeight Height of the img in px
 * @param imgWidth Width of the img in px
 * @param imgPull When the img was downloaded
 */
export async function saveImgToDatabase(img: string, imgHeight: number, imgWidth: number, imgPull: Date): Promise<{success: boolean, data: ImgData}> {
    const data: ImgData = {
        lastUpdate: imgPull,
        img,
        imgHeight,
        imgWidth
    };
    
    const success = await db.set('backgroundImg', data);

    return {success, data};
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

