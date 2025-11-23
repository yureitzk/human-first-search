import { Site, Google, DuckDuckGo, Brave } from '../models/Site';
import type { Browser } from 'webextension-polyfill';
import type { SiteParams } from '../models/Site';
import {
	optionStorageDefinitions,
	duckAiAssistantOptionStorage,
	duckAiChatOptionStorage,
	googleOverviewOptionStorage,
	excludeSitesFromSearchOptionStorage,
	redditOptionStorage,
	duckAiImageFilterOptionStorage,
	braveSummaryOptionStorage
} from '../constants/storageDefinitions';
import { sites } from '../constants/sites';
import {
	getDateFromStorage,
	getExcludedSitesFromStorage,
	getOptionValueFromStorage,
} from './storage';

export const getSiteDomains = (): string[] => {
	return sites.map((site: Site) => site.domain);
};

export const getEnabledOptions = async (
	browser: Browser,
): Promise<string[]> => {
	const enabledOptions = await Promise.all(
		optionStorageDefinitions.map(async (option) => {
			const isEnabled = await getOptionValueFromStorage(option, browser);
			return isEnabled ? option : null;
		}),
	);

	return enabledOptions.filter(Boolean) as string[];
};

export const constructUrlParams = async (
	site: Site,
	browser: Browser,
	options?: string[],
): Promise<SiteParams[]> => {
	const params: SiteParams[] = [];
	const enabledOptions = options || (await getEnabledOptions(browser));

	const dateParams = await getDateFromStorage(browser).then((currentDate) =>
		site.getDateParams(currentDate?.valueBefore, currentDate?.valueAfter),
	);
	params.push(dateParams);

	const optionHandlers: Record<string, () => Promise<void>> = {
		[googleOverviewOptionStorage]: async () => {
			if (site instanceof Google && site?.overviewParam) {
				params.push(site.overviewParam);
			}
		},
		[duckAiChatOptionStorage]: async () => {
			if (site instanceof DuckDuckGo && site?.disableChatParam) {
				params.push(site.disableChatParam);
			}
		},
		[duckAiAssistantOptionStorage]: async () => {
			if (site instanceof DuckDuckGo && site?.disableAssistantParam) {
				params.push(site.disableAssistantParam);
			}
		},
		[braveSummaryOptionStorage]: async () => {
			if (site instanceof Brave && site?.disableSummaryParam) {
				params.push(site.disableSummaryParam);
			}
		},
		[duckAiImageFilterOptionStorage]: async () => {
			if (site instanceof DuckDuckGo && site?.disableAiImagesParam) {
				params.push(site.disableAiImagesParam);
			}
		},
	};

	await Promise.all(
		enabledOptions.map(async (option) => {
			const handler = optionHandlers[option];
			if (handler) {
				await handler();
			}
		}),
	);

	return params;
};

export const constructUrlQuery = async (
	site: Site,
	browser: Browser,
	options?: string[],
): Promise<string[]> => {
	const queryStringArray: string[] = [];
	const enabledOptions = options || (await getEnabledOptions(browser));

	const optionHandlers: Record<string, () => Promise<void>> = {
		[redditOptionStorage]: async () => {
			const siteString = site.constructSiteOperator('include', 'reddit.com');
			queryStringArray.push(siteString);
		},
		[excludeSitesFromSearchOptionStorage]: async () => {
			const excludedSites = await getExcludedSitesFromStorage(browser);
			for (const excludedSite of excludedSites ?? []) {
				const siteString = site.constructSiteOperator('exclude', excludedSite);
				queryStringArray.push(siteString);
			}
		},
	};

	await Promise.all(
		enabledOptions.map(async (option) => {
			const handler = optionHandlers[option];
			if (handler) {
				await handler();
			}
		}),
	);

	return queryStringArray;
};

