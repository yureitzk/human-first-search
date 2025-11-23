<script lang="ts">
	import { onMount } from 'svelte';
	import Toggle from '@components/Toggle.svelte';

	export let name: string;
	export let storageId: string;
	let checked = false;

	const loadStoredValue = async () => {
		chrome.storage.sync.get(storageId, (result) => {
			checked = result[storageId];
		});
	};

	onMount(() => {
		loadStoredValue();
	});

	const handleChange = () => {
		chrome.storage.sync.set({ [storageId]: checked });
	};
</script>

<div class="toggle-row">
	<label for={storageId}>{name}</label>
	<Toggle bind:checked id={storageId} on:change={handleChange} />
</div>

<style>
	.toggle-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		column-gap: 0.5rem;
	}

	.toggle-row label {
		display: inline-block;
		font-weight: 500;
	}
</style>
