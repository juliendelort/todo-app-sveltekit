<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { moveTask } from '../utils';

	/**
	 * The list of tasks to display
	 * @type {Object[]}
	 */
	export let tasks;

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

	let editedIds = [];

	function handleDragStart(e, id) {
		e.dataTransfer.dropEffect = 'move';
		draggedId = id;
	}

	async function handleDrop(e, idToInsertAfter) {
		e.stopPropagation(); // Otherwise when dropping on .drop-zone-end, handleDrop is called twice

		// Send the request
		const data = new FormData();
		data.append('idToMove', draggedId);
		data.append('idToInsertAfter', idToInsertAfter);

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

	function handleDragEnterFirst(e) {
		hoveredId = -1;
	}

	function handleCompletedChange(e) {
		e.target.closest('form').requestSubmit();
	}

	function handleEnhanceMarkCompleted({ data }) {
		const id = data.get('id');

		editedIds = [...new Set([...editedIds, id])];
		return async () => {
			editedIds = editedIds.filter((editedId) => editedId !== id);

			// TODO: debounce this in case we check multiple boxes at once
			invalidateAll();
		};
	}
</script>

{#each tasks as task, i (task.id)}
	<div
		class="task-item"
		draggable="true"
		on:dragstart={(e) => handleDragStart(e, task.id)}
		on:drop={(e) => handleDrop(e, task.id)}
		on:dragover={(e) => e.preventDefault()}
		on:dragenter={() => (hoveredId = task.id)}
		on:dragend={(e) => handleDragEnd(e)}
		class:hovered={hoveredId === task.id}
		class:pending={editedIds.includes(task.id)}
		class:dragging={draggedId === task.id}
	>
		{#if i === 0}
			<div
				class="drop-zone drop-zone-start"
				class:hovered={hoveredId === -1}
				on:dragover={handleDragEnterFirst}
				on:drop={(e) => handleDrop(e, null)}
			/>
		{/if}
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

		<div class="drop-zone drop-zone-end" />
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

	.task-item.hovered > .drop-zone.drop-zone-end {
		background: var(--bright-blue);
	}
	.drop-zone.drop-zone-end {
		top: initial;
		bottom: 0;
	}
	.drop-zone.drop-zone-start.hovered {
		background: var(--bright-blue);
	}
</style>
