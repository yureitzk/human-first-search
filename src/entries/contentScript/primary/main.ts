import type { Browser } from 'webextension-polyfill';
import { type Site } from '~/lib/models/Site';
import { google, bing, brave } from '~/lib/constants/sites';
import { getEnabledOptions } from '~/lib/utils/sites';
import {
	googleOverviewInjectOptionStorage,
	googleAiModeInjectOptionStorage,
	disableCopilotOptionStorage,
	braveAskInjectOptionStorage,
} from '~/lib/constants/storageDefinitions';
import { main as initAiMode } from './inject/aimode';
import { main as initOverview } from './inject/overview';
import { main as initCopilot } from './inject/copilot';
import { main as initAsk } from './inject/ask';

async function main() {
	function normalizeHost(h: string) {
		return h.replace(/^www\./i, '').toLowerCase();
	}

	async function isSiteEnabled(site: Site) {
		return await site.getStorageStatus(chrome as unknown as Browser);
	}

	const currentUrl = new URL(document.location.href);
	const host = normalizeHost(currentUrl.hostname);

	const matchGoogle = google.domains.includes(host);
	const matchBing = bing.domains.includes(host);
	const matchBrave = brave.domains.includes(host);

	const enabledGoogle = await isSiteEnabled(google);
	const enabledBing = await isSiteEnabled(bing);
	const enabledBrave = await isSiteEnabled(brave);

	const enabledOptions = await getEnabledOptions(chrome as unknown as Browser);

	const optionHandlers: Record<string, () => Promise<void>> = {
		[googleOverviewInjectOptionStorage]: async () => {
			if (matchGoogle && enabledGoogle) initOverview();
		},

		[googleAiModeInjectOptionStorage]: async () => {
			if (matchGoogle && enabledGoogle) initAiMode();
		},

		[disableCopilotOptionStorage]: async () => {
			if (matchBing && enabledBing) initCopilot();
		},

		[braveAskInjectOptionStorage]: async () => {
			if (matchBrave && enabledBrave) initAsk();
		},
	};

	await Promise.all(
		enabledOptions.map(async (option) => {
			const handler = optionHandlers[option];
			if (handler) {
				try {
					await handler();
				} catch (error) {
					console.error('Failed to inject script:', error);
				}
			}
		}),
	);
}

main();
