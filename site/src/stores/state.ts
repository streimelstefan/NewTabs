import { defineStore } from 'pinia';

export const enum State {
    clock,
    settings,
    search,
}

export const useStateStore = defineStore('state', {
    state: () => {
        return { state: State.clock };
    },
    actions: {
        changeState(state: State) {
            this.state = state;
        },
    },
});
