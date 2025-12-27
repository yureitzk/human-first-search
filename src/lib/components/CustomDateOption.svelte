<script lang="ts">
	import AirDatepicker, {
		type AirDatepickerPositionCallback,
	} from 'air-datepicker';
	import 'air-datepicker/air-datepicker.css';
	import localeEn from 'air-datepicker/locale/en';
	import { onMount } from 'svelte';
	import type { Browser } from 'webextension-polyfill';
	import {
		customDateOptionStorage,
		customDateStartOptionStorage,
		customDateEndOptionStorage,
	} from '~/lib/constants/storageDefinitions';
	import {
		getDateFromToday,
		localDateToUtc,
		utcToLocalDate,
	} from '~/lib/utils/dates';
	import { setDateRangeToStorage } from '~/lib/utils/storage';

	let startDate: number | '' = getDateFromToday(29);
	let endDate: number | '' = Date.now();
	let datepickerInput: HTMLInputElement;
	let dateFormat: string = 'MMM d, yyyy';
	let datepickerInstance: AirDatepicker | null = null;

	const loadDateRangeFromStorage = async (): Promise<void> => {
		if (!chrome?.storage?.sync) return;

		return new Promise((resolve) => {
			chrome.storage.sync.get([customDateOptionStorage], (result) => {
				const storedData = result[customDateOptionStorage];
				if (storedData) {
					startDate = Number(storedData[customDateStartOptionStorage]) || startDate;
					endDate = Number(storedData[customDateEndOptionStorage]) || endDate;
				}
				resolve();
			});
		});
	};

	onMount(async () => {
		await loadDateRangeFromStorage();

		const positionDatepicker: AirDatepickerPositionCallback = ({
			$datepicker,
			$target,
			$pointer,
			done,
		}) => {
			const inputRect = $target.getBoundingClientRect();
			const dpHeight = $datepicker.clientHeight;
			const dpWidth = $datepicker.clientWidth;
			const viewportHeight = window.innerHeight;
			const spaceBelow = viewportHeight - inputRect.bottom;
			const spaceAbove = inputRect.top;

			let top: number;
			if (spaceBelow >= dpHeight + 10) {
				top = inputRect.bottom + window.scrollY + 8;
			} else if (spaceAbove >= dpHeight + 10) {
				top = inputRect.top + window.scrollY - dpHeight - 8;
			} else {
				top = inputRect.bottom + window.scrollY + 8;
			}

			let left = inputRect.left + inputRect.width / 2 - dpWidth / 2;
			const maxLeft = window.innerWidth - dpWidth - 10;
			left = Math.max(10, Math.min(left, maxLeft));

			$datepicker.style.left = `${left}px`;
			$datepicker.style.top = `${top}px`;
			$pointer.style.display = 'none';

			return () => {
				done();
			};
		};

		const selectedDates = [
			utcToLocalDate(startDate),
			utcToLocalDate(endDate),
		].filter((d) => d !== '');

		const uniqueSelectedDates =
			selectedDates.length === 2 &&
			selectedDates[0].getTime() === selectedDates[1].getTime()
				? [selectedDates[0]]
				: selectedDates;

		const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

		datepickerInstance = new AirDatepicker(datepickerInput, {
			locale: localeEn,
			range: true,
			multipleDatesSeparator: ' - ',
			dateFormat,
			position: isTouchDevice ? 'top' : positionDatepicker,
			maxDate: new Date(),
			selectedDates: uniqueSelectedDates,
			isMobile: isTouchDevice,
			onSelect: async (date) => {
				if (Array.isArray(date.date) && date.date.length >= 1) {
					startDate = localDateToUtc(date.date[0], false);
					endDate =
						date.date.length > 1
							? localDateToUtc(date.date[1], true)
							: localDateToUtc(date.date[0], true);
				}
				await setDateRangeToStorage(startDate, endDate, chrome as unknown as Browser);
			},
		});

		datepickerInput?.addEventListener('mousedown', (e) => {
			if (datepickerInstance && datepickerInstance.visible) {
				e.preventDefault();
				datepickerInstance.hide();
			}
		});
	});
</script>

<div class="date-filter">
	<input
		bind:this={datepickerInput}
		readonly
		class="input"
		id="date-picker"
		type="text"
		placeholder="Pick a date"
	/>
</div>

<style>
	.date-filter {
		margin-top: 15px;
		position: relative;
		width: fit-content;
		max-width: 100%;
	}

	.input {
		padding: 6px 8px 6px calc(20px + 6px + 8px);
		border-radius: 4px;
		outline: 2px solid #000;
		border: none;
		cursor: pointer;
		box-sizing: border-box;
		max-width: 100%;
	}

	.input:active,
	.input:focus-visible,
	.input:focus {
		outline-color: #fd9745;
	}

	.date-filter::before {
		left: 8px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		content: '';
		mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEmSURBVHgB7ZcPzcIwEMUfXz4BSCgKwAGgACRMAg6YBBxsOMABOAAHFAXgAK5Z2Y6lHbfQ8SfpL3lZaY/1rb01N+BHUKSMNBfEJjZWISA56Uo6C2KvVpkgFn9oRx9vICFtUT1JKO3tvRtZdjBxXQs+YY+1FenIfuesPUGVVLzfRWKvmrSzbbN19wS+kAb2+sCEuUxrYzkbe4YvCVM2Vr5NPAkVa+van7Wn38U95uTpN5TJ/A8ZKemAakmbmJJGpI0gVmwA0huieFItjG19DgTHtwIZhCfZq3ztCuzQYh+FKBSvusjAGs8PnLYkLgMf34JoIBqIBqKBaIAb0Kw9RlhMCTbzzPWAqYq7LsuPaGDUsYmznaOk5zChUJTNQ4TFVMkrOL4HPsoNn26PxROHCggAAAAASUVORK5CYII=)
			no-repeat 50% 50%;
		background-color: #000;
		width: 20px;
		height: 20px;
		mask-size: 20px;
		display: inline-block;
		pointer-events: none;
	}
</style>
