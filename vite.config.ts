import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from '@samrum/vite-plugin-web-extension';
import path from 'path';
import { getManifest } from './src/manifest.js';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			tsconfigPaths(),
			svelte(),
			webExtension({
				manifest: getManifest(Number(env.MANIFEST_VERSION)),
			}),
		],
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
				'@components': path.resolve(__dirname, './src/lib/components'),
			},
		},
	};
});
