<script lang="ts">
    import { keys } from '../routes/_utils/interface';
    import {onDestroy } from 'svelte';

    let unsubscribeKeys = keys.subscribe(key => {
        if (key === null) return;

        if (key.code === 'ArrowUp') {
            if (up) {
                localList[currentIndex].stopShowing = false;
                currentIndex++;
            } else {
                localList[currentIndex].stopShowing = true;
                currentIndex--;
            }
        }
        
        if (key.code === 'ArrowDown') {
            if (up) {
                localList[currentIndex].stopShowing = true;
                currentIndex--;
            } else {
                localList[currentIndex].stopShowing = false;
                currentIndex++;
            }
        }
    });

    

    export let up = true;

    let currentIndex: number;
    $: currentIndex = up ? 0 : localList.length;

    export let list: string[] = [];

    $: console.log(list);

    let localList: {
        item: string,
        stopShowing: boolean,
        id: number
    }[] = [];
    
    $: list.forEach(item => {
        console.log('adding');
            localList.push({
                item,
                stopShowing: !up,
                id: Math.random()
            });
        });
    
    onDestroy(() => {
        if (unsubscribeKeys &&
            {}.toString.call(unsubscribeKeys) === "[object Function]") {
                unsubscribeKeys();
            }
    })

    function handleClick(item: {item: string, stopShowing: boolean}) {
        console.log(item);
        item.stopShowing = true;
        localList = localList;
        setTimeout(() => {
            localList = localList.filter((data) => data.item !== item.item);
        }, 500);
    }   

</script>

<style>
    div {
        background-color: black;
    }

    .item {
        padding: 1rem;    
        padding-bottom: .5rem;
        padding-top: .5rem;
        transform: scaleX(0);
        opacity: 0;
        transition: all .5s ease-in-out;
    }

    .show {
        transform: scaleX(1);
        opacity: 1;
    }

    .item:hover {
        background-color: #66666665;
    }

    .container {
        min-width: 100px;

        font-weight: 600;

        padding-bottom: .5rem;
        padding-top: .5rem;

        background-color: #61616123;
        border-radius: 1rem 1rem 0 0;
    }
 
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .down {
        border-radius: 0 0 1rem 1rem;
    }
</style>

<div class="container" class:down="{!up}">
    <ul>
        {#each localList as item (item.id)}
        <li class="item" on:click="{() => handleClick(item)}"  class:show="{!item.stopShowing}">
            { item.item }
        </li >
        {/each}
    </ul>
</div>