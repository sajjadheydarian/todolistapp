import React, { useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-jalaali';

export default function OverdueTasksScreen({ navigation, dark }) {
    const { todos, toggleTodo, deleteTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const todayTimestamp = useMemo(() => new Date().setHours(0,0,0,0), []);

    // فیلتر کارهای انجام نشده‌ای که تاریخشان گذشته است
    const overdueTodos = useMemo(() => {
        return todos.filter(t => !t.completed && t.date < todayTimestamp);
    }, [todos, todayTimestamp]);

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.bgCard }]}>
                    <Feather name="arrow-right" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.danger }]}>کارهای عقب‌افتاده</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {overdueTodos.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <Feather name="award" size={50} color={colors.success} style={{ marginBottom: 15 }} />
                        <Text style={{ textAlign: 'center', color: colors.textSecondary, fontWeight: 'bold' }}>عالیه سجاد جان! هیچ کار عقب‌افتاده‌ای نداری.</Text>
                    </View>
                ) : (
                    overdueTodos.map(todo => {
                        // محاسبه تعداد روزهای تاخیر
                        const diffDays = Math.ceil((todayTimestamp - todo.date) / (1000 * 60 * 60 * 24));
                        return (
                            <View key={todo.id} style={[styles.taskCard, { backgroundColor: colors.bgCard, borderColor: colors.danger + '30' }]}>
                                <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={styles.checkbox}>
                                    <View style={[styles.checkCircle, { borderColor: colors.textMuted }]}>
                                        {todo.completed && <Feather name="check" size={12} color="#FFF" />}
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                    <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{todo.title}</Text>
                                    <Text style={{ color: colors.danger, fontSize: 11, textAlign: 'right', marginTop: 4, fontWeight: 'bold' }}>
                                        {diffDays === 1 ? 'مهلت: دیروز بود' : `${diffDays} روز تاخیر`} (تاریخ: {moment(todo.date).format('jD jMMMM')})
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteTodo(todo.id)} style={{ padding: 5 }}><Feather name="trash-2" size={16} color={colors.danger} /></TouchableOpacity>
                            </View>
                        );
                    })
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
    taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#E63946' },
    checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    taskTitle: { fontSize: 15, fontWeight: '500', textAlign: 'right' }
});