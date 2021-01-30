<script lang="ts">
    import { keys } from "../routes/_utils/interface";
    import { onDestroy } from "svelte";

    let unsubscribeKeys = keys.subscribe((key) => {
        if (key === null) return;

        if (currentIndex < 0) {
            currentIndex = 0;
        }
        if (currentIndex >= localList.length) {
            currentIndex = localList.length - 1;
        }

        if (key.code === "ArrowUp") {
            if (up && firstSwitch) {
                firstSwitch = false;
                return;
            }

            console.log({
                up,
                currentIndex
            });

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
            if (up && firstSwitch) {
                firstSwitch = false;
                return;
            }

            console.log({
                up,
                currentIndex
            });
            
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

    export let up = true;
    export let list: string[] = [];

    let firstSwitch = true;

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
            currentIndex = 0;
            
            console.log({
                localList
            });
        }
    }


    let currentIndex: number;
    

    let localList: {
        item: string;
        stopShowing: boolean;
        id: number;
        remove: boolean;
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
                class:remove={item.remove}
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

    .remove {
        display: none;
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
