<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let buttonText: string = 'Button';
	export let classList: string = '';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<button on:click={handleClick} class={`btn ${classList}`}>
	{buttonText}
</button>

<style>
	.btn {
		box-shadow:
			0 0 #0000,
			0 0 #0000,
			4px 4px 0px 0px #000;
		display: block;
		background-color: #fd9745;
		color: #000000;
		border: 2px solid #000;
		font-weight: 500;
		padding: 10px 20px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		transition-property: box-shadow;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.15s;
	}

	.btn:hover,
	.btn:active {
		box-shadow:
			0 0 #0000,
			0 0 #0000,
			0px 0px 0px 0px #000;
	}

	.btn--full {
		width: 100%;
	}
</style>
