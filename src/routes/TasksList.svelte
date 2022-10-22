<script>
	import { flip } from 'svelte/animate';

	export let tasks;

	function handleDragStart(e) {
		console.log('dragStart', e.target);
		// e.target.style.position = 'fixed';
		e.dataTransfer.dropEffect = 'move';
		event.dataTransfer.effectAllowed = 'move';
	}

	function handleDragEnter(e) {
		e.target.style.background = 'red';
	}
	function handleDragLeave(e) {
		e.target.style.background = 'none';
	}

	function handleDrop(e) {
		e.dataTransfer.dropEffect = 'move';
	}
</script>

{#each tasks as task, i (task.id)}
	<div class="task-item" animate:flip draggable="true" on:dragstart={handleDragStart}>
		<div
			class="drop-zone"
			on:dragenter={handleDragEnter}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
			on:dragover={(e) => e.preventDefault()}
		/>
		<input
			type="checkbox"
			aria-label={`${task.completed ? 'Unmark' : 'mark'} task as completed`}
			checked={task.completed ? true : undefined}
		/>
		<span class="task-text" class:completed={task.completed}>{task.text}</span>

		{#if i === tasks.length - 1}
			<div
				class="drop-zone drop-zone-end"
				on:dragenter={handleDragEnter}
				on:dragleave={handleDragLeave}
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

	.drop-zone.drop-zone-end {
		top: initial;
		bottom: 0;
	}
</style>
