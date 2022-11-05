// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;
import { getTodos } from '../firebase';


export async function load({ url }) {
    const status = url.searchParams.get('status');

    return {
        tasks: await getTodos(status === 'active' ? true : status === 'completed' ? false : undefined),
        title: 'All tasks',
        countAll: (await getTodos()).length,
        countCompleted: (await getTodos(false)).length,
        countActive: (await getTodos(true)).length
    };
}
