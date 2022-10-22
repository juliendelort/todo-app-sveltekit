<script>
	import TasksList from './TasksList.svelte';

	let tasks = [
		{
			id: 1,
			text: 'Feed the cat'
		},
		{
			id: 2,
			text: 'Walk the dog',
			completed: true
		},
		{
			id: 3,
			text: 'Go to the gym'
		}
	];
</script>

<svelte:head>
	<title>All tasks</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<TasksList {tasks} />

<style>
</style>
