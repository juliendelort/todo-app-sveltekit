// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
import { error } from '@sveltejs/kit';
import { getActiveTasks, getAllTasks, getCompletedTasks, updateTask } from '../../service';
import { moveTask } from '../../utils';


export async function load({ params }) {
    const status = params.slug;

    if (status === 'active') {
        return {
            tasks: await getActiveTasks(),
            title: 'Active tasks'
        };
    } else if (status === 'completed') {
        return {
            tasks: await getCompletedTasks(),
            title: 'Completed tasks'
        };
    } else if (status === 'all') {
        return {
            tasks: await getAllTasks(),
            title: 'All tasks'
        };
    }

    throw error(404, 'Invalid URL');
}
