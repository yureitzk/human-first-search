<script lang="ts">
	import AdditionalOption from '@components/AdditionalOption.svelte';
	import {
		redditOptionStorage,
		googleOverviewOptionStorage,
		duckAiChatOptionStorage,
		duckAiAssistantOptionStorage,
		duckAiImageFilterOptionStorage,
		duckNoAiRedirectOptionStorage,
		excludeSitesFromSearchOptionStorage,
		disableCopilotOptionStorage,
		googleOverviewInjectOptionStorage,
		googleAiModeInjectOptionStorage,
		braveSummaryOptionStorage,
		braveAskInjectOptionStorage
	} from '~/lib/constants/storageDefinitions';
	export let showAdditionalOptions = false;
</script>

{#if showAdditionalOptions}
	<div class="accordion-content">
		<AdditionalOption
			name={'Show only results from Reddit'}
			storageId={redditOptionStorage}
		/>
		<AdditionalOption
			name={'Exclude websites from search query'}
			storageId={excludeSitesFromSearchOptionStorage}
		/>
		<AdditionalOption
			name={'Remove Google Overview (redirect to web)'}
			storageId={googleOverviewOptionStorage}
		/>
		<AdditionalOption
			name={'Hide Google Overview from page'}
			storageId={googleOverviewInjectOptionStorage}
		/>
		<AdditionalOption
			name={'Hide Google AI Mode from page'}
			storageId={googleAiModeInjectOptionStorage}
		/>
		<AdditionalOption
			name={'Disable Duck.ai Chat'}
			storageId={duckAiChatOptionStorage}
		/>
		<AdditionalOption
			name={'Disable DuckDuckGo Assist'}
			storageId={duckAiAssistantOptionStorage}
		/>
		<AdditionalOption
			name={'Redirect to DuckDuckGo No AI'}
			storageId={duckNoAiRedirectOptionStorage}
		/>
		<AdditionalOption
			name={'Enable DuckDuckGo filter for AI-Generated Images'}
			storageId={duckAiImageFilterOptionStorage}
		/>
		<AdditionalOption
			name={'Hide Bing Copilot'}
			storageId={disableCopilotOptionStorage}
		/>
		<AdditionalOption
			name={'Disable Brave AI Summary'}
			storageId={braveSummaryOptionStorage}
		/>
		<AdditionalOption
			name={'Hide Brave Ask from page'}
			storageId={braveAskInjectOptionStorage}
		/>
	</div>
{/if}

<style>
	.accordion-content {
		overflow: hidden;
	}
</style>
