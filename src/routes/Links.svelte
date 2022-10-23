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

<a href="/" class:active={!$page.url.searchParams.get('status')}>All ({countAll})</a>
<a href="/?status=active" class:active={$page.url.searchParams.get('status') === 'active'}
	>Active ({countActive})</a
>
<a href="/?status=completed" class:active={$page.url.searchParams.get('status') === 'completed'}
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
