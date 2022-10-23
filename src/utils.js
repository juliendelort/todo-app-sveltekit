/**
 * Moves a task before another task. This doen't mutate the original array.
 * @param {Object[]} tasks The list of tasks
 * @param {number} idToMove The id of the task to move
 * @param {number} idToInsertBefore The id of the task before which to move the task
 * @param {boolean} [setPending] Whether or not to set the task as pending (UI only)
 * @returns  The new task list
 */
export function moveTask(tasks, idToMove, idToInsertBefore, setPending = false) {
    const newTasks = tasks.filter((task) => task.id !== idToMove);
    const taskToMove = tasks.find((task) => task.id === idToMove);
    if (setPending) {
        taskToMove.pending = true;
    }
    if (idToInsertBefore === null) {
        // insert at the end
        newTasks.push(taskToMove);
    } else {
        const indexToInsertBefore = newTasks.findIndex((task) => task.id === idToInsertBefore);
        newTasks.splice(
            indexToInsertBefore,
            0,
            taskToMove
        );
    }

    return newTasks;
}
