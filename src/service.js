
const BASE_URL = 'https://todos-3ac4.restdb.io/rest/tasks';
const API_KEY = '636f9f38c890f30a8fd1f323';


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
    const tasks = await getAllTasks();

    return await baseDBCall('', 'POST', { text, completed: false, after: tasks.length ? tasks.at(-1).id : null });
}

export async function clearCompleted() {
    const tasks = await getAllTasks();
    const idsToDelete = tasks.filter(t => t.completed).map(t => t.id);

    return await baseDBCall('/*', 'DELETE', idsToDelete);
}

export async function getTasks(query) {
    const tasks = await baseDBCall(query ? `?q=${query}` : '', 'GET');

    if (tasks.length === 0) {
        return [];
    }

    const tasksByAfter = tasks.reduce((acc, task) => {
        acc[task.after] = task;
        return acc;
    }, {});

    if (!tasks.length) {

    }
    // Find first task
    const firstTask = tasks.find(t => !t.after);

    const result = [firstTask];
    let currentTask = firstTask;

    console.log('***tasks', tasks);

    while (currentTask) {
        const nextTask = tasksByAfter[currentTask._id];
        if (nextTask) {
            result.push(nextTask);
        }
        currentTask = nextTask;
    }

    console.log('***result', result);

    return result.map(t => ({ ...t, id: t._id }));
}
export async function moveTask(idToMove, idToInsertAfter) {
    if (idToMove === idToInsertAfter) {
        return;
    }
    console.log('moveTask', idToMove, idToInsertAfter);
    const tasks = await getTasks();

    const taskThatUsedToBeAfter = tasks.find(t => t.after == idToInsertAfter);

    console.log('***taskThatUsedToBeAfter', taskThatUsedToBeAfter);
    await Promise.all([
        updateTask(idToMove, { after: idToInsertAfter }),
        updateTask(taskThatUsedToBeAfter.id, { after: idToMove }),
    ]);
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
