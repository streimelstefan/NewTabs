import { defineStore } from 'pinia';

export const useBackgroundStore = defineStore('background', {
    state: () => {
        return { background: '', fetchingImage: false };
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        saveImage() {
            console.log('Saving image to database');
            const db = useDbStore();

            db.save('bg-image', this.background);
        },
        getImage() {
            if (chrome) {
                chrome.storage.local.get('Image');
                return;
        async loadCachedImage(): Promise<boolean> {
            console.log('Loading cached image from database');
            const db = useDbStore();

            const cachedImage = await db.get('bg-image');
            // if there is no cached image return false and do not
            // save the image in the background variable
            if (!cachedImage) {
                return false;
            }

            this.background = cachedImage;
            return true;
        },
        async loadImage() {
            return new Promise((res, rej) => {
                // only allow one image the be requested at once
                if (this.fetchingImage) {
                    console.info(
                        'An image load request has already been sent! Not sending a new one.'
                    );
                    res(this.background);
                }
                this.fetchingImage = true;
                // get the size of the viewport for the image size
                const vw = Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                );
                const vh = Math.max(
                    document.documentElement.clientHeight,
                    window.innerHeight || 0
                );
                console.groupCollapsed('Requesting new image');
                const url = 'https://picsum.photos/' + vw + '/' + vh;
                console.table({
                    viewPortHeight: vh,
                    viewportWidth: vw,
                    requestUrl: url,
                });
                console.time('loadImage');
                var imgxhr = new XMLHttpRequest();
                imgxhr.open('GET', url + '?' + new Date().getTime());
                imgxhr.responseType = 'blob';
                imgxhr.onload = function () {
                    if (imgxhr.status === 200) {
                        reader.readAsDataURL(imgxhr.response);
                    }
                };
                var reader = new FileReader();
                reader.onloadend = () => {
                    if (imgxhr.status !== 200) {
                        console.warn('Failed to load image');
                        console.dir({
                            status: imgxhr.status,
                            response: imgxhr.response,
                        });
                    }
                    console.time;
                    console.log('Image loaded');
                    console.timeEnd('loadImage');
                    console.groupEnd();
                    this.fetchingImage = false;
                    this.background = `url(${reader.result})`;
                    res(this.background);
                };
                imgxhr.send();
            });
        },
    },
});
