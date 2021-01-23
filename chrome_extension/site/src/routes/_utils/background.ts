import { readable } from 'svelte/store';
import { getIfOnServer } from './utils';
import db from './database';

export interface ImgData {
    lastUpdate: Date;
    img: string;
    imgHeight: number;
    imgWidth: number;
}

export const background = readable(null, set => {
    if (getIfOnServer()) {
        return;
    }


    async function start() {
        const chachedImg = await getImgFromDatabase();
        if (chachedImg === null || await getIfImgIsTooOld(chachedImg)) {
            const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            
            const img = await loadImgFromUrl('https://picsum.photos/' + vw + '/' + vh);

            const imgData: ImgData = {
                img,
                imgHeight: vh,
                imgWidth: vw,
                lastUpdate: new Date()
            };

            set(imgData);

            await saveImgToDatabase(imgData.img, imgData.imgHeight, imgData.imgWidth, imgData.lastUpdate);
        } else {
            set(await getImgFromDatabase());
        }
    }

    start();
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
    const data: ImgData = await db.get('backgroundImg');

    if (data === null) {
        return null;
    }

    data.lastUpdate = new Date(data.lastUpdate);
    return data;
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

