import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-jalaali';

export default function AllTasksScreen({ navigation, dark }) {
    const { todos, categories, toggleTodo, deleteTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const [catFilter, setCatFilter] = useState('all');

    const filteredTodos = todos.filter(t => catFilter === 'all' ? true : t.category === catFilter);

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />
            
            {/* هدر صفحه همراه با دکمه بازگشت */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.bgCard }]}>
                    <Feather name="arrow-right" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.textPrimary }]}>همه وظایف شما</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* فیلترهای افقی دسته‌بندی */}
            <View style={{ maxHeight: 50, marginBottom: 15 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity 
                        onPress={() => setCatFilter('all')}
                        style={[styles.filterChip, { backgroundColor: catFilter === 'all' ? colors.primary : colors.bgCard, borderColor: colors.border }]}
                    >
                        <Text style={{ color: catFilter === 'all' ? '#FFF' : colors.textSecondary, fontWeight: 'bold' }}>همه</Text>
                    </TouchableOpacity>
                    {categories.map(c => (
                        <TouchableOpacity 
                            key={c.id} onPress={() => setCatFilter(c.id)}
                            style={[styles.filterChip, { backgroundColor: catFilter === c.id ? c.color : colors.bgCard, borderColor: colors.border }]}
                        >
                            <Text style={{ color: catFilter === c.id ? '#FFF' : colors.textSecondary }}>{c.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {filteredTodos.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>هیچ وظیفه‌ای در این بخش وجود ندارد.</Text>
                ) : (
                    filteredTodos.map(todo => (
                        <View key={todo.id} style={[styles.taskCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={styles.checkbox}>
                                <View style={[styles.checkCircle, { borderColor: todo.completed ? colors.success : colors.textMuted, backgroundColor: todo.completed ? colors.success : 'transparent' }]}>
                                    {todo.completed && <Feather name="check" size={12} color="#FFF" />}
                                </View>
                            </TouchableOpacity>
                            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                <Text style={[styles.taskTitle, { color: todo.completed ? colors.textMuted : colors.textPrimary, textDecorationLine: todo.completed ? 'line-through' : 'none' }]}>{todo.title}</Text>
                                <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'right', marginTop: 4 }}>
                                    {todo.date ? moment(todo.date).format('jD jMMMM') : 'بدون تاریخ'} {todo.time ? `ساعت ${todo.time}` : ''}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteTodo(todo.id)} style={{ padding: 5 }}><Feather name="trash-2" size={16} color={colors.danger} /></TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    title: { fontSize: 18, fontWeight: 'bold' },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginLeft: 8, height: 38 },
    taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
    checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    taskTitle: { fontSize: 15, fontWeight: '500', textAlign: 'right' }
});