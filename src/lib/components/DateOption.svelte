<script lang="ts">
	export let id;
	export let name;
	export let value;
	export let group;
</script>

<label>
	<input type="radio" bind:group {value} {id} />
	{name}
</label>

<style>
	label {
		display: flex;
		align-items: center;
		cursor: pointer;
		width: fit-content;
	}

	input[type='radio'] {
		margin-right: 10px;
		appearance: none;
		width: 20px;
		height: 20px;
		border: 2px solid #000;
		border-radius: 50%;
		position: relative;
	}

	input[type='radio']::before {
		content: '';
		position: absolute;
		border-radius: 50%;
		background-color: transparent;
		transition: background-color 0.2s linear;
		width: 50%;
		height: 50%;
		top: 50%;
		left: 50%;
		background-color: #000;
		transform: translate(-50%, -50%) scale(0);
		transition: transform 0.3s ease;
	}

	input[type='radio']:checked::before {
		transform: translate(-50%, -50%) scale(1);
	}
</style>
