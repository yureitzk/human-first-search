import type { Browser } from 'webextension-polyfill';
import { sites } from '~/lib/constants/sites';
import { before2023Date } from '~/lib/constants/dates';
import {
	setDateToStorage,
	setOptionValueToSyncStorage,
	setExcludedSitesToStorage,
	setOptionValueToLocalStorage,
} from '~/lib/utils/storage';
import {
	duckAiChatOptionStorage,
	duckAiAssistantOptionStorage,
	duckAiImageFilterOptionStorage,
	googleOverviewOptionStorage,
	disableCopilotOptionStorage,
	optionStorageDefinitions,
	googleOverviewInjectOptionStorage,
	showAdditionalOptionsOptionStorage,
	googleAiModeInjectOptionStorage,
	braveSummaryOptionStorage,
	braveAskInjectOptionStorage,
} from '~/lib/constants/storageDefinitions';
import {
	removeAllChromeRules,
	addAllChromeRules,
} from '~/lib/utils/chromeRules';

export async function setSettingsToDefault(browser: Browser) {
	if (chrome?.declarativeNetRequest !== undefined) {
		await removeAllChromeRules();
		await addAllChromeRules(browser);
	}

	await Promise.all(sites.map((site) => site.setStorageStatus(browser, true)));

	const defaultValues: Record<string, boolean> = {
		[googleOverviewOptionStorage]: true,
		[duckAiChatOptionStorage]: true,
		[duckAiAssistantOptionStorage]: true,
		[duckAiImageFilterOptionStorage]: true,
		[disableCopilotOptionStorage]: true,
		[googleOverviewInjectOptionStorage]: true,
		[googleAiModeInjectOptionStorage]: true,
		[braveSummaryOptionStorage]: true,
		[braveAskInjectOptionStorage]: true,
	};

	await Promise.all(
		optionStorageDefinitions.map((option) => {
			const value = defaultValues[option] ?? false;
			return setOptionValueToSyncStorage(option, value, browser);
		}),
	);
	await setDateToStorage(before2023Date, browser);
	await setExcludedSitesToStorage(['chatgpt.com'], browser);

	await setOptionValueToLocalStorage(
		showAdditionalOptionsOptionStorage,
		false,
		browser,
	);
}
