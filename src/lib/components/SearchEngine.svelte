<script lang="ts">
	import { onMount } from 'svelte';
	import Toggle from '@components/Toggle.svelte';
	import type { ComponentType } from 'svelte'; 

	export let id;
	export let name;
	export let icon: ComponentType | null = null;
	let checked = false;

	const loadStoredValue = async () => {
		chrome.storage.sync.get(id, (result) => {
			checked = result[id];
		});
	};

	onMount(() => {
		loadStoredValue();
	});

	const handleChange = (event: Event) => {
		chrome.storage.sync.set({ [id]: checked });
	};
</script>

<div class="search-engine">
	<label for={id}>
		{#if icon}
			<svelte:component this={icon} />
		{/if}
		<span>{name}</span>
	</label>
	<Toggle bind:checked id={id} on:change={handleChange} />
</div>

<style>
	.search-engine {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		align-items: center;
	}

	.search-engine label {
		font-weight: 500;
		text-transform: capitalize;
		font-size: 1rem;
		display: flex;
		align-items: center;
	}

	:global(.search-engine label > svg) {
		margin-right: 10px;
		width: 25px;
		height: 25px;
	}

	@media screen and (min-width: 48rem) {
		:global(.search-engine label > svg) {
			width: 35px;
			height: 35px;
		}

		.search-engine label {
			font-size: 1.2em;
		}

	}
</style>
