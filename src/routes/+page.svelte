<script>
	import TasksList from './TasksList.svelte';
	import { listenTodos } from '../firebase';
	import { page } from '$app/stores';

	export let data;

	const status = $page.url.searchParams.get('status');

	listenTodos(
		(newData) => {
			data = { ...data, tasks: newData };
		},
		status === 'active' ? true : status === 'completed' ? false : undefined
	);
</script>

<TasksList tasks={data.tasks} />
