<script>
	import { page } from '$app/stores';

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
</script>

<a href="/" class:active={$page.params.slug === 'all'}>All ({countAll})</a>
<a href="/active" class:active={$page.params.slug === 'active'}>Active ({countActive})</a>
<a href="/completed" class:active={$page.params.slug === 'completed'}
	>Completed ({countCompleted})</a
>

<style>
	a {
		color: var(--task-txt-color);
		text-decoration: none;
	}

	a.active {
		color: var(--bright-blue);
	}
</style>
