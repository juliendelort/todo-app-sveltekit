<script>
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let tasks;

	let hovered = null;
	let draggedIndex = null;

	function handleDragStart(e, i) {
		e.target.style.opacity = 0.5;
		e.dataTransfer.dropEffect = 'move';
		draggedIndex = i;
	}

	function handleDrop(e, i) {
		console.log('old', draggedIndex, 'new', i);
		dispatch('dropped', {
			oldIndex: draggedIndex,
			newIndex: i
		});
	}

	function handleDragEnd(e, i) {
		e.target.style.opacity = 1;
		hovered = null;
		draggedIndex = null;
	}

	function handleDragEnterLast(e) {
		hovered = -1;
	}
</script>

{#each tasks as task, i (task.id)}
	<div
		class="task-item"
		animate:flip
		draggable="true"
		on:dragstart={(e) => handleDragStart(e, i)}
		on:drop={(e) => handleDrop(e, i)}
		on:dragover={(e) => e.preventDefault()}
		on:dragenter={() => (hovered = i)}
		on:dragend={(e) => handleDragEnd(e, i)}
		class:hovered={hovered === i}
	>
		<div class="drop-zone drop-zone-start" />
		<input
			type="checkbox"
			aria-label={`${task.completed ? 'Unmark' : 'mark'} task as completed`}
			checked={task.completed ? true : undefined}
		/>
		<span class="task-text" class:completed={task.completed}>{task.text}</span>
		{#if i === tasks.length - 1}
			<div
				class="drop-zone drop-zone-end"
				class:hovered={hovered === -1}
				on:dragover={handleDragEnterLast}
				on:drop={(e) => handleDrop(e, tasks.length)}
			/>
		{/if}
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

	.task-item > input {
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

	.task-item > input:checked {
		background: linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%));
	}

	.task-item > input:checked:after {
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
</style>
