<script>
	import './styles.css';
	import moon from '$lib/images/icon-moon.svg';
	import sun from '$lib/images/icon-sun.svg';
	import { page } from '$app/stores';

	let darkMode = false;
	function handleThemeClick() {
		darkMode = !darkMode;
	}

	$: {
		if (typeof window !== 'undefined') {
			if (darkMode) {
				document?.body.classList.add('dark');
			} else {
				document?.body.classList.remove('dark');
			}
		}
	}
</script>

<div class="app">
	<div class="hero" />
	{#if $page.error}
		<div class="error-banner">
			An error occured: {$page.error.message}
		</div>
	{/if}
	<main>
		<div class="header">
			<h1>TODO</h1>
			<button aria-label={`Set ${darkMode ? 'light' : 'dark'} mode`} on:click={handleThemeClick}
				><img src={darkMode ? sun : moon} alt="Toggle dark mode" /></button
			>
		</div>
		<slot />
	</main>
</div>

<style>
	.error-banner {
		background: red;
		color: white;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 10px;
		text-align: center;
	}
	.hero {
		background-image: var(--hero-img);
		background-size: cover;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 300px;
		z-index: -1;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 35px;
		width: 100%;
	}

	.header > button {
		background: transparent;
		border: none;
	}

	.header > button > img {
		width: 20px;
		height: 20px;
	}

	main {
		max-width: 600px;
		width: 100%;
		margin: 80px auto 0;
		padding: 0 40px;
		box-sizing: border-box;
	}

	h1 {
		color: white;
		letter-spacing: 10px;
	}
</style>
