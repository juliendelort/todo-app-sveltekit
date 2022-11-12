<script>
	import TasksList from '../TasksList.svelte';
	export let data;

	$: console.log('data', data);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<TasksList tasks={data.tasks} />
