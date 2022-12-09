/**
 * @file Contains the logic to save, delete, modify and find shortcuts.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { defineStore } from 'pinia';
import { useDbStore } from './db';

/**
 * Holds all the data necessary to operate with shortcuts.
 *
 * - name: The name is only for the user so he can identify shortcuts easier
 * - url: Holds the url where the shortcut should point to
 * - shortcut: The key of the shortcut. If the user types in this value the shortcut should be resolved.
 * @summary Contains all data of a shortcut.
 * @author Streimel Stefan
 * @since 4.3.0
 * @interface
 */
export interface ShortCut {
  /**
   * The name is only for the user so he can identify shortcuts easier
   */
  name: string;
  /**
   * Holds the url where the shortcut should point to
   */
  url: string;
  /**
   * The key of the shortcut. If the user types in this value the shortcut should be resolved.
   */
  shortcut: string;
}

/**
 * Holds the metadata about the best matching shortcut of a possible key.
 *
 * - hint: holds the key of the shortcut.
 * - maxIgnorable: How many elements can be ignored before it wont make a difference
 * - shortcut: The best matching shortcut
 * @summary Holds the metadata about the best matching shortcut of a possible key
 * @author Streimel Stefan
 * @since 4.3.0
 * @interface
 */
export interface BestMatchingShortCut {
  /**
   * holds the key of the shortcut
   */
  hint: string;
  /**
   * How many elements can be ignored before it wont make a difference
   */
  maxIgnorable: number;
  /**
   * The best matching shortcut
   */
  shortcut: ShortCut;
}

/**
 * Contains functions to operate on and save shortcuts. Shortcuts are
 * saved via the {@link useDbStore|db store} so data can should be synced as long
 * as the user is using the site via the chrome extension.
 *
 * It also contains migration logic for shortcuts of version < 4.0
 * @todo migration logic should be moved to its own store and data should be versioned!
 *
 * @summary Contains functions to operate on and save shortcuts.
 * @author Streimel Stefan
 * @since 4.3.0
 * @constant
 */
export const useShortcutStore = defineStore('shortcut', {
  state: () => {
    return { shortcuts: {} as Record<string, ShortCut> };
  },
  actions: {
    /**
     * Saves all the data within the store into the db.
     * @since 4.3.0
     * @author Streimel Stefan
     * @public
     */
    async saveShortcuts(): Promise<void> {
      const db = useDbStore();
      await db.save('shortcuts', JSON.stringify(this.shortcuts), true);
    },
    /**
     * Loads all shortcuts form the db into the store.
     *
     * ! All data within the store will be overwritten!
     * @since 4.3.0
     * @author Streimel Stefan
     * @public
     */
    async loadShortcuts(): Promise<void> {
      const db = useDbStore();
      let scString = await db.get('shortcuts', true);
      console.log(`Got shorcuts from database: ${scString}`);
      if (scString !== null) {
        this.shortcuts = JSON.parse(scString);
        console.log(this.shortcuts);
      }
    },
    /**
     * Adds a new shortcut to the shortcuts. It check for duplicate keys within the shortcuts
     * if there is a duplicate key the older shortcut will be deleted. After duplication has
     * been checked the shortcut will be saved.
     *
     * If saveMode is on and the shortcut to add already exists then no changes will be made and false
     * will be returned.
     * @summary Adds a new shortcut to the shortcuts.
     * @param sc The new shortcut to add.
     * @param saveMode If true the shortcut will only be added if the key of the shortcut does not already exist.
     * @returns true if the shortcut was added false if not.
     * @author Streimel Stefan
     * @since 4.3.0
     * @public
     */
    async addShortcut(sc: ShortCut, saveMode = true): Promise<boolean> {
      if (this.shortcuts[sc.shortcut] && saveMode) {
        return false;
      }

      this.shortcuts[sc.shortcut] = sc;
      await this._removeDuplicates();
      await this.saveShortcuts();
      return true;
    },
    /**
     * Checks if there are some shortcuts that have a shortcut that is different than their key, if there
     * are any the element will be removed.
     *
     * The key in this case is the value under which the shortcut is registered in the dictionary and
     * the shortcut is the {@link ShortCut#shortcut|ShortCuts.shortcut} value
     *
     * @summary Removes impossible shortcut entries.
     * @todo Change name to a better fitting one
     * @author Streimel Stefan
     * @since 4.3.0
     * @private
     */
    async _removeDuplicates() {
      Object.keys(this.shortcuts).forEach((key) => {
        if (this.shortcuts[key].shortcut !== key) {
          delete this.shortcuts[key];
        }
      });
    },
    /**
     * Removes a shortcut and saves the changes in the db.
     *
     * Uses the {@link useDbStore|db store} to save the data.
     * @summary Removes a shortcut
     * @param sc The shortcut to remove
     * @returns true when the shortcut could be removed. If not false.
     */
    async removeShortcut(sc: ShortCut): Promise<boolean> {
      if (!this.shortcuts[sc.shortcut]) {
        return false;
      }
      delete this.shortcuts[sc.shortcut];
      await this.saveShortcuts();
      return true;
    },
    /**
     * Returns the shortcut that responses to the given key.
     *
     * The key correlates to the {@link ShortCut|ShortCuts.shortcut} value
     * @summary Returns the shortcut that responses to the given key.
     * @param key The key that represents the shortcut.
     * @returns Shortcut if there is a shortcut with this key undefined if not.
     * @author Streimel Stefan
     * @since 4.3.0
     * @public
     */
    getByKey(key: string): ShortCut | undefined {
      return this.shortcuts[key];
    },
    /**
     * Goes through all saved shortcuts and looks if the {@link ShortCut|ShortCuts.shortcut} starts with the key given.
     * After all shortcuts have been found they will be sorted to length of {@link ShortCut|ShortCuts.shortcut}.
     *
     * After the shortcuts have been sorted the "ignoreFirst" number of shortcuts will be ignored and then the shortcut
     * with the smallest {@link ShortCut|ShortCuts.shortcut} will be returned.
     *
     * @summary Returns the shortcut where the {@link ShortCut|ShortCuts.shortcut} represents the given key best
     * @param key The key that could represent a shortcut
     * @param ignoreFirst How many shortcuts should be ignored.
     * @returns The best matching shortcut
     * @author Streimel Stefan
     * @since 4.3.0
     * @public
     */
    getBestMatchingShortcut(
      key: string,
      ignoreFirst: number
    ): BestMatchingShortCut {
      const scs = Object.keys(this.shortcuts);

      scs.sort(function (a, b) {
        return a.length - b.length;
      });

      let maxIgnorable = 0;
      let lastMatch = '';
      let match = '';
      for (const sc of scs) {
        if (sc.startsWith(key)) {
          if (maxIgnorable === ignoreFirst) {
            match = sc;
          }
          lastMatch = sc;
          maxIgnorable += 1;
        }
      }

      if (!match) {
        match = lastMatch;
      }

      return {
        hint: match,
        maxIgnorable: maxIgnorable,
        shortcut: this.shortcuts[match],
      };
    },
    /**
     * Checks if there are older version of shortcuts saved.
     * @returns true if a older version of shortcuts exists
     * @author Streimel Stefan
     * @since 4.3.0
     * @public
     */
    async checkForOldShortcuts(): Promise<boolean> {
      const db = useDbStore();

      const sc = await db.get('sc', true);

      return !!sc;
    },
    /**
     * Returns a shortcut that has the url given.
     * @param url The url the shortcut should have.
     * @returns The shortcut with the searched for url or undefined if not shortcut was found.
     */
    async getScWithUrl(url: string): Promise<ShortCut | undefined> {
      for (const sc of this.shortcuts) {
        if (sc.url === url) {
          return sc;
        }
      }

      return undefined;
    }
    /**
     * Imports old versions of shortcuts.
     * @author Streimel Stefan
     * @since 4.3.0
     * @public
     */
    async importOldShortcuts(): Promise<void> {
      const db = useDbStore();

      const sc = (await db.get('sc', true)) as unknown as {
        category: string;
        color: string;
        key: string;
        name: string;
        stopFromSeeing: boolean;
        url: string;
      }[];

      if (sc) {
        console.log('Found a old shortcut config. Converting to new one');
        console.log(sc);

        sc.forEach(async (shortcut) => {
          if (
            !(await this.addShortcut({
              name: shortcut.name,
              shortcut: shortcut.key,
              url: shortcut.url,
            }))
          ) {
            console.log(
              `Unable to import shortcut (${shortcut.name}) ${shortcut.key} -> ${shortcut.url}`
            );
          } else {
            console.log(
              `Shortcut (${shortcut.name}) ${shortcut.key} -> ${shortcut.url} imported`
            );
          }
        });
      }
    },
  },
});
