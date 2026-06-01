import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TodoContext = createContext();

export const DEFAULT_CATEGORIES = [
  { id: "personal", name: "شخصی", color: "#6366f1" },
  { id: "work", name: "کاری", color: "#3b82f6" },
  { id: "shopping", name: "خرید", color: "#ec4899" },
  { id: "goals", name: "اهداف", color: "#10b981" }
];

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    useEffect(() => { load(); }, []);

    const load = async () => {
        const savedTodos = await AsyncStorage.getItem("aura-todos");
        if (savedTodos) setTodos(JSON.parse(savedTodos));
    };

    const save = async (data) => {
        setTodos(data);
        await AsyncStorage.setItem("aura-todos", JSON.stringify(data));
    };

    const addTodo = (title, description, category, priority) => {
        const newTodo = {
            id: Date.now().toString(),
            title, description, category, priority,
            completed: false, createdAt: Date.now()
        };
        save([newTodo, ...todos]);
    };

    const toggleTodo = (id) => {
        const data = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        save(data);
    };

    const deleteTodo = (id) => {
        const data = todos.filter(t => t.id !== id);
        save(data);
    };

    return (
        <TodoContext.Provider value={{ todos, categories, addTodo, toggleTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};