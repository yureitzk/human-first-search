<script lang="ts">
	import SearchEngine from '@components/SearchEngine.svelte';
	import Footer from '@components/Footer.svelte';
	import DateOptions from '@components/DateOptions.svelte';
	import AdditionalOptions from '@components/AdditionalOptions.svelte';
	import SitesEditor from '@components/SitesEditor.svelte';
	import Header from '@components/Header.svelte';
	import BingIcon from '@components/icons/Bing.svelte';
	import GoogleIcon from '@components/icons/Google.svelte';
	import DuckDuckGoIcon from '@components/icons/DuckDuckGo.svelte';
	import BraveIcon from '@components/icons/Brave.svelte';
	import { Google, Bing, DuckDuckGo, Brave } from '~/lib/models/Site';
	import RestoreToDefaultBtn from '@components/RestoreToDefaultBtn.svelte';
	import { sitesToExcludeFromSearch } from '~/lib/constants/storageDefinitions';
	import { sites } from '~/lib/constants/sites';
	import pkg from '~/../package.json';
</script>

<Header />

<svelte:head>
	<title>{pkg.displayName} Settings</title>
</svelte:head>

<section>
	<h2>Search Engines</h2>
	{#each sites as site}
		{#if site instanceof Bing}
			<SearchEngine id={site.id} name={site.name} icon={BingIcon} />
		{:else if site instanceof Google}
			<SearchEngine id={site.id} name={site.name} icon={GoogleIcon} />
		{:else if site instanceof DuckDuckGo}
			<SearchEngine id={site.id} name={site.name} icon={DuckDuckGoIcon} />
		{:else if site instanceof Brave}
			<SearchEngine id={site.id} name={site.name} icon={BraveIcon} />
		{/if}
	{/each}
</section>

<section class="sites-editor">
	<h2>Sites editor</h2>
	<SitesEditor title={'Excluded sites'} storageName={sitesToExcludeFromSearch} />
</section>

<section class="date-section">
	<h2>Date Options</h2>
	<DateOptions />
</section>

<section>
	<h2 class="accordion">Additional Options</h2>
	<AdditionalOptions showAdditionalOptions={true} />
	<RestoreToDefaultBtn />
</section>

<Footer />

<style>
	section {
		border-radius: 12px;
		padding: 1rem 0;
		margin-bottom: 1.5rem;
	}

	:global(.accordion-content) {
		margin-bottom: 0.5rem;
	}

	section:last-child {
		border-bottom: none;
		margin-bottom: 0;
	}

	h2 {
		color: #000000;
		font-weight: 500;
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}

	.sites-editor h2 {
		margin-bottom: 1.25rem;
	}

	.accordion {
		transition: 0.4s;
		width: fit-content;
	}

	.date-section {
		position: relative;
	}

	@media screen and (max-width: 48rem) {
		.accordion {
			cursor: pointer;
		}
	}

	@media screen and (min-width: 48rem) {
		section {
			padding: 1.5rem 0;
		}
	}
</style>
