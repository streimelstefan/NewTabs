<script lang="ts">
    import { keys } from "../routes/_utils/interface";
    import { onDestroy } from "svelte";

    let unsubscribeKeys = keys.subscribe((key) => {
        if (key === null) return;
        console.log(currentIndex);

        if (key.code === "ArrowUp") {
            if (up) {
                localList[currentIndex].stopShowing = false;
                currentIndex++;
            } else {
                localList[currentIndex].stopShowing = true;
                currentIndex--;
            }
        }

        if (key.code === "ArrowDown") {
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
    let lastLength;
    export let list: string[] = [];

    $: {
        console.log({
            lengthArr: localList.length,
            lengthObj: Object.keys(localList).length,
            lengthCast: JSON.parse(JSON.stringify(localList)).length,
            localListString: JSON.stringify(localList),
            localList
        });
    }

    $: console.log(localList);

    let currentIndex: number;
    /*$: {

        
        if (internalUp !== up || lastLength != localList.length) {   
            for (let item in localList) {
                console.log(item);
            } 
            currentIndex = up ? 0 : localList.length;
            internalUp = up;
            console.log({
                internalUp,
                up,
                localList: localList,
                length: localList.length,
                currentIndex,
                update: internalUp !== up
            });
            lastLength = localList.length;
        }
    }*/

    $: {
        for (let item of list) {
            if (
                localList.find((element) => element.item === item) === undefined
            ) {
                localList.push({
                    item,
                    stopShowing: up,
                    id: Math.random(),
                });
            }
        }
    }

    let localList: {
        item: string;
        stopShowing: boolean;
        id: number;
    }[] = [];

    onDestroy(() => {
        if (
            unsubscribeKeys &&
            {}.toString.call(unsubscribeKeys) === "[object Function]"
        ) {
            unsubscribeKeys();
        }
    });

    function handleClick(item: { item: string; stopShowing: boolean }) {
        console.log(item);
        item.stopShowing = true;
        localList = localList;
        setTimeout(() => {
            localList = localList.filter((data) => data.item !== item.item);
        }, 500);
    }
</script>

<div class="container" class:down={!up}>
    <ul>
        {#each localList as item (item.id)}
            <li
                class="item"
                on:click={() => handleClick(item)}
                class:show={!item.stopShowing}
            >
                {item.item}
            </li>
        {/each}
    </ul>
</div>

<style>
    div {
        background-color: black;
    }

    .item {
        padding: 1rem;
        padding-bottom: 0.5rem;
        padding-top: 0.5rem;
        transform: scaleX(0);
        opacity: 0;
        transition: all 0.5s ease-in-out;
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

        padding-bottom: 0.5rem;
        padding-top: 0.5rem;

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
