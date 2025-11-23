import { sites } from '~/lib/constants/sites';

export const dateOptionStorage = 'dateOption';
export const customDateOptionStorage = 'customDateOption';
export const customDateStartOptionStorage = 'startDate';
export const customDateEndOptionStorage = 'endDate';
export const redditOptionStorage = 'includeOnlyReddit';
export const googleOverviewOptionStorage = 'hideGoogleOverview';
export const googleOverviewInjectOptionStorage = 'injectGoogleOverview';
export const googleAiModeInjectOptionStorage = 'injectGoogleAiMode';
export const duckAiChatOptionStorage = 'hideDuckAiChat';
export const duckAiAssistantOptionStorage = 'hideDuckAiAssistant';
export const duckAiImageFilterOptionStorage = 'enableDuckAiImageFilter';
export const excludeSitesFromSearchOptionStorage = 'excludeSites';
export const disableCopilotOptionStorage = 'disableCopilot';
export const braveSummaryOptionStorage = 'hideBraveSummary';
export const braveAskInjectOptionStorage = 'hideBraveAsk';

export const sitesToExcludeFromSearch = 'excludedSites';

export const showAdditionalOptionsOptionStorage = 'showAdditionalOptions';

export const optionStorageDefinitions: string[] = [
	redditOptionStorage,
	googleOverviewOptionStorage,
	duckAiChatOptionStorage,
	duckAiAssistantOptionStorage,
	braveSummaryOptionStorage,
	duckAiImageFilterOptionStorage,
	excludeSitesFromSearchOptionStorage,
	disableCopilotOptionStorage,
	googleOverviewInjectOptionStorage,
	googleAiModeInjectOptionStorage,
	braveAskInjectOptionStorage,
];

export const allSyncStorageDefinitions: string[] = [
	...sites.map((site) => site.id),
	...optionStorageDefinitions.map((option) => option),
	dateOptionStorage,
	customDateOptionStorage,
	customDateStartOptionStorage,
	customDateEndOptionStorage,
	sitesToExcludeFromSearch,
];
