/**
 * @file Contains the sate logic that declares what should be displayed on the page.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { defineStore } from 'pinia';

/**
 * Represents the states that the application can have.
 *
 * - clock: A clock with the current time should be displayed
 * - settings: A menu should be displayed where the user can change multiple settings.
 * - search: A search field should be displayed where the user can enter a search query.
 * @enum
 * @readonly
 * @author Streimel Stefan
 * @since 4.3.0
 */
export const enum State {
  /**
   * A clock with the current time should be displayed
   */
  clock,
  /**
   * A menu should be displayed where the user can change multiple settings.
   */
  settings,
  /**
   * A search field should be displayed where the user can enter a search query.
   */
  search,
}

/**
 * Contains logic to keep the display application state synchronic across the application. The application can have
 * the sates that are described in the {@link State|State enum}.
 * @summary Contains logic to keep the display application state synchronic across the application.
 * @author Streimel Stefan
 * @since 4.3.0
 * @constant
 */
export const useStateStore = defineStore('state', {
  state: () => {
    return { state: State.clock };
  },
  actions: {
    /**
     * Changes the current display application state.
     * @param state The new state the display should have
     * @since 4.3.0
     * @author Streimel Stefan
     * @public
     */
    changeState(state: State) {
      this.state = state;
    },
  },
});
