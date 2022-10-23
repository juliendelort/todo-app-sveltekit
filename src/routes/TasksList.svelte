<script>
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { moveTask } from '../utils';
	import Links from './Links.svelte';

	/**
	 * The list of tasks to display
	 * @type {Object[]}
	 */
	export let tasks;

	/**
	 * The number of tasks in the list
	 * @type {number}
	 */
	export let countAll;
	/**
	 * The number of completed tasks
	 * @type {number}
	 */
	export let countCompleted;
	/**
	 * The number of active tasks
	 * @type {number}
	 */
	export let countActive;

	/**
	 * When dragging a task, id of task being hovered
	 * @type {number|null}
	 */
	let hoveredId = null;

	/**
	 * When dragging a task, id of task being dragged
	 * @type {number|null}
	 */
	let draggedId = null;

	function handleDragStart(e, id) {
		e.dataTransfer.dropEffect = 'move';
		draggedId = id;
	}

	async function handleDrop(e, idToInsertBefore) {
		e.stopPropagation(); // Otherwise when dropping on .drop-zone-end, handleDrop is called twice

		// Optimistic UI: move the task in the UI first
		tasks = moveTask(tasks, draggedId, idToInsertBefore, true);

		// Send the request
		const data = new FormData();
		data.append('idToMove', draggedId);
		data.append('idToInsertBefore', idToInsertBefore);

		await fetch('/?/moveTask', {
			method: 'POST',
			body: data
		});

		// re-run all `load` functions, following the successful update
		await invalidateAll();
	}

	function handleDragEnd(e) {
		hoveredId = null;
		draggedId = null;
	}

	function handleDragEnterLast(e) {
		hoveredId = -1;
	}

	function handleCompletedChange(e) {
		e.target.closest('form').requestSubmit();
	}

	function handleEnhanceAddTask({ form, data, action, cancel }) {
		form.reset();

		// Optimistic UI: Generate a new id and add a new (pending) task
		let id = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, '')
			.substr(2, 10);

		tasks = [
			...tasks,
			{
				id,
				text: data.get('text'),
				completed: false,
				pending: true
			}
		];

		// Also update the counters
		countAll++;
		countActive++;

		return async ({ result, update }) => {
			if (result.type !== 'success') {
				// Error: remove the pending task we just added
				tasks = tasks.filter((task) => task.id !== id);
				// ...And restore the counters
				countAll--;
				countActive++;
			}

			// This will trigger a re-run of all `load` functions and replace our optimistic UI local changes with the real data
			update();
		};
	}

	function handleEnhanceMarkCompleted({ form, data, action, cancel }) {
		let id = parseInt(data.get('id'));

		// Optimistic UI: set the task being edited as pending
		tasks = tasks.map((task) => {
			if (task.id === id) {
				task.pending = true;
				task.completed = !!data.get('completed');
			}

			return task;
		});

		// Update the counters
		if (!!data.get('completed')) {
			countCompleted++;
			countActive--;
		} else {
			countCompleted--;
			countActive++;
		}

		return async () => {
			// We're not using update here because we don't want the form to be reset
			await invalidateAll();
		};
	}

	function handleEnhanceClearCompleted({ form, data, action, cancel }) {
		// Optimistic UI: remove all completed tasks
		tasks = tasks.filter((task) => !task.completed);

		// Update the counters
		countCompleted = 0;

		return async () => {
			await invalidateAll();
		};
	}
</script>

<div class="add_todo_input">
	<div class="circle" />
	<form method="post" action="/?/addTask" use:enhance={handleEnhanceAddTask}>
		<input type="text" name="text" placeholder="Create a new todo..." />
	</form>
</div>
<div class="tasks-container">
	{#each tasks as task, i (task.id)}
		<div
			class="task-item"
			animate:flip={{ duration: 200 }}
			draggable="true"
			on:dragstart={(e) => handleDragStart(e, task.id)}
			on:drop={(e) => handleDrop(e, task.id)}
			on:dragover={(e) => e.preventDefault()}
			on:dragenter={() => (hoveredId = task.id)}
			on:dragend={(e) => handleDragEnd(e)}
			class:hovered={hoveredId === task.id}
			class:pending={task.pending}
			class:dragging={draggedId === task.id}
			transition:slide
		>
			<div class="drop-zone drop-zone-start" />
			<form method="POST" action="/?/setCompleted" use:enhance={handleEnhanceMarkCompleted}>
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
			{#if i === tasks.length - 1}
				<div
					class="drop-zone drop-zone-end"
					class:hovered={hoveredId === -1}
					on:dragover={handleDragEnterLast}
					on:drop={(e) => handleDrop(e, null)}
				/>
			{/if}
		</div>
	{/each}
	<div class="bottom-bar">
		<div>{countActive} items left</div>
		<div class="links">
			<Links {countAll} {countActive} {countCompleted} />
		</div>
		<form method="POST" action="/?/clear" use:enhance={handleEnhanceClearCompleted}>
			<button>Clear Completed </button>
		</form>
	</div>
</div>

<div class="mobile-links">
	<Links {countAll} {countActive} {countCompleted} />
</div>

<style>
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

	.pending {
		opacity: 0.5;
		pointer-events: none; /* Prevent checking/unchecking while pending */
	}

	.dragging {
		opacity: 0.5;
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

	.drop-zone {
		position: absolute;
		width: 100%;
		height: 4px;
		top: 0;
		left: 0;
	}

	.task-item.hovered > .drop-zone.drop-zone-start {
		background: var(--bright-blue);
	}
	.drop-zone.drop-zone-end {
		top: initial;
		bottom: 0;
	}
	.drop-zone.drop-zone-end.hovered {
		background: var(--bright-blue);
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
