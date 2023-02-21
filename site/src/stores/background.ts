import { defineStore } from 'pinia';
import { useDbStore } from './db';

interface ImageSettings {
  width: number;
  height: number;
  url: string;
}

export const useBackgroundStore = defineStore('background', {
  state: () => {
    return {
      backgroundUrl: '',
      backgroundBlob: null as unknown as Blob,
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
    async saveImage() {
      const db = useDbStore();

      db.save('bg-image', await this.getBlobAsBase64(this.backgroundBlob));
    },
    start() {
      this.multiPictureInterval = setInterval(async () => {
        return;
        if (this.multiPictureImages.length === 0) return;

        if (!this.multiPictureMode) return;

        if (this.multiPictureActivePicture >= this.multiPictureImages.length) {
          this.multiPictureActivePicture = 0;
        }

        this.backgroundBlob = await this.getMultiImage(
          this.multiPictureImages[this.multiPictureActivePicture]
        );

        this.setBackgroundUrl(await this.getImageUrl(this.backgroundBlob));

        this.multiPictureActivePicture += 1;
      }, this.multiPictureIntervalTimeout);
    },
    setBackgroundUrl(imageBlobUrl: string) {
      this.backgroundUrl = `${imageBlobUrl}`;
    },
    async loadCachedImage(): Promise<boolean> {
      const db = useDbStore();

      let cachedImage = await db.get('bg-image');

      // if there is no cached image return false and do not
      // save the image in the background variable
      if (!cachedImage) {
        return false;
      }

      // removes the url(...) from older saves
      cachedImage = await this._removeUrlFromImageUrl(cachedImage);

      this.backgroundBlob = await this.getBlobFromBase64(cachedImage);

      this.setBackgroundUrl(await this.getImageUrl(this.backgroundBlob));
      return true;
    },
    async loadImage() {
      return new Promise(async (res, rej) => {
        // only allow one image the be requested at once
        if (this.fetchingImage) {
          res(this.backgroundUrl);
        }
        this.fetchingImage = true;

        const imageSettings = await this._generateImageSettings();

        const response = await fetch(imageSettings.url);
        this.backgroundBlob = await response.blob();

        this.fetchingImage = false;
        this.setBackgroundUrl(await this.getImageUrl(this.backgroundBlob));
        res(this.backgroundUrl);
      });
    },
    async getImageUrl(image: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        try {
          const imageUrl = URL.createObjectURL(image);
          resolve(imageUrl);
        } catch (error) {
          reject(error);
        }
      });
    },
    /**
     * It takes a Blob and returns a Promise that resolves to a base64 string
     * @param {Blob} blob - Blob - The image to convert to base64
     * @returns A promise that resolves to a string.
     */
    getBlobAsBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        if (!blob) {
          reject('No image provided');
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
      });
    },
    /**
     * It takes a base64 string and returns a blob.
     * @param {string} blob - string - The base64 string of the blob you want to convert
     * @returns A blob.
     * @throws if the string is not a valid base64 string.
     */
    async getBlobFromBase64(blob: string): Promise<Blob> {
      try {
        const response = await fetch(blob);
        if (response.ok) {
          return await response.blob();
        } else {
          throw new Error(
            `Error getting blob from base64 string: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        throw new Error('Error fetching blob');
      }
    },

    /**
     * It takes a blob, converts it to base64, saves it to Database, and then adds the name of the blob to
     * an array of images.
     * @param {Blob} image - Blob - the image that is being added to the database
     * @returns a promise.
     */
    async addImageToMultiImage(image: Blob) {
      if (!image) {
        return;
      }

      const db = useDbStore();

      let currentPicIndex = 0;
      let picName = `background-image-${currentPicIndex}`;

      // as long as there is a image with this index go to the next index.
      while (await db.get(picName)) {
        currentPicIndex++;
        picName = `background-image-${currentPicIndex}`;
      }

      try {
        await db.save(picName, await this.getBlobAsBase64(image));
      } catch (err) {
        return;
      }

      this.multiPictureImages.push(picName);
      await this.saveSettings();
    },
    async getMultiImage(imageName: string): Promise<Blob> {
      const db = useDbStore();

      let image = await db.get(imageName);

      if (image === null) {
        return new Blob();
      }

      image = await this._removeUrlFromImageUrl(image);

      return await this.getBlobFromBase64(image);
    },
    async removeMultiImage(imageName: string) {
      const db = useDbStore();

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

      if (inset) {
        this.inset = parseInt(inset);
      }

      if (backgroundMultiImages) {
        this.multiPictureImages = JSON.parse(backgroundMultiImages);
      }

      if (multiPictureActivePicture) {
        this.multiPictureActivePicture = parseInt(multiPictureActivePicture);
      }
    },
    async _generateImageSettings(): Promise<ImageSettings> {
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
      const height = Math.trunc(vw * offsetPer);
      const width = Math.trunc(vh * offsetPer);

      return {
        width: width,
        height: height,
        url: 'https://picsum.photos/' + width + '/' + height,
      };
    },
    async _removeUrlFromImageUrl(image: string): Promise<string> {
      if (image.startsWith('url(')) {
        image = image.slice(4);
        image = image.slice(0, -1);
      }

      return image;
    },
  },
});
