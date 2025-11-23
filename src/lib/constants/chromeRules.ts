import { sites, google } from '~/lib/constants/sites';
import { ChromeRule } from '~/lib/models/ChromeRule';

export const chromeRules: ChromeRule[] = [];

sites.forEach((site, index) => {
	const siteRule = new ChromeRule(index + 1, site);
	chromeRules.push(siteRule);
});
export const googleChromeRule = new ChromeRule(chromeRules.length + 1, google);
chromeRules.push(googleChromeRule);
