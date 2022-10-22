<script>
	import TasksList from './TasksList.svelte';
	export let data;

	$: tasks = data.tasks;

	function handleDropped({ oldIndex, newIndex }) {
		if (oldIndex !== newIndex) {
			const beforeId = tasks[newIndex]?.id;
			const task = tasks[oldIndex];
			tasks.splice(oldIndex, 1);
			if (beforeId) {
				const beforeIndex = tasks.findIndex((t) => t.id === beforeId);

				tasks.splice(beforeIndex, 0, task);
			} else {
				// before id is null because newIndex is after the array
				tasks.push(task);
			}
		}
	}
</script>

<svelte:head>
	<title>All tasks</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<TasksList {tasks} onReordered={handleDropped} />

<style>
</style>
