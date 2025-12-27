import type { Browser } from 'webextension-polyfill';
import { isValidDate, formatDate } from '../utils/dates';
import { DateValues } from './OptionDate';

export interface SiteParams {
	[key: string]: string | number | boolean;
}

export class Site {
	name: string;
	id: string;
	domain: string;
	domains: string[];
	path: string;
	query: string;
	searchParam: string = 'q';
	dateParam: string = 'date';

	constructor(
		name: string,
		domain: string,
		path: string = '',
		query: string = '',
		domains: string[] = [domain],
	) {
		this.name = name;
		this.id = this.name.toLowerCase();
		this.domain = domain;
		this.path = path;
		this.query = query;
		this.domains = domains;
	}

	constructSiteOperator(type: 'include' | 'exclude', value: string): string {
		switch (type) {
			case 'include':
				return `site:${value}`;
			case 'exclude':
				return `-site:${value}`;
		}
	}

	getFullUrl() {
		return `${this.domain}${this.path}${this.query ? '?' + this.query : ''}`;
	}

	getHostnameWithSubdomain(subdomain: string) {
		return `${subdomain}.${this.domain}`;
	}

	getDateParams(dateBefore?: string, dateAfter?: string): SiteParams {
		return {
			[this.dateParam]: `${dateBefore} - ${dateAfter}`,
		};
	}

	getDateQuery(dateBefore?: string, dateAfter?: string): string {
		let queryString = '';
		if (dateBefore && isValidDate(dateBefore))
			queryString += ` before:${dateBefore}`;
		if (dateAfter && isValidDate(dateAfter)) queryString += ` after:${dateAfter}`;

		return queryString.trim();
	}

	setDateInUrl(url: string, date: DateValues): string {
		const dateBefore = date.valueBefore;
		const dateAfter = date.valueAfter;
		let newUrl = '';

		if (this.searchParam === this.dateParam) {
			const dateQuery = this.getDateQuery(dateBefore, dateAfter);
			newUrl = this.addTextToQueryInUrl(url, dateQuery);
		} else {
			const dateParams = this.getDateParams(dateBefore, dateAfter);
			newUrl = this.setCustomParamsInUrl(url, dateParams);
		}

		return newUrl;
	}

	private isFilter(query: string): boolean {
		return query.includes(':');
	}

	textExistsInQuery(url: string, text: string): boolean {
		const urlObj = new URL(url);
		const searchParamValue = urlObj.searchParams.get(this.searchParam) || '';
		const decodedValue = decodeURIComponent(searchParamValue).trim();

		const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		const pattern = text.includes(' ')
			? new RegExp(`(^|\\s)${escaped}(?=\\s|$)`)
			: new RegExp(`\\b${escaped}\\b`);

		return pattern.test(decodedValue);
	}

	addTextToQueryInUrl(
		url: string,
		text: string,
		filterArray?: string[],
	): string {
		if (this.textExistsInQuery(url, text)) {
			return url;
		}

		const urlObj = new URL(url);
		let searchParamValue = urlObj.searchParams.get(this.searchParam) || '';

		const parts = searchParamValue.split(' ').filter(Boolean);
		const newParts: string[] = [];

		for (const part of parts) {
			const decodedPart = decodeURIComponent(part);
			if (!this.isFilter(decodedPart) || !filterArray?.includes(decodedPart)) {
				newParts.push(part);
			}
		}

		newParts.push(text);

		searchParamValue = newParts.join(' ').trim();
		urlObj.searchParams.set(this.searchParam, searchParamValue);

		return urlObj.toString();
	}

	setCustomParamsInUrl(url: string, params: SiteParams): string {
		const urlObj = new URL(url);

		let urlChanged = false;

		for (const key in params) {
			if (params.hasOwnProperty(key)) {
				if (urlObj.searchParams.get(key) !== String(params[key])) {
					urlObj.searchParams.set(key, `${params[key]}`);
					urlChanged = true;
				}
			}
		}

		return urlChanged ? urlObj.toString() : url;
	}

	async setStorageStatus(browser: Browser, status: boolean) {
		try {
			await browser.storage.sync.set({ [this.id]: status });
		} catch (error) {
			console.error('Error setting storage data for site:', error);
		}
	}

	async getStorageStatus(browser: Browser): Promise<boolean | undefined> {
		try {
			const result = await browser.storage.sync.get(this.id);
			const status = result[this.id];
			if (status !== null && status !== undefined) {
				return status === true;
			}
			return false;
		} catch (error) {
			return undefined;
		}
	}

	getSiteHostGlob(domain?: string): string {
		const siteDomain = domain || this.domain;
		return `*://*.${siteDomain}${this.path ? this.path + '?' : '/'}${this.query ? '*' + this.query : ''}*`;
	}

	getSiteHostsGlob(): string[] {
		const hostsGlob = this.domains.map((domain) => {
			return this.getSiteHostGlob(domain);
		});

		return hostsGlob;
	}

	getBareDomainWithSearchRegex(): string {
		const escapedDomain = this.domain.replace(/\./g, '\\.');
		const pathPattern = this.path ? this.path.replace(/\//g, '\\/') : '\\/.*';
		return `^https:\\/\\/${escapedDomain}${pathPattern}\\?.*${this.searchParam}=`;
	}

	getSiteHostRegex(): string {
		return `^https?:\\/\\/([a-z0-9.-]+\\.)?${this.domain.replace('.', '\\.')}${this.path ? this.path.replace(/\//g, '\\/') : ''}.*${this.query ? `[?&]${this.query.replace('=', '=')}` : ''}`;
	}

	getSearchParamRegex(paramNames: string[]): string {
		const paramPattern = paramNames
			.map((param) => `(?:[?&]${param}=[^&]*)`)
			.join('|');

		return `^https?:\\/\\/(?:[a-z0-9.-]+\\.)?${this.domain.replace('.', '\\.')}${this.path ? this.path.replace(/\//g, '\\/') : ''}.*(?:${paramPattern}).*$`;
	}

	private isEqual(param1: SiteParams, param2: SiteParams): boolean {
		const keys1 = Object.keys(param1);
		const keys2 = Object.keys(param2);

		if (keys1.length !== keys2.length) return false;

		return keys1.every((key) => param1[key] === param2[key]);
	}

	deleteSiteParam(
		paramsArray: SiteParams[],
		paramToRemove: SiteParams,
	): SiteParams[] {
		return paramsArray.filter((param) => !this.isEqual(param, paramToRemove));
	}

	siteParamExists(paramsArray: SiteParams[], paramToFind: SiteParams): boolean {
		return paramsArray.some((param) => this.isEqual(param, paramToFind));
	}

	hasParamsInUrl(url: string, params: SiteParams): boolean {
		const urlObj = new URL(url);
		const urlSearchParams = new URLSearchParams(urlObj.search);

		for (const key in params) {
			if (params.hasOwnProperty(key)) {
				const paramValues = urlSearchParams.getAll(key);
				const expectedValue = String(params[key]);

				const decodedParamValues = paramValues.map((value) =>
					decodeURIComponent(value),
				);

				if (
					decodedParamValues.length === 0 ||
					!decodedParamValues.some((value) => value === expectedValue)
				) {
					return false;
				}
			}
		}

		return true;
	}
}

export class Google extends Site {
	dateParam: string = 'tbs';
	overviewParam: SiteParams = {
		udm: 14,
	};

	aiModeParam: SiteParams = {
		udm: 50,
	};

	constructor(
		name: string,
		domain: string,
		path: string = '',
		query: string = '',
		domains: string[] = [domain],
	) {
		super(name, domain, path, query, domains);
	}

	private formatDate(date: string): string {
		const [year, month, day] = date.split('-');
		return `${parseInt(month, 10)}/${parseInt(day, 10)}/${year}`;
	}

	getSiteHostRegex(): string {
		const domain = 'google.*';
		let domainPattern = domain.replace('.', '\\.');
		if (domain.includes('*')) {
			domainPattern = domainPattern.replace('*', '[a-z0-9.-]+');
		}

		return `^https?:\\/\\/([a-z0-9.-]+\\.)?${domainPattern}${this.path ? this.path.replace(/\//g, '\\/') : ''}.*${this.query ? `[?&]${this.query.replace('=', '=')}` : ''}`;
	}

	getSearchParamRegex(paramNames: string[]): string {
		const paramPattern = paramNames
			.map((param) => `(?:[?&]${param}=[^&]*)`)
			.join('|');

		const domain = 'google.*';
		let domainPattern = domain.replace('.', '\\.');
		if (domain.includes('*')) {
			domainPattern = domainPattern.replace('*', '[a-z0-9.-]+');
		}

		return `^https?:\\/\\/(?:[a-z0-9.-]+\\.)?${domainPattern}${this.path ? this.path.replace(/\//g, '\\/') : ''}.*(?:${paramPattern}).*$`;
	}

	disableOverviewInUrl(url: string): string {
		const newUrl = this.setCustomParamsInUrl(url, this.overviewParam);

		return newUrl;
	}

	getDateParams(dateBefore?: string, dateAfter?: string): SiteParams {
		let params: SiteParams = {};
		let tbsQuery = 'cdr:1';

		if (dateAfter && dateBefore && new Date(dateAfter) > new Date(dateBefore)) {
			[dateAfter, dateBefore] = [dateBefore, dateAfter];
		}

		if (dateAfter && isValidDate(dateAfter)) {
			tbsQuery += `,cd_min:${this.formatDate(dateAfter)}`;
		}

		if (dateBefore && isValidDate(dateBefore)) {
			tbsQuery += `,cd_max:${this.formatDate(dateBefore)}`;
		}

		if (tbsQuery !== 'cdr:1') {
			params[this.dateParam] = tbsQuery;
		}

		return params;
	}
}

export class DuckDuckGo extends Site {
	dateParam: string = 'df';
	subdomainNoAi: string = 'noai';
	disableAssistantParam = {
		kbe: 0,
	};
	disableChatParam = {
		kbg: -1,
	};
	disableAiImagesParam = {
		kbj: 1,
	};

	constructor(
		name: string,
		domain: string,
		path: string = '',
		query: string = '',
		domains: string[] = [domain],
	) {
		super(name, domain, path, query, domains);
	}

	getDateParams(dateBefore?: string, dateAfter?: string): SiteParams {
		let params: SiteParams = {};

		if (dateBefore && dateAfter) {
			params[this.dateParam] = `${dateBefore}..${dateAfter}`;
		} else if (!dateAfter && dateBefore) {
			const dateBeforeOld = this.formatDate(new Date(Date.UTC(1970, 1, 1)));
			params[this.dateParam] = `${dateBeforeOld}..${dateBefore}`;
		} else if (!dateBefore && dateAfter) {
			const dateAfterNew = this.formatDate(new Date());
			params[this.dateParam] = `${dateAfter}..${dateAfterNew}`;
		}

		return params;
	}

	private formatDate(date: Date): string {
		return formatDate(date);
	}
}

export class Bing extends Site {
	dateParam: string = 'filters';

	constructor(
		name: string,
		domain: string,
		path: string = '',
		query: string = '',
		domains: string[] = [domain],
	) {
		super(name, domain, path, query);
	}

	private formatDateToNumber(date: string | Date): number {
		const epoch = new Date(Date.UTC(1970, 0, 1));
		const inputDate = new Date(date);

		const diffInMilliseconds = inputDate.getTime() - epoch.getTime();
		const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

		return diffInDays;
	}

	getDateParams(dateBefore?: string, dateAfter?: string): SiteParams {
		let params: SiteParams = {};

		const baseStringConstructor = (dateOne: string, dateTwo: string) => {
			return `ex1:"ez5_${dateOne}_${dateTwo}"`;
		};

		if (dateBefore && dateAfter) {
			const dateAfterFormatted = `${this.formatDateToNumber(dateAfter)}`;
			const dateBeforeFormatted = `${this.formatDateToNumber(dateBefore)}`;
			params[this.dateParam] = baseStringConstructor(
				dateBeforeFormatted,
				dateAfterFormatted,
			);
		} else if (!dateAfter && dateBefore) {
			const dateBeforeFormatted = `${this.formatDateToNumber(dateBefore)}`;
			const dateBeforeOld = `${this.formatDateToNumber(new Date(1970, 1, 1))}`;
			params[this.dateParam] = baseStringConstructor(
				dateBeforeOld,
				dateBeforeFormatted,
			);
		} else if (!dateBefore && dateAfter) {
			const dateAfterNew = `${this.formatDateToNumber(new Date())}`;
			const dateAfterFormatted = `${this.formatDateToNumber(dateAfter)}`;
			params[this.dateParam] = baseStringConstructor(
				dateAfterFormatted,
				dateAfterNew,
			);
		}

		return params;
	}
}

export class Brave extends Site {
	dateParam: string = 'tf';
	disableSummaryParam = {
		summary: 0,
	};

	constructor(
		name: string,
		domain: string,
		path: string = '',
		query: string = '',
		domains: string[] = [domain],
	) {
		super(name, domain, path, query, domains);
	}

	constructSiteOperator(type: 'include' | 'exclude', value: string): string {
		switch (type) {
			case 'include':
				return `site:${value}`;
			case 'exclude':
				return `NOT site:${value}`;
		}
	}

	getDateParams(dateBefore?: string, dateAfter?: string): SiteParams {
		let params: SiteParams = {};

		if (dateBefore && dateAfter) {
			params[this.dateParam] = `${dateBefore}to${dateAfter}`;
		} else if (!dateAfter && dateBefore) {
			const dateBeforeOld = this.formatDate(new Date(Date.UTC(1970, 1, 1)));
			params[this.dateParam] = `${dateBeforeOld}to${dateBefore}`;
		} else if (!dateBefore && dateAfter) {
			const dateAfterNew = this.formatDate(new Date());
			params[this.dateParam] = `${dateAfter}to${dateAfterNew}`;
		}

		return params;
	}

	private formatDate(date: Date): string {
		return formatDate(date);
	}
}
