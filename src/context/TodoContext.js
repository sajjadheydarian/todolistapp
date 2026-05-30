import React, { createContext, useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {

    const [folders, setFolders] = useState([]);

    useEffect(() => { load(); }, []);

    const load = async () => {

        const json = await AsyncStorage.getItem("karam");

        if (json) setFolders(JSON.parse(json));

    };

    const save = async (data) => {

        setFolders(data);

        await AsyncStorage.setItem("karam", JSON.stringify(data));

    };

    const addFolder = (title) => {

        const data = [...folders, { id: Date.now(), title, todos: [] }];

        save(data);

    };

    const addTodo = (fid, text) => {

        const data = folders.map(f =>

            f.id === fid

                ? { ...f, todos: [...f.todos, { id: Date.now(), text, done: false }] }

                : f

        );

        save(data);

    };

    const toggleTodo = (fid, tid) => {

        const data = folders.map(f =>

            f.id === fid

                ? {

                    ...f,

                    todos: f.todos.map(t =>

                        t.id === tid ? { ...t, done: !t.done } : t

                    )

                }

                : f

        );

        save(data);

    };

    const deleteTodo = (fid, tid) => {

        const data = folders.map(f =>

            f.id === fid

                ? { ...f, todos: f.todos.filter(t => t.id !== tid) }

                : f

        );

        save(data);

    };

    return (

        <TodoContext.Provider value={{

            folders,

            addFolder,

            addTodo,

            toggleTodo,

            deleteTodo

        }}>

            {children}

        </TodoContext.Provider>

    );

};