import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { TodoContext } from '../context/TodoContext';

export default function FolderScreen({ route }) {
    const { folderId } = route.params;
    const { folders, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);
    const { colors } = useTheme();
    
    const folder = folders.find(f => f.id === folderId);
    const [text, setText] = useState('');
    const [selected, setSelected] = useState([]);

    if (!folder) return null; 

    const toggleSelect = (id) => {
        setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
    };

    const deleteSelected = () => {
        selected.forEach(id => deleteTodo(folderId, id));
        setSelected([]);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>{folder.title}</Text>

            <View style={styles.addRow}>
                <TextInput
                    value={text}
                    placeholder="کار جدید..."
                    placeholderTextColor="#888"
                    onChangeText={setText}
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                />
                <TouchableOpacity
                    onPress={() => { if (text.trim()) { addTodo(folderId, text); setText(''); } }}
                    style={[styles.addButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {selected.length > 0 && (
                <TouchableOpacity onPress={deleteSelected} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>حذف گروهی ({selected.length})</Text>
                </TouchableOpacity>
            )}

            <ScrollView style={{ marginTop: 15 }}>
                {folder.todos.map(t => (
                    <TouchableOpacity
                        key={t.id}
                        onLongPress={() => toggleSelect(t.id)}
                        onPress={() => toggleTodo(folderId, t.id)}
                        style={[
                            styles.todoItem,
                            { 
                                backgroundColor: selected.includes(t.id) ? (colors.dark ? '#3d1616' : '#ffe6e6') : colors.card, 
                                borderColor: selected.includes(t.id) ? '#ff4d4d' : colors.border 
                            }
                        ]}>
                        <View style={styles.todoRow}>
                            <Text style={styles.checkIcon}>{t.done ? "✔️" : "⬛"}</Text>
                            <Text style={[styles.todoText, { color: colors.text, textDecorationLine: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1 }]}>
                                {t.text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'right' },
    addRow: { flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, borderWidth: 1, padding: 14, borderRadius: 12, marginLeft: 12, textAlign: 'right', fontSize: 16 },
    addButton: { width: 54, height: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    addButtonText: { color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: -3 },
    deleteButton: { backgroundColor: '#ff3b30', padding: 14, marginTop: 15, borderRadius: 12, alignItems: 'center', elevation: 1 },
    deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    todoItem: { padding: 18, marginTop: 12, borderRadius: 12, borderWidth: 1 },
    todoRow: { flexDirection: 'row', alignItems: 'center' },
    checkIcon: { fontSize: 18, marginLeft: 12 },
    todoText: { fontSize: 16, flex: 1, textAlign: 'right' }
});