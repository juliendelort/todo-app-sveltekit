// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;


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
    default: async ({ request }) => {
        const formData = await request.formData();
        const newTask = {
            id: tasks.length + 1,
            text: formData.get('text'),
            completed: false
        };
        tasks.push(newTask);

        return newTask;
    }
};

// TODO:
// - optimistic UI
// - use response from action
// - show loader during action
