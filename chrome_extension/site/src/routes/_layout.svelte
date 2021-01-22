<script lang="ts">
	import { onMount } from 'svelte';
	import {getIfImgIsTooOld, getImgFromDatabase, loadImgFromUrl, saveImgToDatabase} from './_utils/background';

	onMount(async () => {
		const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		
		const img = await loadImgFromUrl('https://picsum.photos/' + vw + '/' + vh);

		console.log(await getIfImgIsTooOld((await saveImgToDatabase(img, vh, vw, new Date(Date.now()))).data));

		console.log(await getImgFromDatabase());

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


