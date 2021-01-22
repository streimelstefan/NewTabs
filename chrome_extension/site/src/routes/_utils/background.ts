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
export async function loadImgFromUrl(url: string): Promise<string> {
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

/**
 * Returnes the Imaged saved in the database
 */
export async function getImgFromDatabase(): Promise<ImgData> {
    return await db.get('backgroundImg');
}

/**
 * Checks if the date on the imgData is older than one week. If the img
 * is older than one week true will be returned
 * @param imgData Image to be checked
 */
export async function getIfImgIsTooOld(imgData: ImgData): Promise<boolean> {
    const oneWeekAgo = -1000 * 60 * 60 * 24 * 7;
    const currentTime = new Date().getTime();
    const imgTime = imgData.lastUpdate.getTime();
    return (currentTime - imgTime) < oneWeekAgo;
}

