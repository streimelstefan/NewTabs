<script lang="ts">
	import Interface from '../components/interface.svelte';
	import Clock from '../components/clock.svelte';

	import { onDestroy, onMount } from 'svelte';
	import { keys, length } from './_utils/interface';

	let showInterface = false;
	let interfaceLength = 0;
	let lastInterfaceLength = 0;

	let skipInterfaceDissapearance = false;

	let lengthUnsubscribe;
	let keysUnsubscribe;
	onMount(() => {
		keysUnsubscribe = keys.subscribe(key => {
			if (key === null) return;

			if (!key.key.startsWith('F')) {
				showInterface = true;
			}

			if (interfaceLength === 0 && key.code === 'Backspace') {
				if (!skipInterfaceDissapearance && lastInterfaceLength !== 0) {
					skipInterfaceDissapearance = true;
				} else {
					showInterface = false;
					skipInterfaceDissapearance = false;
					lastInterfaceLength = 0;
				}
			}
		});

		lengthUnsubscribe = length.subscribe(length => {
			lastInterfaceLength = interfaceLength;
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
		top: 45%;
		left: 50%;

		transform: translate(-50%, -50%);

		color: white;
		height: 10vh;
		width: 50vw;
	}
</style>

<div class="center">
{#if !showInterface}
	<Clock></Clock>
{/if}
	<Interface hide="{!showInterface}" length="{interfaceLength}"></Interface>	
</div>