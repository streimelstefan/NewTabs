/**
 * @file Contains test for the shortcut store.
 * @copyright Streimel Stefan under Apache License 2.0
 * @author Streimel Stefan
 */
import { describe, expect, test, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { State, useStateStore } from './state';

describe('shortcut store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
});
