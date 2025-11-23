import { describe, it, expect } from 'vitest';
import { Site, type SiteParams } from '~/lib/models/Site';
import { google } from '~/lib/constants/sites';

describe('URL functions', () => {
	it('should return true if text exist in URL query', () => {
		const currentUrl = 'https://duckduckgo.com/?q=123+site%3Areddit.com';
		const queryOperator = 'site:reddit.com';

		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const textExists = site.textExistsInQuery(currentUrl, queryOperator);
		expect(textExists).toBe(true);
	});

	it("should return false if text doesn't exist in URL query", () => {
		const currentUrl = 'https://duckduckgo.com/?q=123+site%3Agoogle.com.com';
		const queryOperator = 'site:reddit.com';

		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const textExists = site.textExistsInQuery(currentUrl, queryOperator);
		expect(textExists).toBe(false);
	});

	it('should add multiple strings to text', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google';
		const queryOperators = ['site:reddit.com', '-site:google.com'];
		const queryOperatorsString = queryOperators.join(' ');

		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const updatedUrl = site.addTextToQueryInUrl(
			currentUrl,
			queryOperatorsString,
			queryOperators,
		);
		expect(updatedUrl).toBe(
			'https://duckduckgo.com/?q=google+site%3Areddit.com+-site%3Agoogle.com',
		);
	});

	it('should add space-separated strings to text', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google';
		const queryOperators = ['site:reddit.com', 'NOT site:google.com'];
		const queryOperatorsString = queryOperators.join(' ');

		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const updatedUrl = site.addTextToQueryInUrl(
			currentUrl,
			queryOperatorsString,
			queryOperators,
		);
		expect(updatedUrl).toBe(
			'https://duckduckgo.com/?q=google+site%3Areddit.com+NOT+site%3Agoogle.com',
		);
	});

	it('should add multiple parameters to URL', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google';
		const urlParams: SiteParams[] = [{ kbe: 0 }, { kbg: -1 }];
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');

		let newUrl = currentUrl;
		for (const param of urlParams) {
			newUrl = site.setCustomParamsInUrl(newUrl, param);
		}
		expect(newUrl).toBe('https://duckduckgo.com/?q=google&kbe=0&kbg=-1');
	});

	it('should return true if parameter exists in URL', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google&kbe=0';
		const urlParam = { kbe: 0 };
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');

		const urlParamExists = site.hasParamsInUrl(currentUrl, urlParam);
		expect(urlParamExists).toBe(true);
	});

	it('should return false if parameter has a different value in URL', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google&kbe=0';
		const urlParam = { kbe: 1 };
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');

		const urlParamExists = site.hasParamsInUrl(currentUrl, urlParam);
		expect(urlParamExists).toBe(false);
	});

	it('should return false if parameter is missing from URL', () => {
		const currentUrl = 'https://duckduckgo.com/?q=google&kbe=0';
		const urlParam = { kbg: 0 };
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');

		const urlParamExists = site.hasParamsInUrl(currentUrl, urlParam);
		expect(urlParamExists).toBe(false);
	});

	it('should return default site operator URL to include results from a specific website', () => {
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const siteString = site.constructSiteOperator('include', 'reddit.com');

		expect(siteString).toBe('site:reddit.com');
	});

	it('should return default site operator URL to exclude results from a specific website', () => {
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const siteString = site.constructSiteOperator('exclude', 'google.com');

		expect(siteString).toBe('-site:google.com');
	});

	it('should return multiple valid host globs', () => {
		const site = new Site('Google', 'google.com', '', 'q=', [
			'google.com',
			'google.cat',
			'google.ae',
		]);
		const siteGlobs = site.getSiteHostsGlob();

		expect(siteGlobs).toStrictEqual([
			'*://*.google.com/*q=*',
			'*://*.google.cat/*q=*',
			'*://*.google.ae/*q=*',
		]);
	});

	it('should return a valid generic host regex', () => {
		const site = new Site('DuckDuckGo', 'duckduckgo.com', '', 'q=');
		const hostRegex = site.getSiteHostRegex();

		expect(hostRegex).toBe(
			`^https?:\\/\\/([a-z0-9.-]+\\.)?duckduckgo\\.com.*[?&]q=`,
		);
	});

	it('should return a valid Google host regex', () => {
		const site = google;
		const hostRegex = site.getSiteHostRegex();

		expect(hostRegex).toBe(
			`^https?:\\/\\/([a-z0-9.-]+\\.)?google\\.[a-z0-9.-]+\\/search.*[?&]q=`,
		);
	});
});
