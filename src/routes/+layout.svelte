<script>
	import './styles.css';
	import moon from '$lib/images/icon-moon.svg';
	import sun from '$lib/images/icon-sun.svg';
	import { enhance } from '$app/forms';

	let darkMode = false;
	function handleThemeClick() {
		darkMode = !darkMode;
	}

	// function handleSubmit() {
	// 	if (newTodoText) {
	// 		// tasks.push({
	// 		// 	id: tasks.length + 1,
	// 		// 	text: newTodoText,
	// 		// 	completed: false
	// 		// });
	// 		newTodoText = '';
	// 	}
	// }

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
	<main>
		<div class="header">
			<h1>TODO</h1>
			<button aria-label={`Set ${darkMode ? 'light' : 'dark'} mode`} on:click={handleThemeClick}
				><img src={darkMode ? sun : moon} alt="Toggle dark mode" /></button
			>
		</div>
		<div class="add_todo_input">
			<div class="circle" />
			<form method="post" use:enhance>
				<input type="text" name="text" placeholder="Create a new todo..." />
			</form>
		</div>
		<div class="tasks-container">
			<slot />
		</div>
	</main>
</div>

<style>
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

	input {
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

	form {
		height: 100%;
		flex: 1;
	}

	.tasks-container {
		border-radius: 5px;
		overflow: hidden;
		box-shadow: 1px 1px 20px 9px rgb(0 0 0 / 20%);
	}
</style>
