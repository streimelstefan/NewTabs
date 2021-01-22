<script lang="ts">
	import { onMount } from 'svelte';
	import {loadImgFromUrl} from './_utils/background';

	onMount(async () => {
		const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		
		console.log(await loadImgFromUrl('https://picsum.photos/' + vw + '/' + vh));
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

<div class="background-img container">

</div>


