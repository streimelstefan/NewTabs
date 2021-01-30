<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import {
        autocomplete,
        interfaceValue,
        length,
        parseInterfaceValue,
        keys,
        clearInterface,
    } from "../routes/_utils/interface";
    import AutocompleteList from "./autocompleteList.svelte";

    export let hide = true;

    let interfaceValueInput: string;
    let autoCompleteValueInput: string;

    let interfaceRef: HTMLInputElement;
    let autoCompleteRef: HTMLInputElement;
    let sizerRef: HTMLDivElement;

    let autoCompleteUnsubscribe;
    let interfaceValueUnsubscribe;
    let keyUnsubscribe;
    let clearInterfaceUnsubscribe;

    let autoCompleteHintsOffset = 0;

    // let minInterfaceWidth = 10;

    let inited = false;

    let autoCompleteList = [
        'DuckDuckGo',
        'Google',
        'Yahoo',
        'Bing'
    ];

    $: {
        interfaceValue.set(interfaceValueInput);

        if (inited) {
            /*    if (minInterfaceWidth > interfaceRef.value.length) {
                interfaceRef.size = minInterfaceWidth;
            } else {
                console.log({
                    length: interfaceRef.value.length,
                });
                interfaceRef.size = interfaceRef.value.length;
            }*/
        }
    }

    $: {
        if (interfaceValueInput !== undefined && interfaceValueInput !== null) {
            length.set(interfaceValueInput.length);
        }
    }

    onMount(() => {
        inited = true;
        autoCompleteValueInput = "fjdaksl";
        autoCompleteUnsubscribe = autocomplete.subscribe((data) => {
            autoCompleteValueInput = data;
        });

        interfaceValueUnsubscribe = interfaceValue.subscribe(async (data) => {
            if (data === undefined) {
                return;
            }
            setTimeout(() => {
                // TODO: make it so it will do the calculations if the data is already in the input
                let charOffset = interfaceRef.selectionStart;
                let text = interfaceRef.value
                    .substr(0, charOffset)
                    .replace(/ $/, "\xa0");
                sizerRef.innerText = text;
                autoCompleteHintsOffset = sizerRef.clientWidth;
            }, 20);
        });

        clearInterfaceUnsubscribe = clearInterface.subscribe((data) => {
            if (data) {
                interfaceValueInput = "";
                clearInterface.set(false);
            }
        });

        keyUnsubscribe = keys.subscribe((data) => {
            if (
                data === null ||
                autoCompleteValueInput === undefined ||
                interfaceValueInput === undefined
            ) {
                return;
            }

            if (
                data.key === "Tab" &&
                autoCompleteValueInput.length > interfaceValueInput.length
            ) {
                interfaceValueInput = autoCompleteValueInput;
                interfaceValue.set(interfaceValueInput);
            }
        });

        interfaceRef.focus();
    });

    onDestroy(() => {
        if (
            autoCompleteUnsubscribe &&
            {}.toString.call(autoCompleteUnsubscribe) === "[object Function]"
        ) {
            autoCompleteUnsubscribe();
            interfaceValueUnsubscribe();
            keyUnsubscribe();
            clearInterfaceUnsubscribe();
        }
    });

    function setAutoCompleteValue(value: string) {
        autoCompleteValueInput = value;
    }

    async function submit() {
        parseInterfaceValue(interfaceValueInput);
    }

    function focusInput() {
        interfaceRef.focus();
    }

    function updateScrool() {
        console.log(interfaceRef.scrollLeft);

        autoCompleteRef.scrollTo({ left: interfaceRef.scrollLeft });
    }
</script>

<div
    class="interface-field"
    class:hide
    autocomplete="off"
    autocapitalize="false"
    spellcheck="false"
    style="--autocomplete-hints-offset: {autoCompleteHintsOffset}px"
>
    <form on:submit|preventDefault={submit}>
        <input
            class="interface-input"
            bind:this={interfaceRef}
            on:scroll={updateScrool}
            bind:value={interfaceValueInput}
            on:blur={focusInput}
            type="text"
            autofocus
        />
    </form>
    <div class="auto-complete-top">
        <AutocompleteList list="{autoCompleteList}" />
    </div>
    <div class="auto-complete-bottom">
        <AutocompleteList list="{autoCompleteList}" up={false} />
    </div>
    <input
        readonly
        class="autocomplete"
        bind:this={autoCompleteRef}
        bind:value={autoCompleteValueInput}
        type="text"
    />
    <div bind:this={sizerRef} id="sizer" />
</div>

<style>
    input {
        height: 100%;

        letter-spacing: 0.2rem;
        font-size: 4rem;

        padding: 0;
        border: none;
        opacity: 1;

        color: white;

        background-color: transparent;
    }

    input[type="text"]:focus {
        outline: none;
    }

    #sizer {
        position: absolute;
        display: inline-block;
        visibility: hidden;

        letter-spacing: 0.2rem;
        font-size: 4rem;

        padding: 0;
        border: none;
    }

    .autocomplete {
        position: absolute;
        top: 0px;
        left: 2rem;

        width: calc(100% - 4rem);

        color: rgb(175, 175, 175);
        z-index: 0;
    }

    .interface-input {
        position: absolute;

        top: 0;
        left: 2rem;

        color: #ffffff;

        height: 10vh;
        opacity: 1;
        z-index: 2;
    }

    .interface-field {
        position: relative;
        display: block;

        letter-spacing: 0.2rem;

        width: 100%;
        height: 100%;

        padding: 0;
        margin: 0;
        z-index: 1;

        background-color: #61616123;
        border-radius: 2rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }

    .hide {
        opacity: 0;
    }

    form {
        width: 80%;
    }

    .auto-complete-bottom {
        position: absolute;

        bottom: 0px;
        left: var(--autocomplete-hints-offset);

        transform: translate(45%, 100%);

        z-index: 2;

        transition: all 0.1s ease-in-out;
    }

    .auto-complete-top {
        position: absolute;

        top: 0px;
        left: var(--autocomplete-hints-offset);

        transform: translate(45%, -100%);

        z-index: 2;

        transition: all 0.1s ease-in-out;
    }
</style>
