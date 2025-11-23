<script>
	import { onMount } from 'svelte';
	import Button from '@components/Button.svelte';

	export let title = '';
	export let storageName = '';
	let sites = '';
	let text = 'Save';

	onMount(() => {
		chrome.storage.sync.get(storageName, (data) => {
			sites = (data[storageName] || []).join('\n');
		});
	});

	function saveSites() {
		const siteArray = sites
			.split('\n')
			.map((site) => site.trim())
			.filter((site) => site !== '');

		chrome.storage.sync.set({ [storageName]: siteArray }, () => {
			text = 'Saved!';

			setTimeout(() => {
				text = 'Save';
			}, 1200);
		});
	}
</script>

<h3>{title}</h3>
<p class="info">
	<i>Search engines limit query length. Avoid excluding too many websites.</i><br>
	<i>To visually hide lots of sites from search results, I'd recommend <a href="https://github.com/gorhill/uBlock">uBlock Origin</a> with <a href="https://github.com/iorate/ublacklist/">ublacklist</a> and <a href="https://github.com/laylavish/uBlockOrigin-HUGE-AI-Blocklist">AI Blocklist</a>.</i>
</p>
<textarea
	bind:value={sites}
	spellcheck="false"
	placeholder="Enter sites here..."
></textarea>
<Button buttonText={text} on:click={saveSites} />

<style>
	h3 {
		font-size: 1.2em;
		display: inline-block;
		margin-top: 0;
		margin-bottom: 8px;
		text-align: left;
	}

	.info {
		margin-top: 0;
		margin-bottom: 10px;
	}

	textarea {
		width: 100%;
		min-height: 6em;
		resize: vertical;
		padding: 10px;
		border: 2px solid #000;
		border-radius: 4px;
		background-color: #ffffff;
		color: #333333;
		font-size: 14px;
		margin-bottom: 10px;
		box-sizing: border-box;
	}
</style>
