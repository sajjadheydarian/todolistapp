import React, { useContext, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { TodoContext } from '…/context/TodoContext';

import ThemeSwitch from '…/components/ThemeSwitch';

export default function HomeScreen({ navigation, dark, setDark }) {

    const { folders, addFolder } = useContext(TodoContext);

    const [text, setText] = useState('');

    const [search, setSearch] = useState('');

    const filtered = folders.filter(f =>

        f.title.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <View style={{ padding: 20, flex: 1 }}>

            <ThemeSwitch dark={dark} setDark={setDark} />

            <TextInput

                value={search}

                placeholder="جستجو…"

                onChangeText={setSearch}

                style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 15 }}

            />

            <View style={{ flexDirection: 'row' }}>

                <TextInput

                    value={text}

                    onChangeText={setText}

                    placeholder="نام پوشه…"

                    style={{

                        borderWidth: 1, padding: 10, flex: 1,

                        borderRadius: 8, marginRight: 10

                    }}

                />

                <TouchableOpacity

                    onPress={() => {

                        if (text.trim() === '') return;

                        addFolder(text);

                        setText('');

                    }}

                    style={{

                        backgroundColor: '#007aff',

                        paddingHorizontal: 15,

                        borderRadius: 8,

                        justifyContent: 'center'

                    }}>

                    <Text style={{ color: '#fff' }}>افزودن</Text>

                </TouchableOpacity>

            </View>

            {filtered.map(f => (

                <TouchableOpacity

                    key={f.id}

                    onPress={() => navigation.navigate('Folder', { folderId: f.id })}

                    style={{

                        padding: 20,

                        backgroundColor: '#ececec',

                        marginTop: 15,

                        borderRadius: 8

                    }}>

                    <Text style={{ fontSize: 18 }}>{f.title}</Text>

                    <Text style={{ color: '#777' }}>{f.todos.length} کار</Text>

                </TouchableOpacity>

            ))}

        </View>

    );

}