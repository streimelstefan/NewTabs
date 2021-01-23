<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { background } from './_utils/background';
	import type { ImgData } from './_utils/background';
	
	let containerDiv: HTMLElement;
	
	let unsubscribeBackground;
	onMount(() => {
		unsubscribeBackground = background.subscribe((img: ImgData) => {
			if (img !== null) {	
				containerDiv.style.backgroundImage = 'url(' + img.img + ')';
			}
		});

	});

	onDestroy(() => {
		if (unsubscribeBackground && {}.toString.call(unsubscribeBackground) === '[object Function]') {
			unsubscribeBackground();
		}
	});
</script>

<style>
	.background-img {
		height: 100vh;
		width: 100vw;
		background-repeat: no-repeat;
    	background-attachment: fixed;
	}
</style>

<div class="background-img container" bind:this={containerDiv}>
	<slot/>
</div>


