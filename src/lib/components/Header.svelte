<script lang="ts">
	import logo from '~/assets/logo.png';
	import pkg from '~/../package.json';

	const logoImageUrl = new URL(logo, import.meta.url).href;
</script>

<header>
	<div class="logo">
		<img src={logoImageUrl} height="50" alt="" />
	</div>
	<h1>{pkg.displayName}</h1>
</header>

<style>

	.logo {
		max-width: 50px;
	}

	h1 {
		font-size: 2em;
		background-color: #fd9745;
	}

	header {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		column-gap: 10px;
		color: #000000;
	}
</style>
