import type { Browser } from 'webextension-polyfill';
import {
	dateOptionStorage,
	customDateOptionStorage,
	customDateEndOptionStorage,
	customDateStartOptionStorage,
	sitesToExcludeFromSearch,
} from '~/lib/constants/storageDefinitions';
import { OptionDate, DateValues } from '~/lib/models/OptionDate';
import { dates, customDate } from '~/lib/constants/dates';
import { formatDate } from '~/lib/utils/dates';

async function getCustomDateFromStorage(
	browser: Browser,
): Promise<DateValues | undefined> {
	try {
		const result = await browser.storage.sync.get(customDateOptionStorage);
		const customDateObj = result[customDateOptionStorage];

		const dateBefore = customDateObj[customDateStartOptionStorage];
		const dateAfter = customDateObj[customDateEndOptionStorage];

		if (dateBefore || dateAfter) {
			return {
				valueAfter: dateAfter
					? formatDate(new Date(dateAfter))
					: formatDate(new Date('1970-01-01')),
				valueBefore: dateBefore
					? formatDate(new Date(dateBefore))
					: formatDate(new Date()),
			};
		}

		return undefined;
	} catch (error) {
		console.error('Error fetching custom date from storage:', error);
		return undefined;
	}
}

export async function getDateFromStorage(
	browser: Browser,
): Promise<DateValues | undefined> {
	try {
		const result = await browser.storage.sync.get(dateOptionStorage);
		const dateId = result[dateOptionStorage];

		if (dateId !== null && dateId !== undefined) {
			for (const date of dates) {
				if (date.id === customDate.id) {
					return await getCustomDateFromStorage(browser);
				} else if (dateId === date.id) {
					return date.date;
				}
			}
		}
		return undefined;
	} catch (error) {
		console.error('Error fetching date from storage:', error);
		return undefined;
	}
}

export async function setDateToStorage(
	optionDate: OptionDate,
	browser: Browser,
) {
	try {
		await browser.storage.sync.set({
			[dateOptionStorage]: optionDate.id,
		});
	} catch (error) {
		console.error('Error setting storage data for date:', error);
	}
}

export async function setExcludedSitesToStorage(
	excludedSites: string[],
	browser: Browser,
) {
	try {
		await browser.storage.sync.set({
			[sitesToExcludeFromSearch]: excludedSites
		});
	} catch (error) {
		console.error('Error setting storage data for excluded sites:', error);
	}
}

export async function setOptionValueToLocalStorage(
	option: string,
	optionValue: boolean,
	browser: Browser,
) {
	try {
		await browser.storage.local.set({
			[option]: optionValue,
		});
	} catch (error) {
		console.error('Error setting storage for option value:', error);
	}
}

export async function setOptionValueToSyncStorage(
	option: string,
	optionValue: boolean,
	browser: Browser,
) {
	try {
		await browser.storage.sync.set({
			[option]: optionValue,
		});
	} catch (error) {
		console.error('Error setting storage for option value:', error);
	}
}

export async function getExcludedSitesFromStorage(
	browser: Browser,
): Promise<string[] | undefined> {
	try {
		const result = await browser.storage.sync.get(
			sitesToExcludeFromSearch,
		);
		const sitesArray = result[sitesToExcludeFromSearch];

		if (sitesArray !== null && sitesArray !== undefined) {
			return sitesArray;
		}
		return undefined;
	} catch (error) {
		console.error('Error fetching excluded sites from storage:', error);
		return undefined;
	}
}

export async function getOptionValueFromStorage(
	option: string,
	browser: Browser,
): Promise<boolean | undefined> {
	try {
		const result = await browser.storage.sync.get(
			option,
		);
		const optionValue = result[option];

		if (optionValue !== null && optionValue !== undefined) {
			return optionValue;
		}
		return undefined;
	} catch (error) {
		console.error('Error fetching option value from storage:', error);
		return undefined;
	}
}

export async function setDateRangeToStorage(
	startDate: string | number,
	endDate: string | number,
	browser: Browser,
) {
	try {
		await browser.storage.sync.set({
			[customDateOptionStorage]: {
				[customDateStartOptionStorage]: startDate,
				[customDateEndOptionStorage]: endDate,
			},
		});
	} catch (error) {
		console.error('Error setting date range to storage:', error);
	}
}
