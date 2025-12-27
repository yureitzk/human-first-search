import { type Browser } from 'webextension-polyfill';
import {
	type SiteParams,
	type Site,
	Google,
	DuckDuckGo,
} from '~/lib/models/Site';
import { type ChromeRule } from '~/lib/models/ChromeRule';
import { constructUrlHostname, constructUrlParams } from '~/lib/utils/sites';
import {
	chromeRules,
	duckDuckGoChromeRule,
	googleChromeRule,
} from '~/lib/constants/chromeRules';

export const convertQueryParamsToKeyValue = (
	params: SiteParams[],
): chrome.declarativeNetRequest.QueryKeyValue[] => {
	const keyValueParams = params.flatMap((param) =>
		Object.entries(param).map(([key, value]) => ({
			key: String(key),
			value: String(value),
		})),
	);

	return keyValueParams;
};

export async function chromeUrlParamsCosntructor(
	site: Site,
	browser: Browser,
): Promise<SiteParams[]> {
	let urlParams = await constructUrlParams(site, browser);

	// Managed by network rules
	if (site instanceof Google) {
		urlParams = site.deleteSiteParam(urlParams, site.overviewParam);
	}

	return urlParams;
}

export async function removeChromeRules(idsToRemove: number[]) {
	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: idsToRemove,
	});
}

export async function removeAllChromeRules() {
	const rules = await chrome.declarativeNetRequest.getDynamicRules();

	const ruleIdsToRemove = rules.map((rule) => rule.id);

	if (ruleIdsToRemove.length > 0) {
		await removeChromeRules(ruleIdsToRemove);
	}
}

export async function addAllChromeRules(browser: Browser) {
	for (const chromeRule of chromeRules) {
		await chromeRuleController(chromeRule, browser);
	}
}

export async function updateChromeRules(
	chromeRule: ChromeRule,
	rule: chrome.declarativeNetRequest.Rule,
) {
	await chrome.declarativeNetRequest.updateDynamicRules({
		removeRuleIds: [chromeRule.id],
		addRules: [rule],
	});
}

export async function chromeRuleController(
	chromeRule: ChromeRule,
	browser: Browser,
): Promise<void> {
	let urlParams = await chromeRuleUrlParamsConstructor(chromeRule, browser);
	let queryRule: chrome.declarativeNetRequest.Rule;
	let keyValueParams = convertQueryParamsToKeyValue(urlParams);

	if (chromeRule === googleChromeRule && chromeRule.site instanceof Google) {
		// To avoid unnecessary redirects on pages, e.g. images, news, etc
		const searchParamRegex = chromeRule.site.getSearchParamRegex(['udm', 'tbm']);
		queryRule = chromeRule.getAddTransformRule(
			keyValueParams,
			searchParamRegex,
			2,
		);
	} else if (
		chromeRule === duckDuckGoChromeRule &&
		chromeRule.site instanceof DuckDuckGo
	) {
		const hostname = await constructUrlHostname(chromeRule.site, browser);

		queryRule =
			hostname !== chromeRule.site.domain
				? chromeRule.getHostnameRedirectRule(hostname, 2)
				: chromeRule.getAddTransformRule(keyValueParams);
	} else {
		queryRule = chromeRule.getAddTransformRule(keyValueParams);
	}
	const isSiteEnabled = await chromeRule.site.getStorageStatus(browser);

	isSiteEnabled
		? await updateChromeRules(chromeRule, queryRule)
		: await removeChromeRules(chromeRule.getDeleteRule());
}

async function chromeRuleUrlParamsConstructor(
	chromeRule: ChromeRule,
	browser: Browser,
): Promise<SiteParams[]> {
	let urlParams = await constructUrlParams(chromeRule.site, browser);

	if (chromeRule.site instanceof Google) {
		const siteParamExists = chromeRule.site.siteParamExists(
			urlParams,
			chromeRule.site.overviewParam,
		);

		if (siteParamExists && chromeRule === googleChromeRule) {
			urlParams = chromeRule.site.deleteSiteParam(
				urlParams,
				chromeRule.site.overviewParam,
			);
		}
	}

	return urlParams;
}
