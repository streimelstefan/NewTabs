<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Interface from '../components/interface.svelte';
	import { keys, length } from './_utils/interface';

	let showInterface = false;
	let interfaceLength = 0;

	let skipInterfaceDissapearance = false;

	let lengthUnsubscribe;
	let keysUnsubscribe;
	onMount(() => {
		keysUnsubscribe = keys.subscribe(key => {
			if (key === null) return;
			showInterface = true;

			if (interfaceLength === 0 && key.code === 'Backspace') {
				if (!skipInterfaceDissapearance) {
					skipInterfaceDissapearance = true;
				} else {
					showInterface = false;
					skipInterfaceDissapearance = false;
				}
			}
		})

		lengthUnsubscribe = length.subscribe(length => {
			interfaceLength = length;
		});
	});

	onDestroy(() => {
		if (keysUnsubscribe && {}.toString.call(keysUnsubscribe) === '[object Function]') {
			keysUnsubscribe();
			lengthUnsubscribe();
		}
	});
</script>

<style>
	.center {
		position: absolute;
		top: 50%;
		left: 50%;

		transform: translate(-50%, -50%);

		color: white;
		height: 10vh;
		width: 50vw;
	}
</style>

{#if showInterface}
	
<div class="center">
	<Interface length="{interfaceLength}"></Interface>
</div>

{/if}