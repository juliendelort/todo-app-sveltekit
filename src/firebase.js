// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { addDoc, deleteDoc, getFirestore, query, setDoc, where, writeBatch } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { onDestroy, onMount } from 'svelte';

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

export const listenCountAll = async (callback) => {
    let unsub;
    onMount(() => {
        unsub = onSnapshot(
            collection(db, "todos"),
            { includeMetadataChanges: true },
            (querySnapshot) => {
                callback(querySnapshot.size);
            });
    });

    onDestroy(() => {
        unsub?.();
    });
};

export const listenCountCompleted = async (callback) => {
    let unsub;
    onMount(() => {
        unsub = onSnapshot(
            query(collection(db, "todos"), where('completed', '==', true)),
            { includeMetadataChanges: true },
            (querySnapshot) => {
                callback(querySnapshot.size);
            });
    });

    onDestroy(() => {
        unsub?.();
    });
};

export const listenCountActive = async (callback) => {
    let unsub;
    onMount(() => {
        unsub = onSnapshot(
            query(collection(db, "todos"), where('completed', '==', false)),
            { includeMetadataChanges: true },
            (querySnapshot) => {
                callback(querySnapshot.size);
            });
    });

    onDestroy(() => {
        unsub?.();
    });
};

export const addTodo = async (todo) => {
    const docRef = await addDoc(collection(db, "todos"), todo);
    return {
        id: docRef.id,
        ...todo
    };
};

export const editTodo = async (todo) => {
    await setDoc(doc(db, "todos", todo.id), todo);
};

export const clearCompleted = async () => {
    const completed = await getTodos(false);

    const batch = writeBatch(db);

    for (const todo of completed) {
        // Delete the city 'LA'
        const docRef = doc(db, "todos", todo.id);
        batch.delete(docRef);
    }

    // Commit the batch
    await batch.commit();
};
