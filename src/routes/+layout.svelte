<script>
	import './styles.css';
	import moon from '$lib/images/icon-moon.svg';
	import sun from '$lib/images/icon-sun.svg';
	import { page } from '$app/stores';
	import Links from './Links.svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';

	let darkMode = false;
	function handleThemeClick() {
		darkMode = !darkMode;
	}

	export let data;

	$: countAll = data.countAll ?? 0;
	$: countCompleted = data.countCompleted ?? 0;
	$: countActive = data.countActive ?? 0;

	let isAddingTask = false;
	let isClearingCompleted = false;

	$: {
		// When darkmode changes, toggle the class on the body
		if (typeof window !== 'undefined') {
			if (darkMode) {
				document?.body.classList.add('dark');
			} else {
				document?.body.classList.remove('dark');
			}
		}
	}

	function handleEnhanceAddTask() {
		isAddingTask = true;
		return async ({ update }) => {
			// This will trigger a re-run of all `load` functions and replace our optimistic UI local changes with the real data
			await update();
			isAddingTask = false;
		};
	}

	function handleEnhanceClearCompleted() {
		isClearingCompleted = true;

		return async ({ update }) => {
			await update();
			isClearingCompleted = false;
		};
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
			<button aria-label={`Set ${darkMode ? 'light' : 'dark'} mode`} on:click={handleThemeClick}>
				<img src={darkMode ? sun : moon} alt="Toggle dark mode" />
			</button>
		</div>
		<div class="add_todo_input" class:adding={isAddingTask}>
			<div class="circle" />
			<form method="post" action="/?/addTask" use:enhance={handleEnhanceAddTask}>
				<input type="text" name="text" placeholder="Create a new todo..." disabled={isAddingTask} />
			</form>
		</div>
		<div class="tasks-container">
			{#if $navigating}
				<div class="loading">Loading...</div>
			{:else}
				<slot />
			{/if}

			<div class="bottom-bar">
				<div>{countActive} items left</div>
				<div class="links">
					<Links {countAll} {countActive} {countCompleted} />
				</div>
				<form method="POST" action="/?/clear" use:enhance={handleEnhanceClearCompleted}>
					<button disabled={isClearingCompleted}>Clear Completed </button>
				</form>
			</div>
		</div>
		<div class="mobile-links">
			<Links {countAll} {countActive} {countCompleted} />
		</div>
		<p>Drag and drop to reorder list (Desktop only)</p>
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
		padding: 0 20px;
		box-sizing: border-box;
	}

	h1 {
		color: white;
		letter-spacing: 10px;
	}

	p {
		margin-top: 50px;
		text-align: center;
		color: var(--actions-color);
		font-size: 12px;
	}

	.add_todo_input {
		background-color: var(--task-bg);
		height: 50px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		padding-left: 20px;
		gap: 10px;
		overflow: hidden;
		margin-bottom: 30px;
	}

	.add_todo_input.adding {
		opacity: 0.5;
	}

	.add_todo_input:focus-within {
		outline: 2px solid var(--bright-blue);
	}

	.circle {
		width: 20px;
		height: 20px;
		border: 1px solid var(--border-color);
		border-radius: 50%;
		box-sizing: border-box;
	}

	.add_todo_input input {
		border: none;
		font-family: inherit;
		font-size: 16px;
		height: 100%;
		box-sizing: border-box;
		width: 100%;
		padding-left: 10px;
		background: transparent;
		color: var(--task-txt-color);
		outline: none;
	}

	.add_todo_input form {
		height: 100%;
		flex: 1;
	}

	.tasks-container {
		border-radius: 5px;
		overflow: hidden;
		box-shadow: 1px 1px 20px 9px rgb(0 0 0 / 20%);
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--task-bg);
		padding: 15px;
		font-size: 14px;
		color: var(--task-txt-color);
	}

	.bottom-bar button {
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--task-txt-color);
		font-family: inherit;
	}

	.links {
		display: flex;
		gap: 15px;
	}

	.mobile-links {
		display: none;
	}

	.loading {
		background: white;
		padding: 10px;
		font-size: smaller;
		text-align: center;
		color: darkgray;
	}

	button:disabled {
		opacity: 0.5;
	}

	@media screen and (max-width: 768px) {
		.links {
			display: none;
		}

		.mobile-links {
			display: flex;
			background-color: var(--task-bg);
			padding: 15px;
			margin-top: 20px;
			border-radius: 5px;
			font-size: 14px;
			gap: 20px;
			justify-content: center;
		}
	}
</style>
