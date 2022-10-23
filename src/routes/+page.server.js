// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
import { error } from '@sveltejs/kit';

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


export function load({ params }) {
    return {
        tasks
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
    }
};
