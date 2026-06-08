import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

export default function HomeScreen({ navigation, dark, setDark }) {
    const { todos, categories, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [selectedCategory, setSelectedCategory] = useState('personal');
    
    // استیت‌های مربوط به سرچ
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const todayTimestamp = useMemo(() => new Date().setHours(0,0,0,0), []);

    // محاسبات کارهای امروز و کارهای عقب‌افتاده
    const todaysTodos = useMemo(() => todos.filter(t => t.date === todayTimestamp), [todos, todayTimestamp]);
    const overdueCount = useMemo(() => todos.filter(t => !t.completed && t.date < todayTimestamp).length, [todos, todayTimestamp]);

    const stats = useMemo(() => {
        const total = todaysTodos.length;
        const completed = todaysTodos.filter(t => t.completed).length;
        const active = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, active, percent };
    }, [todaysTodos]);

    // اعمال سرچ روی کارهای امروز
    const displayedTodos = todaysTodos.filter(t => t.title.includes(searchQuery));

    const handleAdd = () => {
        if (title.trim()) {
            addTodo(title, '', selectedCategory, priority, todayTimestamp, null);
            setTitle('');
        }
    };

    const confirmDelete = (id) => {
        Alert.alert("حذف کار", "آیا مطمئن هستید؟", [
            { text: "خیر", style: "cancel" },
            { text: "بله", onPress: () => deleteTodo(id), style: "destructive" }
        ]);
    };

    const todayDateStr = moment().format('dddd، jD jMMMM jYYYY');

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>امروز</Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{todayDateStr}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity onPress={() => setIsSearching(!isSearching)} style={[styles.iconBtn, { backgroundColor: colors.bgCard }]}>
                            <Feather name={isSearching ? "x" : "search"} size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDark(!dark)} style={[styles.iconBtn, { backgroundColor: colors.bgCard }]}>
                            <Feather name={dark ? 'sun' : 'moon'} size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* نوار جستجو (در صورت فعال بودن) */}
                {isSearching && (
                    <TextInput
                        value={searchQuery} onChangeText={setSearchQuery}
                        placeholder="جستجو در کارهای امروز..." placeholderTextColor={colors.textMuted}
                        style={[styles.searchInput, { backgroundColor: colors.bgCard, color: colors.textPrimary, borderColor: colors.border }]}
                    />
                )}

                {/* دکمه‌های دسترسی سریع به کارهای گذشته و همه کارها */}
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 25 }}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('AllTasks')} // در مرحله بعد می‌سازیم
                        style={[styles.navCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
                    >
                        <Feather name="layers" size={24} color={colors.primary} />
                        <Text style={[styles.navCardText, { color: colors.textPrimary }]}>همه وظایف</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('OverdueTasks')} // در مرحله بعد می‌سازیم
                        style={[styles.navCard, { backgroundColor: colors.dangerBg, borderColor: 'transparent' }]}
                    >
                        <View style={styles.badge}><Text style={styles.badgeText}>{overdueCount}</Text></View>
                        <Feather name="alert-circle" size={24} color={colors.danger} />
                        <Text style={[styles.navCardText, { color: colors.danger }]}>عقب‌افتاده</Text>
                    </TouchableOpacity>
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
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}><Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.total}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>کل وظایف</Text></View>
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}><Text style={[styles.statValue, { color: colors.primary }]}>{stats.completed}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>انجام شده</Text></View>
                        <View style={[styles.statBox, { backgroundColor: colors.bgApp, borderColor: colors.border }]}><Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.active}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>باقی‌مانده</Text></View>
                    </View>
                </View>

                <View style={styles.tasksHeaderRow}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>لیست امروز</Text>
                </View>

                {displayedTodos.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>وظیفه‌ای یافت نشد.</Text>
                ) : (
                    displayedTodos.map(todo => (
                        <View key={todo.id} style={[styles.taskItem, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={styles.checkboxWrapper}>
                                <View style={[styles.checkbox, { borderColor: todo.completed ? colors.primary : colors.textMuted, backgroundColor: todo.completed ? colors.primary : 'transparent' }]}>
                                    {todo.completed && <Feather name="check" size={12} color="#FFF" />}
                                </View>
                            </TouchableOpacity>

                            <View style={styles.taskTextContainer}>
                                <Text style={[styles.taskTitle, { color: todo.completed ? colors.textMuted : colors.textPrimary, textDecorationLine: todo.completed ? 'line-through' : 'none' }]}>
                                    {todo.title}
                                </Text>
                            </View>

                            {todo.priority === 'high' && <Feather name="star" size={16} color={colors.accent} style={{ marginLeft: 10 }} />}
                            <TouchableOpacity onPress={() => confirmDelete(todo.id)} style={{ padding: 5, marginLeft: 10 }}><Feather name="trash-2" size={16} color={colors.danger} /></TouchableOpacity>
                        </View>
                    ))
                )}

                <View style={[styles.quickAddContainer, { borderColor: colors.primary }]}>
                    <TouchableOpacity onPress={handleAdd} style={styles.quickAddBtn}><Feather name="plus" size={20} color={colors.primary} /></TouchableOpacity>
                    <TextInput value={title} onChangeText={setTitle} placeholder="افزودن سریع وظیفه برای امروز..." placeholderTextColor={colors.textMuted} style={[styles.quickAddInput, { color: colors.textPrimary }]} onSubmitEditing={handleAdd} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    headerSubtitle: { fontSize: 13 },
    iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
    searchInput: { height: 45, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, fontFamily: 'System' },
    
    navCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 16, borderWidth: 1, position: 'relative' },
    navCardText: { fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#E63946', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderWidth: 2, borderColor: '#FFF' },
    badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    summaryCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 30, elevation: 2 },
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