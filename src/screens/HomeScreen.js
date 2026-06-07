import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import Feather from 'react-native-vector-icons/Feather';

export default function HomeScreen({ navigation, dark, setDark }) {
    const { todos, categories, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [selectedCategory, setSelectedCategory] = useState('personal');
    const [filter, setFilter] = useState('active');

    // 🌟 منطق جدید: استخراج تاریخ امروز ساعت ۰۰:۰۰ بامداد
    const todayTimestamp = useMemo(() => new Date().setHours(0, 0, 0, 0), []);

    // 🌟 فیلتر کردن کل کارها فقط برای «امروز»
    const todaysTodos = useMemo(() => {
        return todos.filter(t => t.date === todayTimestamp);
    }, [todos, todayTimestamp]);

    // محاسبه آمار فقط بر اساس کارهای امروز
    const stats = useMemo(() => {
        const total = todaysTodos.length;
        const completed = todaysTodos.filter(t => t.completed).length;
        const active = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, active, percent };
    }, [todaysTodos]);

    // فیلتر نهایی تب‌ها (در حال انجام / تکمیل شده)
    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true; // حالت همه
    });

    const handleAdd = () => {
        if (title.trim()) {
            // وقتی کاربر از صفحه اصلی کار اضافه می‌کند، پیش‌فرض برای "امروز" ثبت می‌شود
            addTodo(title, '', selectedCategory, priority, todayTimestamp, null);
            setTitle('');
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            "حذف کار",
            "آیا مطمئن هستید که می‌خواهید این کار را پاک کنید؟",
            [
                { text: "خیر", style: "cancel" },
                { text: "بله", onPress: () => deleteTodo(id), style: "destructive" }
            ],
            { cancelable: true }
        );
    };

    const todayDate = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

                <View style={styles.header}>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>امروز</Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{todayDate}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => setDark(!dark)} style={[styles.iconBtn, { backgroundColor: colors.bgCard }]}>
                            <Feather name={dark ? 'sun' : 'moon'} size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard }]}>
                            <Feather name="search" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>خلاصه امروز</Text>
                <View style={[styles.summaryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <View style={styles.progressCircleContainer}>
                        <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
                            <Text style={[styles.progressPercent, { color: colors.primary }]}>{stats.percent}٪</Text>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>پیشرفت امروز</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.total}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>کل وظایف</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.completed}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>انجام شده</Text>
                        </View>
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.active}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>باقی‌مانده</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.tasksHeaderRow}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>وظایف امروز</Text>
                    <Feather name="chevron-left" size={20} color={colors.textSecondary} />
                </View>

                {filteredTodos.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>وظیفه‌ای برای نمایش وجود ندارد.</Text>
                ) : (
                    filteredTodos.map(todo => (
                        <View key={todo.id} style={[styles.taskItem, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={styles.checkboxWrapper}>
                                <View style={[styles.checkbox, {
                                    borderColor: todo.completed ? colors.primary : colors.textMuted,
                                    backgroundColor: todo.completed ? colors.primary : 'transparent'
                                }]}>
                                    {todo.completed && <Feather name="check" size={12} color="#FFF" />}
                                </View>
                            </TouchableOpacity>

                            <View style={styles.taskTextContainer}>
                                <Text style={[styles.taskTitle, {
                                    color: todo.completed ? colors.textMuted : colors.textPrimary,
                                    textDecorationLine: todo.completed ? 'line-through' : 'none'
                                }]}>
                                    {todo.title}
                                </Text>
                            </View>

                            {todo.priority === 'high' && (
                                <Feather name="star" size={16} color={colors.accent} style={{ marginLeft: 10 }} />
                            )}

                            <TouchableOpacity onPress={() => confirmDelete(todo.id)} style={{ padding: 5, marginLeft: 10 }}>
                                <Feather name="trash-2" size={16} color={colors.danger} />
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                <View style={[styles.quickAddContainer, { borderColor: colors.primary }]}>
                    <TouchableOpacity onPress={handleAdd} style={styles.quickAddBtn}>
                        <Feather name="plus" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="افزودن سریع وظیفه برای امروز..."
                        placeholderTextColor={colors.textMuted}
                        style={[styles.quickAddInput, { color: colors.textPrimary }]}
                        onSubmitEditing={handleAdd}
                    />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    headerSubtitle: { fontSize: 13 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    summaryCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 30, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 } },
    progressCircleContainer: { alignItems: 'center', marginBottom: 25 },
    progressCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, justifyContent: 'center', alignItems: 'center' },
    progressPercent: { fontSize: 28, fontWeight: 'bold' },
    progressLabel: { fontSize: 12, marginTop: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { flex: 0.31, paddingVertical: 15, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    statLabel: { fontSize: 11 },
    tasksHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    taskItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
    checkboxWrapper: { marginRight: 12 },
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    taskTextContainer: { flex: 1 },
    taskTitle: { fontSize: 15, fontWeight: '500', textAlign: 'right' },
    quickAddContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', marginTop: 10 },
    quickAddBtn: { padding: 10 },
    quickAddInput: { flex: 1, height: 50, fontSize: 15, textAlign: 'right' }
});