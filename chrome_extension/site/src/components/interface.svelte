<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { autocomplete, interfaceValue, length } from '../routes/_utils/interface';

    let interfaceValueInput: string; 
    let autoCompleteValueInput: string;

    let interfaceRef: HTMLElement;

    let autoCompleteUnsubscribe;

    $: {
        interfaceValue.set(interfaceValueInput);
    }

    $: {
        if (interfaceValueInput !== undefined && interfaceValueInput !== null) {
            length.set(interfaceValueInput.length);
        }
    }

    onMount(() => {
        autoCompleteValueInput = "fjdaksl";
        autoCompleteUnsubscribe = autocomplete.subscribe(data => {
            autoCompleteValueInput = data;
        });

        interfaceRef.focus();
    });

    onDestroy(() => {
        if (autoCompleteUnsubscribe && {}.toString.call(autoCompleteUnsubscribe) === '[object Function]') {
            autoCompleteUnsubscribe();
        }
    });

    function setAutoCompleteValue(value: string) {
        autoCompleteValueInput = value;
    }

</script>

<style>

    input {
        height: 100%;
        width: 100%;
        
        letter-spacing: 0.2rem;
        font-size: 4rem;
        
        padding: 0;
        border: none;
        opacity: 1;

        color: white;

        background-color: transparent;
    }  

    input[type=text]:focus {
        outline: none;
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
        
        color: #FFFFFF;

        width: calc(100% - 4rem);
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
</style>

<div class="interface-field" autocomplete="off" autocapitalize="false" spellcheck="false">
    <form>    
        <input class="interface-input" bind:this="{interfaceRef}" bind:value="{interfaceValueInput}" type="text" >
    </form>
    <input readonly class="autocomplete" bind:value="{autoCompleteValueInput}" type="text">
</div>