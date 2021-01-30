<script lang="ts">
    import { keys } from "../routes/_utils/interface";
    import { onDestroy, onMount } from "svelte";
import { getIfOnServer } from "../routes/_utils/utils";

    let sizer: HTMLDivElement;

    let currentIndex: number;
    
    let minWidth = 0;
    let largestItem = "";
    
    let inited = false;

    let localList: {
        item: string;
        stopShowing: boolean;
        id: number;
        remove: boolean;
    }[] = [];

    export let up = true;
    export let list: string[] = [];

    let lastActionUp = false;

    let unsubscribeKeys = keys.subscribe((key) => {
        if (key === null) return;

        if (currentIndex < 0) {
            currentIndex = 0;
        }
        if (currentIndex >= localList.length) {
            currentIndex = localList.length - 1;
        }

        if (key.code === "ArrowUp") {
            if (up && !lastActionUp) {
                lastActionUp = true;
                return;
            }

            if (up) {
                localList[currentIndex].remove = false;
                const temp = currentIndex;
                setTimeout(() => {
                    localList[temp].stopShowing = false;
                }, 10);
                currentIndex++;
            } else {
                localList[currentIndex].stopShowing = true;
                const temp = currentIndex;
                setTimeout(() => {
                    localList[temp].remove = true;
                }, 500);
                currentIndex++;
            }
        }

        if (key.code === "ArrowDown") {
            if (!up && lastActionUp) {
                lastActionUp = false;
                return;
            }

            if (up) {
                localList[currentIndex].stopShowing = true;
                const temp = currentIndex;
                setTimeout(() => {
                    localList[temp].remove = true;
                }, 500);
                currentIndex--;
            } else {
                localList[currentIndex].remove = false;
                const temp = currentIndex;
                setTimeout(() => {
                    localList[temp].stopShowing = false;
                }, 10);
                currentIndex--;
            }
        }
    });

    $: {
        let changed = false;
        for (let item of list) {
            if (
                localList.find((element) => element.item === item) === undefined
            ) {
                changed = true;
                localList.push({
                    item,
                    stopShowing: up,
                    id: Math.random(),
                    remove: up
                });
            }
        }

        if (changed) {
            for (let item of localList) {
                largestItem = item.item.length > largestItem.length ? item.item : largestItem;
            }

            if (inited) {
                sizer.innerText = largestItem;
                minWidth = sizer.clientWidth;
            }


            currentIndex = 0;
        }
    }

    onDestroy(() => {
        if (
            unsubscribeKeys &&
            {}.toString.call(unsubscribeKeys) === "[object Function]"
        ) {
            unsubscribeKeys();
        }
    });

    onMount(() => {
        inited = true;

        sizer.innerText = largestItem;
        minWidth = sizer.clientWidth;

        console.log(minWidth);
    });

    function handleClick(item: { item: string; stopShowing: boolean }) {
        item.stopShowing = true;
        localList = localList;
        setTimeout(() => {
            localList = localList.filter((data) => data.item !== item.item);
        }, 500);
    }
</script>

<div class="container" class:down={!up} style="--autocomplete-min-width: {minWidth}px">
    <ul>
        {#each localList as item (item.id)}
            <li
                class="item"
                on:click={() => handleClick(item)}
                class:show={!item.stopShowing}
                class:remove={item.remove}
            >
                {item.item}
            </li>
        {/each}
    </ul>
</div>
<div id="sizer" bind:this={sizer}></div>

<style>
    div {
        background-color: black;
    }

    #sizer {
        position: absolute;
        display: inline-block;
        visibility: hidden;

        font-weight: 600;

        padding: 1rem;
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

    .remove {
        display: none;
    }

    .item:hover {
        background-color: #66666665;
    }

    .container {
        min-width: var(--autocomplete-min-width);

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
