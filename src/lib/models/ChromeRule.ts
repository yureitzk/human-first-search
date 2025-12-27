import { type Site } from '~/lib/models/Site';

export class ChromeRule {
	id: number;
	site: Site;

	constructor(id: number, site: Site) {
		this.id = id;
		this.site = site;
	}

	getDeleteRule() {
		const deleteRule = [this.id];
		return deleteRule;
	}

	getAddTransformRule(
		keyValueParams: chrome.declarativeNetRequest.QueryKeyValue[],
		regexFilterUrl?: string,
		priority?: number,
	) {
		const addRule = {
			id: this.id,
			priority: priority || 1,
			action: {
				type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
				redirect: {
					transform: {
						queryTransform: {
							addOrReplaceParams: keyValueParams,
						},
					},
				},
			},
			condition: {
				regexFilter: regexFilterUrl || this.site.getSiteHostRegex(),
				resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
			},
		};
		return addRule;
	}

	getHostnameRedirectRule = (
		newHostname: string,
		priority?: number,
	): chrome.declarativeNetRequest.Rule => {
		return {
			id: this.id,
			priority: priority || 1,
			action: {
				type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
				redirect: {
					transform: {
						host: newHostname,
					},
				},
			},
			condition: {
				regexFilter: this.site.getBareDomainWithSearchRegex(),
				resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
			},
		};
	};
}
