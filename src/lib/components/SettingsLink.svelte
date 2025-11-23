<script lang="ts">
	import Button from '@components/Button.svelte';

	function handleClick() {
		chrome.runtime.openOptionsPage();
		window.close();
	}
</script>

<Button buttonText={'Settings'} on:click={handleClick} classList={'btn--full'} />

