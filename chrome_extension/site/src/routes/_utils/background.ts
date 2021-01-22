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

export async function loadImgFromUrl(url: string): Promise<any> {

}

export async function encodeImgToString(img): Promise<string> {
    return "";
}

export async function saveImage(imgString: string) {
}

