// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { addDoc, deleteDoc, getFirestore, increment, query, setDoc, where, writeBatch } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { onDestroy, onMount } from 'svelte';
import { runTransaction } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwD28r4XtpwBevBDgjx1hPvZLNlR39fhA",
    authDomain: "todo-95916.firebaseapp.com",
    projectId: "todo-95916",
    storageBucket: "todo-95916.appspot.com",
    messagingSenderId: "545776706958",
    appId: "1:545776706958:web:c2d6e85ba57f3f8d7d70df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export const getTodos = async (active) => {
    const querySnapshot = await getDocs(active === undefined ?
        collection(db, "todos") : query(collection(db, "todos"), where('completed', '==', !active)));

    return querySnapshot.docs.map(s => ({
        id: s.id,
        ...s.data()
    }));
};

export const listenTodos = async (callback, active) => {
    let unsub;
    onMount(() => {
        unsub = onSnapshot(
            active === undefined ?
                collection(db, "todos") : query(collection(db, "todos"), where('completed', '==', !active)),
            { includeMetadataChanges: true },
            (querySnapshot) => {
                callback(querySnapshot.docs.map(s => ({
                    id: s.id,
                    ...s.data()
                })));
            });
    });

    onDestroy(() => {
        unsub?.();
    });
};

export const listenCounts = async (callback) => {
    let unsub;
    onMount(() => {
        unsub = onSnapshot(
            doc(db, "counts", "counts"),
            { includeMetadataChanges: true },
            (querySnapshot) => {
                const data = querySnapshot.data();
                callback({
                    countAll: data.all,
                    countActive: data.all - data.completed,
                    countCompleted: data.completed
                });
            });
    });

    onDestroy(() => {
        unsub?.();
    });
};



export const addTodo = async (todo) => {
    await runTransaction(db, async (transaction) => {
        const newTodoRef = doc(collection(db, "todos"));
        await transaction.set(newTodoRef, todo);
        await transaction.update(doc(db, 'counts', 'counts'), { all: increment(1) });
    });
};

export const editTodo = async (todo) => {
    await runTransaction(db, async (transaction) => {
        const todoDoc = await transaction.get(doc(db, 'todos', todo.id));
        if (todoDoc.data().completed !== todo.completed) {
            // We're changing the completed status
            if (todo.completed) {
                await transaction.update(doc(db, 'counts', 'counts'), { completed: increment(1) });
            } else {
                await transaction.update(doc(db, 'counts', 'counts'), { completed: increment(-1) });
            }
        }
        await transaction.update(doc(db, 'todos', todo.id), todo);
    });

};

export const clearCompleted = async () => {
    const completed = await getTodos(false);

    const batch = writeBatch(db);

    for (const todo of completed) {
        const docRef = doc(db, "todos", todo.id);
        batch.delete(docRef);
    }

    batch.set(doc(db, 'counts', 'counts'), { completed: increment(-1 * completed.length), all: increment(-1 * completed.length) });

    // Commit the batch
    await batch.commit();
};
