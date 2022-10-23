// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
import { error } from '@sveltejs/kit';
import { moveTask } from '../utils';

// Default task list.
// TODO: use a database instead.
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


export function load({ url }) {
    const status = url.searchParams.get('status');
    const countAll = tasks.length;
    const countCompleted = tasks.filter((task) => task.completed).length;
    const countActive = countAll - countCompleted;
    if (status === 'active') {
        return {
            tasks: tasks.filter((task) => !task.completed),
            title: 'Active tasks',
            countAll,
            countCompleted,
            countActive
        };
    } else if (status === 'completed') {
        return {
            tasks: tasks.filter((task) => task.completed),
            title: 'Completed tasks',
            countAll,
            countCompleted,
            countActive
        };
    }

    return {
        tasks,
        title: 'All tasks',
        countAll,
        countCompleted,
        countActive
    };
}

export const actions = {
    addTask: async ({ request }) => {
        try {
            const formData = await request.formData();
            const newTask = {
                id: tasks.length + 1,
                text: formData.get('text'),
                completed: false
            };
            tasks.push(newTask);

            return newTask;
        } catch (e) {
            return error(500, e.message);
        }
    },
    setCompleted: async ({ request }) => {
        try {
            const formData = await request.formData();
            const completed = !!formData.get('completed');

            const task = tasks.find(task => task.id === +formData.get('id'));
            if (task) {
                task.completed = completed;
            }

            return task;
        } catch (e) {
            return error(500, e.message);
        }
    },
    moveTask: async ({ request }) => {
        try {
            const formData = await request.formData();
            tasks = moveTask(tasks, +formData.get('idToMove'), +formData.get('idToInsertBefore'));
            return tasks;
        } catch (e) {
            return error(500, e.message);
        }
    },
    clear: async () => {
        tasks = tasks.filter((task) => !task.completed);
        return tasks;
    }
};
