import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TodoContext = createContext();

// دسته‌بندی‌ها دقیقاً مطابق عکس تغییر کردند
const DEFAULT_CATEGORIES = [
  { id: "personal", name: "شخصی", color: "#457B9D" },
  { id: "work", name: "کار", color: "#1D3557" },
  { id: "study", name: "مطالعه", color: "#8338EC" },
  { id: "shopping", name: "خرید", color: "#E63946" }
];

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const savedTodos = await AsyncStorage.getItem("aura-todos");
            const savedCategories = await AsyncStorage.getItem("aura-categories");
            if (savedTodos) setTodos(JSON.parse(savedTodos));
            if (savedCategories) setCategories(JSON.parse(savedCategories));
        } catch (error) {
            console.log("Error loading data", error);
        }
    };

    const saveTodos = async (data) => {
        setTodos(data);
        await AsyncStorage.setItem("aura-todos", JSON.stringify(data));
    };

    const saveCategories = async (data) => {
        setCategories(data);
        await AsyncStorage.setItem("aura-categories", JSON.stringify(data));
    };

    // --- توابع مربوط به کارها ---
    // اضافه شدن date و time برای پشتیبانی از صفحه تقویم
    const addTodo = (title, description, category, priority, date = null, time = null) => {
        const newTodo = { 
            id: Date.now().toString(), 
            title, 
            description, 
            category, 
            priority, // 'normal', 'high', 'starred'
            date, 
            time, 
            completed: false, 
            createdAt: Date.now() 
        };
        saveTodos([newTodo, ...todos]);
    };
    
    const toggleTodo = (id) => saveTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const deleteTodo = (id) => saveTodos(todos.filter(t => t.id !== id));

    // --- توابع مربوط به دسته‌بندی‌ها ---
    const addCategory = (name, color) => {
        const newCat = { id: Date.now().toString(), name, color };
        saveCategories([...categories, newCat]);
    };
    
    const deleteCategory = (id) => {
        saveCategories(categories.filter(c => c.id !== id));
    };

    return (
        <TodoContext.Provider value={{ 
            todos, categories, addTodo, toggleTodo, deleteTodo, addCategory, deleteCategory 
        }}>
            {children}
        </TodoContext.Provider>
    );
};