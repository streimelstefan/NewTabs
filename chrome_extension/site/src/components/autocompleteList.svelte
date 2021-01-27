<script lang="ts">
    import { fade } from 'svelte/transition';
    
    export let list: string[] = ["Google", "Yahoo", "DuckDuckGo"];

    export let up = true;

    let localList: {
        item: string,
        stopShowing: boolean
    }[] = [
        {
            item: "Google",
            stopShowing: false
        },
        {
            item: "Yahoo", 
            stopShowing: false
        }
    ];

    $: () => {
        list.forEach(item => {
            localList.push({item, stopShowing: false});
        });
    }

    $: console.log(localList);

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
        {#each localList as item (item.item)}
        <li class="item" on:click="{() => handleClick(item)}"  class:show="{!item.stopShowing}">
            { item.item }
        </li >
        {/each}
    </ul>
</div>