/**
 * @file Contains test for the state store.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { describe, expect, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { State, useStateStore } from './state';

describe('stateStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('changeState', () => {
    test('Should change the state to State.clock', () => {
      const stateStore = useStateStore();

      stateStore.changeState(State.clock);

      expect(stateStore.state).toEqual(State.clock);
    });

    test('Should change the state to State.settings', () => {
      const stateStore = useStateStore();

      stateStore.changeState(State.settings);

      expect(stateStore.state).toEqual(State.settings);
    });

    test('Should change the state to State.search', () => {
      const stateStore = useStateStore();

      stateStore.changeState(State.search);

      expect(stateStore.state).toEqual(State.search);
    });
  });
});
