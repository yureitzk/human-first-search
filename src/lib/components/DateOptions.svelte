<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DateOption from '@components/DateOption.svelte';
	import CustomDateOption from '@components/CustomDateOption.svelte';
	import { dateOptionStorage } from '~/lib/constants/storageDefinitions';
	import { dates } from '~/lib/constants/dates';

	let selectedValue = '';

	const handleStorageChange = (changes: {
		[key: string]: chrome.storage.StorageChange;
	}) => {
		if (changes[dateOptionStorage]) {
			selectedValue = changes[dateOptionStorage].newValue;
		}
	};

	onMount(async () => {
		chrome.storage.sync.get([dateOptionStorage], (data) => {
			if (data[dateOptionStorage]) {
				selectedValue = data[dateOptionStorage];
			}
		});
	});

	onDestroy(() => {
		chrome.storage.onChanged.removeListener(handleStorageChange);
	});

	$: {
		if (selectedValue) {
			chrome.storage.sync.set({ [dateOptionStorage]: selectedValue });
		}
	}
</script>

<div class="radio-group">
	{#each dates as date}
		<DateOption
			id={date.id}
			name={date.name}
			bind:group={selectedValue}
			value={date.id}
		/>
	{/each}
</div>

{#if selectedValue === 'custom'}
	<CustomDateOption />
{/if}

<style>
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
