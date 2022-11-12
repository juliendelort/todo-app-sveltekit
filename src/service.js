
import { API_KEY } from '$env/static/private';

const BASE_URL = 'https://todos-3ac4.restdb.io/rest/tasks';

export async function getAllTasks() {
    return getTasks();
}

export async function getCompletedTasks() {
    return getTasks('{"completed":true}');
}

export async function getActiveTasks() {
    return getTasks('{"completed":false}');

}

export async function getCounts() {
    const tasks = await getTasks();
    const countAll = tasks.length;
    const countCompleted = tasks.filter(t => t.completed).length;
    const countActive = tasks.filter(t => !t.completed).length;

    return {
        countAll,
        countCompleted,
        countActive
    };
}

export async function setCompleted(id, completed) {
    return updateTask(id, { completed });
}

export async function addTask(text) {

    return await baseDBCall('', 'POST', { text, completed: false, updatedAt: Date.now() });
}

export async function clearCompleted() {
    const tasks = await getAllTasks();
    const idsToDelete = tasks.filter(t => t.completed).map(t => t.id);

    return await baseDBCall('/*', 'DELETE', idsToDelete);
}

export async function getTasks(query) {
    const tasks = await baseDBCall(query ? `?q=${query}` : '', 'GET');

    const tasksToSort = tasks.filter(t => !!t.beforeTaskId).sort((a, b) => a.updatedAt - b.updatedAt);
    const result = tasks.filter(t => !t.beforeTaskId).sort((a, b) => a.updatedAt - b.updatedAt);

    tasksToSort.forEach(t => {
        console.log('task to sort', t, result);
        const index = result.findIndex(r => r._id === t.beforeTaskId);
        result.splice(index, 0, t);
    });

    // if (!tasks.length) {

    // }
    // // Find first task
    // const firstTask = tasks.find(t => !t.after);

    // const result = [firstTask];
    // let currentTask = firstTask;

    // console.log('***tasks', tasks);

    // while (currentTask) {
    //     const nextTask = tasksByAfter[currentTask._id];
    //     if (nextTask) {
    //         result.push(nextTask);
    //     }
    //     currentTask = nextTask;
    // }

    // console.log('***result', result);

    return result.map(t => ({ ...t, id: t._id }));
}
export async function moveTask(idToMove, idToInsertBefore) {
    if (idToMove === idToInsertBefore) {
        return;
    }
    return await updateTask(idToMove, { beforeTaskId: idToInsertBefore });
}

export async function updateTask(id, data) {
    return await baseDBCall(`/${id}`, 'PATCH', data);
}


async function baseDBCall(endpoint = '', method, data) {

    const result = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            'x-apikey': API_KEY,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!result.ok) {
        throw new Error('Error while writing data');
    }

    return await result.json();
}
