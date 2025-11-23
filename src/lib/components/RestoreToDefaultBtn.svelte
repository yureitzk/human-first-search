<script lang="ts">
	import type { Browser } from 'webextension-polyfill';
	import { setSettingsToDefault } from '~/lib/constants/defaultSettings';

	async function handleClick() {
		const isConfirmed = confirm(
			'Are you sure you want to reset the settings to default?',
		);

		if (isConfirmed) {
			try {
				await setSettingsToDefault(chrome as unknown as Browser);
				window.location.reload();
			} catch (error) {
				console.error('An error occurred while setting defaults:', error);
			}
		} else {
			console.log('Settings reset was canceled.');
		}
	}
</script>

<button on:click={handleClick} class="defaults-btn">Restore Defaults</button>

<style>
	.defaults-btn {
		box-shadow:
			0 0 #0000,
			0 0 #0000,
			4px 4px 0px 0px #000;
		display: block;
		width: fit-content;
		padding: 8px 14px;
		font-size: 0.875rem;
		background-color: #fd9745;
		box-sizing: border-box;
		border: 2px solid #000;
		font-weight: 500;
		border-radius: 4px;
		text-decoration: none;
		color: #000000;
		transition-property: box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
		cursor: pointer;
	}

	.defaults-btn:hover,
	.defaults-btn:active {
		box-shadow:
			0 0 #0000,
			0 0 #0000,
			0px 0px 0px 0px #000;
	}
</style>
