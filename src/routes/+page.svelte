<script>
	import TasksList from './TasksList.svelte';
	export let data;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Todo app" />
</svelte:head>

<TasksList
	tasks={data.tasks}
	countAll={data.countAll}
	countActive={data.countActive}
	countCompleted={data.countCompleted}
/>
