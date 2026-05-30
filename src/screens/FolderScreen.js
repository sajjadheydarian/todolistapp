import React, { useContext, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { TodoContext } from '…/context/TodoContext';

export default function FolderScreen({ route }) {

    const { folderId } = route.params;

    const { folders, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);

    const folder = folders.find(f => f.id === folderId);

    const [text, setText] = useState('');

    const [selected, setSelected] = useState([]);

    const toggleSelect = (id) => {

        setSelected(sel =>

            sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]

        );

    };

    const deleteSelected = () => {

        selected.forEach(id => deleteTodo(folderId, id));

        setSelected([]);

    };

    return (

        <View style={{ padding: 20 }}>

            <Text style={{ fontSize: 24 }}>{folder.title}</Text>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>

                <TextInput

                    value={text}

                    placeholder="کار جدید…"

                    onChangeText={setText}

                    style={{ borderWidth: 1, flex: 1, padding: 10, borderRadius: 8 }}

                />

                <TouchableOpacity

                    onPress={() => { if (text) { addTodo(folderId, text); setText(''); } }}

                    style={{ backgroundColor: '#007aff', padding: 10, marginLeft: 10, borderRadius: 8 }}>

                    <Text style={{ color: 'white' }}>+</Text>

                </TouchableOpacity>

            </View>

            {selected.length > 0 && (

                <TouchableOpacity

                    onPress={deleteSelected}

                    style={{ backgroundColor: 'red', padding: 10, marginTop: 10, borderRadius: 8 }}>

                    <Text style={{ color: 'white' }}>حذف گروهی</Text>

                </TouchableOpacity>

            )}

            {folder.todos.map(t => (

                <TouchableOpacity

                    key={t.id}

                    onLongPress={() => toggleSelect(t.id)}

                    onPress={() => toggleTodo(folderId, t.id)}

                    style={{

                        padding: 15,

                        backgroundColor: selected.includes(t.id) ? "#ffb3b3" : "#f2f2f2",

                        marginTop: 10,

                        borderRadius: 8

                    }}>

                    <Text style={{ fontSize: 18 }}>

                        {t.done ? "✔️ " : "⬜ "}

                        {t.text}

                    </Text>

                </TouchableOpacity>

            ))}

        </View>

    );

}