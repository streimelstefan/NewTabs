/**
 * @file Contains the sate logic that declares what should be displayed on the page.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { defineStore } from 'pinia';

export interface Transition {
  from: string;
  to: string;
}

export enum FailureMode {
  /**
   * Invalid state changes will not be indicated in any way. The state will not change though.
   */
  silent,
  /**
   * Invalid state changes will be logged to the console.
   */
  log,
  /**
   * Invalid state changes will be thrown using an error.
   */
  throw,
}

/**
 * @summary Contains logic to keep the display application state synchronic across the application.
 * @author Streimel Stefan
 * @since 4.3.0
 * @constant
 */
export const useStateStore = defineStore('state', {
  state: () => {
    return {
      state: '',
      transitions: [] as Transition[],
      failureMode: FailureMode.throw,
    };
  },
  actions: {
    /**
     * Changes the current display application state. To the state given. If the state is invalid
     * it will be handled according to the failure mode.
     * @param state The new state that should be taken.
     * @param failureMode How an error should be handled if one occurs. If not provided the stores failure mode will be used.
     * @since 4.3.4
     * @author Streimel Stefan
     * @public
     */
    changeState(desiredState: string, failureMode?: FailureMode): void {
      const _failureMode =
        typeof failureMode === 'number' ? failureMode : this.failureMode;

      if (!this._stateExists(desiredState)) {
        return this._handleFailureUsing(
          {
            error: 'UnknownState',
            message: `The state "${desiredState}" does not exits!`,
          },
          failureMode as FailureMode
        );
      }

      if (!this._canMoveFromTo(this.state, desiredState)) {
        return this._handleFailureUsing(
          {
            error: 'InvalidStateChange',
            message: `You can not move from state "${this.state}" to state "${desiredState}"`,
          },
          _failureMode
        );
      }

      this.state = desiredState;
    },
    /**
     * Handles the error given with the failure Mode given.
     * @param error The error that should be handled.
     * @param failureMode The mode about how the error should be handled
     * @since 4.3.4
     * @author Streimel Stefan
     * @private
     */
    _handleFailureUsing(error: any, failureMode: FailureMode): void {
      if (failureMode === FailureMode.log) {
        console.error(error);
      } else if (failureMode === FailureMode.throw) {
        throw error;
      }
    },
    /**
     * Checks if the given state does exist.
     * @param state The state that should be checked.
     * @returns true if the state exists, false if not
     * @since 4.3.4
     * @author Streimel Stefan
     * @private
     */
    _stateExists(state: string): boolean {
      for (const transition of this.transitions) {
        if (state === transition.from) {
          return true;
        }

        if (state === transition.to) {
          return true;
        }
      }

      return false;
    },
    /**
     * Checks where there is a transition from the from state to the to state.
     * @param from The starting state.
     * @param to The state you want to move to.
     * @returns True if the transition exists, false if not.
     * @since 4.3.4
     * @author Streimel Stefan
     * @private
     */
    _canMoveFromTo(from: string, to: string): boolean {
      for (const transition of this.transitions) {
        if (transition.from === from && transition.to === to) {
          return true;
        }
      }

      return false;
    },
  },
});
