<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let checked: boolean;
	export let id: string; 
	const dispatch = createEventDispatcher();

	function handleChange() {
		dispatch('change', checked);
	}
</script>

<label class="toggle">
	<input type="checkbox" {id} bind:checked on:change={handleChange} />
	<span class="slider"></span>
</label>

<style>
	.toggle {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 24px;
		flex-shrink: 0;
	}

	.toggle input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		transition: 0.4s;
		border: 1px solid #000000;
		border-radius: 6px;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 14px;
		width: 14px;
		left: 4px;
		top: 50%;
		background-color: #fff;
		transition: 0.4s;
		border: 1px solid #000000;
		border-radius: 30%;
		transform: translateY(-50%);
	}

	input:checked + .slider {
		background-color: #fd9745;
	}

	input:checked + .slider:before {
		transform: translate(24px, -50%);
	}
</style>
