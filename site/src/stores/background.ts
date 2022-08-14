import { defineStore } from 'pinia';

export const useBackgroundStore = defineStore('background', {
    state: () => {
        return { background: '' };
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        saveImage() {
            if (chrome.storage) {
                chrome.storage.local.set({ Image: this.background });
                return;
            }

            localStorage.setItem('bg-image', this.background);
        },
        getImage() {
            if (chrome) {
                chrome.storage.local.get('Image');
                return;
            }

            localStorage.getItem('bg-image');
        },
        async loadImage() {
            return new Promise((res, rej) => {
                const vw = Math.max(
                    document.documentElement.clientWidth,
                    window.innerWidth || 0
                );
                const vh = Math.max(
                    document.documentElement.clientHeight,
                    window.innerHeight || 0
                );
                const url =
                    'https://picsum.photos/' + vw + '/' + vh + '?grayscale';
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
                    this.background = `url(${reader.result})`;
                    res(this.background);
                };
                imgxhr.send();
            });
        },
    },
});
