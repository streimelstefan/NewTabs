import { defineStore } from 'pinia';
import { useDbStore } from './db';

export const useBackgroundStore = defineStore('background', {
  state: () => {
    return {
      background: '',
      fetchingImage: false,
      inset: 0,
      multiPictureMode: true,
      multiPictureImages: [] as string[],
      multiPictureActivePicture: 0,
      // @ts-ignore
      multiPictureInterval: null as Timer | null,
      multiPictureIntervalTimeout: 3000,
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    saveImage() {
      console.log('Saving image to database');
      const db = useDbStore();

      db.save('bg-image', this.background);
    },
    start() {
      this.multiPictureInterval = setInterval(async () => {
        if (this.multiPictureImages.length === 0) return;

        if (!this.multiPictureMode) return;

        if (this.multiPictureActivePicture >= this.multiPictureImages.length) {
          this.multiPictureActivePicture = 0;
        }
        console.log(
          `setting background to image ${
            this.multiPictureImages[this.multiPictureActivePicture]
          }`
        );
        this.background = await this.getMultiImage(
          this.multiPictureImages[this.multiPictureActivePicture]
        );

        this.multiPictureActivePicture += 1;
      }, this.multiPictureIntervalTimeout);
    },
    async loadCachedImage(): Promise<boolean> {
      console.log('Loading cached image from database');
      const db = useDbStore();

      let cachedImage = await db.get('bg-image');
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
        const offsetPer = (100 - this.inset) / 100;
        const height = Math.trunc(vh * offsetPer);
        const width = Math.trunc(vw * offsetPer);
        console.groupCollapsed('Requesting new image');
        const url = 'https://picsum.photos/' + width + '/' + height;
        console.table({
          viewPortHeight: vh,
          viewportWidth: vw,
          inset: this.inset,
          offsetPercentage: offsetPer,
          generatedHeight: height,
          generatedWidth: width,
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
          this.setBackground(reader.result);
          res(this.background);
        };
        imgxhr.send();
      });
    },
    setBackground(image: string | ArrayBuffer | null) {
      console.log('Setting new Background');
      this.background = `url(${image})`;
    },
    async addImageToMultiImage(image: string | ArrayBuffer | null) {
      if (image === null) return;

      const db = useDbStore();

      const picName = `background-image-${this.multiPictureImages.length}`;
      console.log(picName);

      await db.save(picName, image.toString());
      this.multiPictureImages.push(picName);
      await this.saveSettings();
    },
    async getMultiImage(imageName: string) {
      const db = useDbStore();

      const image = await db.get(imageName);

      if (image === null) {
        return '';
      }

      return image;
    },
    async removeMultiImage(imageName: string) {
      const db = useDbStore();
      console.log(imageName);

      if (
        this.multiPictureImages.indexOf(imageName) ===
        this.multiPictureActivePicture
      ) {
        this.loadCachedImage();
      }

      this.multiPictureImages.splice(
        this.multiPictureImages.indexOf(imageName),
        1
      );

      db.remove(imageName);

      this.saveSettings();
    },
    async saveSettings() {
      const db = useDbStore();

      if (isNaN(this.inset)) {
        this.inset = 0;
      }

      if (this.inset > 100) {
        this.inset = 100;
      }

      if (this.inset < 0) {
        this.inset = 0;
      }

      db.save('inset', this.inset.toString(), true);
      db.save(
        'background-multi-images',
        JSON.stringify(this.multiPictureImages)
      );
      db.save(
        'background-multi-images-index',
        this.multiPictureActivePicture.toString()
      );
    },
    async loadSettings() {
      const db = useDbStore();
      const inset = await db.get('inset', true);
      const backgroundMultiImages = await db.get('background-multi-images');
      const multiPictureActivePicture = await db.get(
        'background-multi-images-index'
      );
      console.log(inset);
      console.log(backgroundMultiImages);
      if (inset) {
        this.inset = parseInt(inset);
      }

      if (backgroundMultiImages) {
        this.multiPictureImages = JSON.parse(backgroundMultiImages);
        console.log(this.multiPictureImages);
      }

      if (multiPictureActivePicture) {
        this.multiPictureActivePicture = parseInt(multiPictureActivePicture);
      }
    },
  },
});
