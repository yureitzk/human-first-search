<script lang="ts">
	import pkg from '~/../package.json';

</script>

<footer>
	<p>Version: {pkg.version}</p>
	<a href={pkg.homepage}>Source code</a>
</footer>

<style>
	p {
		margin-top: 0;
	}

	a {
		color: #000;
	}
</style>
