<script>
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { editTodo } from '../firebase';

	/**
	 * The list of tasks to display
	 * @type {Object[]}
	 */
	export let tasks;

	function handleCompletedChange(e) {
		e.target.closest('form').requestSubmit();
	}

	async function handleMarkCompletedSubmit(e) {
		const data = Object.fromEntries(new FormData(e.target));

		await editTodo({
			...tasks.find((task) => task.id === data.id),
			completed: data.completed === 'on'
		});
	}
</script>

{#each tasks as task, i (task.id)}
	<div class="task-item" animate:flip={{ duration: 200 }} transition:slide>
		<form on:submit|preventDefault={handleMarkCompletedSubmit}>
			<input type="hidden" name="id" value={task.id} />
			<input
				type="checkbox"
				name="completed"
				bind:checked={task.completed}
				aria-label={`${task.completed ? 'Unmark' : 'mark'} task as completed`}
				on:change={handleCompletedChange}
			/>
		</form>
		<span class="task-text" class:completed={task.completed}>{task.text}</span>
	</div>
{/each}

<style>
	.task-item {
		background-color: var(--task-bg);
		height: 50px;
		display: flex;
		align-items: center;
		padding-left: 20px;
		gap: 20px;
		overflow: hidden;
		border-bottom: 1px solid var(--border-color);
		color: var(--task-txt-color);
		position: relative;
	}

	input[type='checkbox'] {
		width: 20px;
		height: 20px;
		border: 1px solid var(--border-color);
		border-radius: 50%;
		appearance: none;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		position: relative;
	}

	input[type='checkbox']:checked {
		background: linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%));
	}

	input[type='checkbox']:checked:after {
		content: ' ';
		background-image: url($lib/images/icon-check.svg);
		position: absolute;
		z-index: 1;
		left: 5px;
		top: 5px;
		right: 5px;
		bottom: 5px;
		background-size: cover;
		cursor: pointer;
	}

	.task-text.completed {
		text-decoration: line-through;
		color: var(--completed-color);
	}
</style>
