<script>
	import './styles.css';
	import moon from '$lib/images/icon-moon.svg';
	import sun from '$lib/images/icon-sun.svg';
	import { page } from '$app/stores';
	import Links from './Links.svelte';
	import { addTodo, clearCompleted, listenCounts } from '../firebase';

	let darkMode = false;
	let data = $page.data;

	function handleThemeClick() {
		darkMode = !darkMode;
	}

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

	async function handleAddTaskSubmit(e) {
		try {
			const data = Object.fromEntries(new FormData(e.target));
			await addTodo({
				text: data.text,
				completed: false
			});
			e.target.reset();
		} catch (e) {
			// TODO: handle error
			console.error(e);
		}
	}

	async function handleClearCompleted() {
		await clearCompleted();
	}

	listenCounts((newData) => {
		data = { ...data, ...newData };
	});
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Todo app" />
</svelte:head>

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
		<div class="add_todo_input">
			<div class="circle" />
			<form on:submit|preventDefault={handleAddTaskSubmit}>
				<input type="text" name="text" placeholder="Create a new todo..." />
			</form>
		</div>

		<div class="tasks-container">
			<slot />
			<div class="bottom-bar">
				<div>{data.countActive} items left</div>
				<div class="links">
					<Links
						countAll={data.countAll}
						countActive={data.countActive}
						countCompleted={data.countCompleted}
					/>
				</div>

				<button on:click={handleClearCompleted}>Clear Completed </button>
			</div>
		</div>

		<div class="mobile-links">
			<Links
				countAll={data.countAll}
				countActive={data.countActive}
				countCompleted={data.countCompleted}
			/>
		</div>
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
