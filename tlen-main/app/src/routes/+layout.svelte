<script lang="ts">
	import './layout.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/logo_transparent.png" />
	<link rel="apple-touch-icon" href="/logo_transparent.png" />
</svelte:head>

{@render children()}
