// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
import { error, redirect } from '@sveltejs/kit';
import { addTask, clearCompleted, moveTask, setCompleted } from '../service';


export async function load() {
    throw redirect(301, '/all');
}

export const actions = {
    addTask: async ({ request }) => {
        try {
            const formData = await request.formData();


            return await addTask(formData.get('text'));
        } catch (e) {
            return error(500, e.message);
        }
    },
    setCompleted: async ({ request }) => {
        try {
            const formData = await request.formData();
            const completed = !!formData.get('completed');

            return await setCompleted(formData.get('id'), completed);
        } catch (e) {
            return error(500, e.message);
        }
    },
    moveTask: async ({ request }) => {
        try {
            const formData = await request.formData();
            return await moveTask(formData.get('idToMove'), formData.get('idToInsertBefore') ?? null);
        } catch (e) {
            return error(500, e.message);
        }
    },
    clear: async () => {
        return await clearCompleted();
    }
};
