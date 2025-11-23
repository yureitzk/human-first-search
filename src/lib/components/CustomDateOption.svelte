<script lang="ts">
	import { DatePicker } from '@svelte-plugins/datepicker';
	import { format } from 'date-fns';
	import {
		customDateOptionStorage,
		customDateStartOptionStorage,
		customDateEndOptionStorage,
	} from '~/lib/constants/storageDefinitions';

	const today: number = Date.now();
	const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;

	const getDateFromToday = (days: number): number => {
		return Date.now() - days * MILLISECONDS_IN_DAY;
	};

	let startDate: number | '' = getDateFromToday(29);
	let endDate: number | '' = today;
	let dateFormat: string = 'MMM d, yyyy';
	let isOpen: boolean = false;

	let formattedStartDate: string = '';
	let formattedEndDate: string = '';

	const saveDateRangeToStorage = async (): Promise<void> => {
		if (chrome?.storage?.sync) {
			await chrome.storage.sync.set({
				[customDateOptionStorage]: {
					[customDateStartOptionStorage]: startDate,
					[customDateEndOptionStorage]: endDate,
				},
			});
		}
	};

	const loadDateRangeFromStorage = async (): Promise<void> => {
		if (chrome?.storage?.sync) {
			chrome.storage.sync.get([customDateOptionStorage], (result) => {
				if (result[customDateOptionStorage]) {
					startDate =
						result[customDateOptionStorage][
							customDateStartOptionStorage
						] ?? startDate;
					endDate =
						result[customDateOptionStorage][
							customDateEndOptionStorage
						] ?? endDate;

					startDate = startDate ? Number(startDate) : '';
					endDate = endDate ? Number(endDate) : '';
				}
			});
		}
	};

	$: if (startDate !== undefined && endDate !== undefined) {
		saveDateRangeToStorage();
	}

	loadDateRangeFromStorage();

	const onClearDates = (): void => {
		startDate = '';
		endDate = '';
		saveDateRangeToStorage();
	};

	const toggleDatePicker = (): void => {
		isOpen = !isOpen;
	};

	const formatDate = (dateString: number | ''): string => {
		if (!dateString || isNaN(new Date(dateString).getTime())) {
			return '';
		}
		return format(new Date(dateString), dateFormat);
	};

	$: formattedStartDate = formatDate(startDate);
	$: formattedEndDate = formatDate(endDate);
</script>

<div class="date-filter">
	<DatePicker
		bind:isOpen
		bind:startDate
		bind:endDate
		isRange
	>
		<div
			class="date-field"
			on:click={toggleDatePicker}
			on:keydown={(e) => e.key === 'Enter' && toggleDatePicker()}
			role="button"
			tabindex="0"
			class:open={isOpen}
		>
			<i class="icon-calendar" />
			<div class="date">
				{#if startDate}
					{formattedStartDate} - {formattedEndDate}
				{:else}
					Pick a date
				{/if}
			</div>
			{#if startDate}
				<span
					on:click={onClearDates}
					on:keydown={(e) => e.key === 'Enter' && onClearDates()}
					role="button"
					tabindex="0"
				>
					<i class="os-icon-x" />
				</span>
			{/if}
		</div>
	</DatePicker>
</div>

<style>

	:root {
		--datepicker-state-active: #fd9745;
	}

	.date-filter {
		margin-top: 15px;
	}

	.date-field {
		align-items: center;
		background-color: #fff;
		border-bottom: 1px solid #000000;
		display: inline-flex;
		gap: 8px;
		min-width: 100px;
		padding: 16px;
	}

	.date-field.open {
		border-bottom: 1px solid #fd9745;
	}

	.date-field .icon-calendar {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEmSURBVHgB7ZcPzcIwEMUfXz4BSCgKwAGgACRMAg6YBBxsOMABOAAHFAXgAK5Z2Y6lHbfQ8SfpL3lZaY/1rb01N+BHUKSMNBfEJjZWISA56Uo6C2KvVpkgFn9oRx9vICFtUT1JKO3tvRtZdjBxXQs+YY+1FenIfuesPUGVVLzfRWKvmrSzbbN19wS+kAb2+sCEuUxrYzkbe4YvCVM2Vr5NPAkVa+van7Wn38U95uTpN5TJ/A8ZKemAakmbmJJGpI0gVmwA0huieFItjG19DgTHtwIZhCfZq3ztCuzQYh+FKBSvusjAGs8PnLYkLgMf34JoIBqIBqKBaIAb0Kw9RlhMCTbzzPWAqYq7LsuPaGDUsYmznaOk5zChUJTNQ4TFVMkrOL4HPsoNn26PxROHCggAAAAASUVORK5CYII=)
			no-repeat center center;
		background-size: 14px 14px;
		height: 14px;
		width: 14px;
	}

	@media screen and (max-width: 48rem) {
		:global(.datepicker) {
			--datepicker-calendar-width: 100%;
			--datepicker-container-width: 100%;

			--datepicker-calendar-container-grid-template-columns: repeat(
				7,
				40px
			);

			--datepicker-calendar-day-width: 40px;
			--datepicker-calendar-day-height: 40px;
			--datepicker-calendar-range-included-height: var(
				--datepicker-calendar-day-height
			);
			--datepicker-calendar-header-padding: var(
				--datepicker-padding-small
			);
			--datepicker-calendar-header-margin: 0 0
				var(--datepicker-margin-small) 0;
			--datepicker-calendar-padding: var(--datepicker-padding-base);
			--datepicker-container-top: -40%;
		}

		:global(.datepicker) {
			position: static !important;
		}
	}

	:global(.calendars-container) {
		width: fit-content !important;
	}
</style>
