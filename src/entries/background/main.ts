import { type SiteParams, type Site, Google } from '~/lib/models/Site';
import browser from 'webextension-polyfill';
import { sites } from '~/lib/constants/sites';
import { chromeRules } from '~/lib/constants/chromeRules';
import { allSyncStorageDefinitions } from '~/lib/constants/storageDefinitions';
import {
	constructUrlParams,
	constructUrlQuery,
	getEnabledOptions,
} from '~/lib/utils/sites';
import { chromeRuleController } from '~/lib/utils/chromeRules';
import { setSettingsToDefault } from '~/lib/constants/defaultSettings';

browser.runtime.onInstalled.addListener(async () => {
	console.log('Extension installed');

	await setSettingsToDefault(browser);
	init();
});

browser.runtime.onStartup.addListener(async () => {
	init();
});

function init() {
	if (chrome?.declarativeNetRequest !== undefined) {
		manifestv3NetworkCode();
	} else {
		manifestv2NetworkCode();
	}
}

async function manifestv3NetworkCode() {
	chrome.storage.sync.onChanged.addListener(async function (changes) {
		try {
			const hasOptionChanged = Object.keys(changes).some((key) => {
				return allSyncStorageDefinitions.includes(key);
			});

			if (hasOptionChanged) {
				for (const chromeRule of chromeRules) {
					await chromeRuleController(chromeRule, browser);
				}
			}
		} catch (error) {
			console.error('An error during storage update', error);
		}
	});

	sites.forEach((site) => {
		const handleRequest = (details: chrome.webRequest.WebRequestDetails) => {
			chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
				try {
					const currentTab = tabs[0];
					if (!currentTab || !currentTab.id) return;

					const currentUrl = details.url;
					const enabledOptions = await getEnabledOptions(browser);

					// URL parameters are managed by chrome network rules
					const [queryOperators] = await Promise.all([
						constructUrlQuery(site, browser, enabledOptions),
					]);

					const missingQueryOperators =
						queryOperators.length > 0
							? queryOperators.some(
									(queryOperator: string) =>
										!site.textExistsInQuery(currentUrl, queryOperator),
								)
							: false;

					const isSiteEnabled = await site.getStorageStatus(browser);

					if (isSiteEnabled && missingQueryOperators) {
						let updatedUrl = currentUrl;

						const queryOperatorsString = queryOperators.join(' ');
						updatedUrl = site.addTextToQueryInUrl(
							updatedUrl,
							queryOperatorsString,
							queryOperators,
						);

						if (updatedUrl !== currentUrl) {
							chrome.tabs.update(currentTab.id, { url: updatedUrl });
						}
					}
				} catch (error) {
					console.error('An error during tab update', error);
				}
			});
		};

		chrome.webRequest.onBeforeRequest.addListener(handleRequest, {
			urls: site.getSiteHostsGlob(),
			types: ['main_frame'],
		});
	});
}

function manifestv2NetworkCode() {
	sites.forEach((site: Site) => {
		const handleBlockingRequest = async (
			details: browser.WebRequest.OnBeforeRequestDetailsType,
		) => {
			const isSiteEnabled = await site.getStorageStatus(browser);
			const currentUrl = details.url;

			const enabledOptions = await getEnabledOptions(browser);
			const urlParams = await constructUrlParams(site, browser, enabledOptions);
			const queryOperators = await constructUrlQuery(
				site,
				browser,
				enabledOptions,
			);

			const missingUrlParams = urlParams.some((param: SiteParams) => {
				return !site.hasParamsInUrl(currentUrl, param);
			});

			const missingQueryOperators = queryOperators.some(
				(queryOperator: string) =>
					!site.textExistsInQuery(currentUrl, queryOperator),
			);
			if (
				details.type === 'main_frame' &&
				isSiteEnabled === true &&
				(missingUrlParams || missingQueryOperators)
			) {
				let updatedUrl = currentUrl;

				for (const param of urlParams) {
					// To avoid unnecessary redirects on pages, e.g. images, news, etc
					if (site instanceof Google && param === site?.overviewParam) {
						const urlObj = new URL(currentUrl);
						const udmValue = urlObj.searchParams.get('udm');
						const tbmValue = urlObj.searchParams.get('tbm');

						if (udmValue || tbmValue) {
							continue;
						}
					}

					updatedUrl = site.setCustomParamsInUrl(updatedUrl, param);
				}

				const queryOperatorsString = queryOperators.join(' ');
				updatedUrl = site.addTextToQueryInUrl(
					updatedUrl,
					queryOperatorsString,
					queryOperators,
				);

				if (updatedUrl !== currentUrl) {
					return { redirectUrl: updatedUrl };
				}
			}

			return { cancel: false };
		};

		browser.webRequest.onBeforeRequest.addListener(
			handleBlockingRequest,
			{ urls: site.getSiteHostsGlob(), types: ['main_frame'] },
			['blocking'],
		);
	});
}

init();
