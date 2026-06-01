import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { TodoContext } from '../context/TodoContext';
import ThemeSwitch from '../components/ThemeSwitch';

export default function HomeScreen({ navigation, dark, setDark }) {
    const { folders, addFolder } = useContext(TodoContext);
    const { colors } = useTheme(); 
    const [text, setText] = useState('');
    const [search, setSearch] = useState('');

    const filtered = folders.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.headerRow}>
                <ThemeSwitch dark={dark} setDark={setDark} />
            </View>

            <TextInput
                value={search}
                placeholder="جستجوی پوشه..."
                placeholderTextColor="#888"
                onChangeText={setSearch}
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            />

            <View style={styles.addRow}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="نام پوشه جدید..."
                    placeholderTextColor="#888"
                    style={[styles.input, styles.flexInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (text.trim() === '') return;
                        addFolder(text);
                        setText('');
                    }}
                    style={[styles.addButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.addButtonText}>افزودن</Text>
                </TouchableOpacity>
            </View>

            {filtered.map(f => (
                <TouchableOpacity
                    key={f.id}
                    onPress={() => navigation.navigate('Folder', { folderId: f.id })}
                    style={[styles.folderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.folderTitle, { color: colors.text }]}>{f.title}</Text>
                    <Text style={styles.folderSubtitle}>{f.todos.length} کار</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 15 },
    input: { borderWidth: 1, padding: 14, borderRadius: 12, marginBottom: 15, textAlign: 'right', fontSize: 16 },
    addRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    flexInput: { flex: 1, marginBottom: 0, marginLeft: 12 }, 
    addButton: { paddingHorizontal: 22, paddingVertical: 15, borderRadius: 12, justifyContent: 'center', elevation: 2 },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    folderCard: { padding: 20, marginTop: 15, borderRadius: 14, borderWidth: 1, elevation: 1 },
    folderTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, textAlign: 'right' },
    folderSubtitle: { color: '#888', fontSize: 14, textAlign: 'right' }
});