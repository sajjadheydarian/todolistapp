import React, { useContext, useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import Config from "react-native-config";

// 1. ایمپورت کردن کامپوننت‌های تپسل
import { TapsellPlus, TapsellPlusBannerType, TapsellPlusHorizontalGravity, TapsellPlusVerticalGravity } from 'react-native-tapsell-plus';

export default function HomeScreen({ navigation, dark, setDark }) {
    const { todos, categories, addTodo, toggleTodo, deleteTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    // استیت‌های فرم ایجاد
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [selectedCategory, setSelectedCategory] = useState('personal'); // دسته‌بندی پیش‌فرض

    // استیت‌های فیلتر
    const [filter, setFilter] = useState('all'); // وضعیت انجام کار
    const [categoryFilter, setCategoryFilter] = useState('all'); // فیلتر دسته‌بندی

    // محاسبه آمار
    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, active, percent };
    }, [todos]);

    // فیلتر کردن لیستِ کارها بر اساس وضعیت و دسته‌بندی
    const filteredTodos = todos.filter(t => {
        const matchStatus = filter === 'active' ? !t.completed : (filter === 'completed' ? t.completed : true);
        const matchCategory = categoryFilter === 'all' ? true : t.category === categoryFilter;
        return matchStatus && matchCategory;
    });

    
    

    useEffect(() => {
        let currentBannerId = null;
        TapsellPlus.requestStandardBannerAd(Config.TAPSELL_ZONE_ID, TapsellPlusBannerType.BANNER_320x50)
            .then((responseId) => {
                currentBannerId = responseId;
                // نمایش بنر در پایین (BOTTOM) و مرکز (CENTER) صفحه
                TapsellPlus.showStandardBannerAd(
                    responseId,
                    TapsellPlusHorizontalGravity.BOTTOM,
                    TapsellPlusVerticalGravity.CENTER,
                    (data) => console.log("Banner Opened successfully"),
                    (error) => console.log("Error showing banner:", error)
                );
            })
            .catch(error => {
                console.log("Error requesting banner:", error);
            });

        // وقتی کاربر از برنامه خارج می‌شود، تبلیغ را می‌بندیم تا رم گوشی پر نشود
        return () => {
            if (currentBannerId) {
                TapsellPlus.destroyStandardBannerAd(currentBannerId);
            }
        };
    }, []);

    // اضافه کردن کار جدید
    const handleAdd = () => {
        if (title.trim()) {
            addTodo(title, '', selectedCategory, priority);
            setTitle('');
        }
    };

    // هشدار تایید قبل از حذف
    const confirmDelete = (id) => {
        Alert.alert(
            "حذف کار",
            "آیا مطمئن هستید که می‌خواهید این کار را برای همیشه پاک کنید؟",
            [
                { text: "خیر، دستم خورد", style: "cancel" },
                { text: "بله، پاک شود", onPress: () => deleteTodo(id), style: "destructive" }
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            {/* یک پدینگ 80 تایی به پایین دادیم تا بنر تبلیغاتی روی آیتم آخر نیفتد */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>

                {/* هدر اپلیکیشن */}
                <View style={styles.header}>
                    <View style={styles.logoRow}>
                        <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                            <Text style={styles.logoText}>لیست کارم</Text>
                        </View>
                        <Text style={[styles.appName, { color: colors.textPrimary }]}>مدیریت کارهای روزمره</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings', { dark })} style={[styles.themeBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            <Text style={{ fontSize: 20 }}>⚙️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDark(!dark)} style={[styles.themeBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            <Text style={{ fontSize: 20 }}>{dark ? '☀️' : '🌙'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* کارت‌های آماری */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>کارهای فعال</Text>
                        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.active}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>پیشرفت</Text>
                        <Text style={[styles.statValue, { color: colors.success }]}>{stats.percent}٪</Text>
                    </View>
                </View>

                {/* فرم افزودن کار جدید */}
                <View style={[styles.formCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="چه کاری باید انجام شود؟"
                        placeholderTextColor={colors.textMuted}
                        style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.bgApp, borderColor: colors.border }]}
                    />

                    {/* انتخاب دسته‌بندی در فرم */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catSelectScroll}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setSelectedCategory(cat.id)}
                                style={[styles.catChip, {
                                    backgroundColor: selectedCategory === cat.id ? cat.color : colors.bgApp,
                                    borderColor: selectedCategory === cat.id ? cat.color : colors.border
                                }]}>
                                <Text style={{ color: selectedCategory === cat.id ? '#fff' : colors.textSecondary, fontSize: 12, fontWeight: selectedCategory === cat.id ? 'bold' : 'normal' }}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.formRow}>
                        <TouchableOpacity
                            onPress={() => setPriority(priority === 'high' ? 'medium' : 'high')}
                            style={[styles.priorityBadge, { backgroundColor: priority === 'high' ? colors.dangerBg : colors.bgApp, borderColor: priority === 'high' ? colors.danger : colors.border }]}>
                            <Text style={{ color: priority === 'high' ? colors.danger : colors.textSecondary, fontSize: 13 }}>
                                {priority === 'high' ? 'فوری' : 'عادی'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                            <Text style={styles.addBtnText}>+ ایجاد کار</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* فیلتر وضعیت (اسکرول افقی) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                    {['all', 'active', 'completed'].map((f) => (
                        <TouchableOpacity
                            key={f} onPress={() => setFilter(f)}
                            style={[styles.filterBtn, {
                                backgroundColor: filter === f ? colors.primaryGlow : colors.bgCard,
                                borderColor: filter === f ? colors.primary : colors.border
                            }]}>
                            <Text style={{ color: filter === f ? colors.primary : colors.textSecondary, fontWeight: filter === f ? 'bold' : 'normal', fontSize: 13 }}>
                                {f === 'all' ? 'همه کارها' : f === 'active' ? 'در حال انجام' : 'تکمیل شده'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* فیلتر دسته‌بندی (اسکرول افقی) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filtersScroll, { marginBottom: 20 }]}>
                    <TouchableOpacity
                        onPress={() => setCategoryFilter('all')}
                        style={[styles.filterBtn, { paddingVertical: 6, backgroundColor: categoryFilter === 'all' ? colors.primaryGlow : colors.bgCard, borderColor: categoryFilter === 'all' ? colors.primary : colors.border }]}>
                        <Text style={{ color: categoryFilter === 'all' ? colors.primary : colors.textSecondary, fontSize: 12 }}>همه دسته‌ها</Text>
                    </TouchableOpacity>
                    {categories.map((c) => (
                        <TouchableOpacity
                            key={c.id} onPress={() => setCategoryFilter(c.id)}
                            style={[styles.filterBtn, { paddingVertical: 6, backgroundColor: categoryFilter === c.id ? c.color + '20' : colors.bgCard, borderColor: categoryFilter === c.id ? c.color : colors.border }]}>
                            <Text style={{ color: categoryFilter === c.id ? c.color : colors.textSecondary, fontSize: 12, fontWeight: categoryFilter === c.id ? 'bold' : 'normal' }}>
                                {c.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* لیست کارها */}
                {filteredTodos.map(todo => {
                    const cat = categories.find(c => c.id === todo.category);
                    return (
                        <View key={todo.id} style={[styles.taskCard, {
                            backgroundColor: colors.bgCard,
                            borderColor: todo.completed ? colors.success : colors.border,
                            opacity: todo.completed ? 0.7 : 1
                        }]}>
                            <View style={[styles.categoryIndicator, { backgroundColor: cat?.color || colors.border }]} />

                            <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={styles.checkboxArea}>
                                <View style={[styles.checkbox, { borderColor: todo.completed ? colors.success : colors.textMuted, backgroundColor: todo.completed ? colors.success : 'transparent' }]}>
                                    {todo.completed && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
                                </View>
                            </TouchableOpacity>

                            <View style={styles.taskContent}>
                                <Text style={[styles.taskTitle, {
                                    color: todo.completed ? colors.textMuted : colors.textPrimary,
                                    textDecorationLine: todo.completed ? 'line-through' : 'none'
                                }]}>
                                    {todo.title}
                                </Text>
                                <View style={styles.badgesRow}>
                                    <Text style={[styles.miniBadge, { backgroundColor: colors.bgApp, color: colors.textSecondary }]}>{cat?.name}</Text>
                                    {todo.priority === 'high' && (
                                        <Text style={[styles.miniBadge, { backgroundColor: colors.dangerBg, color: colors.danger }]}>فوری</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => confirmDelete(todo.id)} style={styles.deleteBtn}>
                                <Text style={{ color: colors.danger, fontSize: 18 }}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    logoText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    appName: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
    themeBtn: { width: 45, height: 45, borderRadius: 25, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },

    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { flex: 0.48, padding: 15, borderRadius: 16, borderWidth: 1, elevation: 1 },
    statLabel: { fontSize: 13, marginBottom: 5, fontWeight: '500' },
    statValue: { fontSize: 26, fontWeight: 'bold' },

    formCard: { padding: 15, borderRadius: 16, borderWidth: 1, marginBottom: 20, elevation: 2 },
    input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16, textAlign: 'right', marginBottom: 12 },
    catSelectScroll: { flexDirection: 'row', marginBottom: 15 },
    catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, marginRight: 8 },
    formRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    priorityBadge: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, borderWidth: 1 },
    addBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, elevation: 3 },
    addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

    filtersScroll: { flexDirection: 'row', marginBottom: 10 },
    filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, justifyContent: 'center' },

    taskCard: { flexDirection: 'row', padding: 15, borderRadius: 14, borderWidth: 1, marginBottom: 12, alignItems: 'center', overflow: 'hidden' },
    categoryIndicator: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 5 },
    checkboxArea: { paddingHorizontal: 10 },
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    taskContent: { flex: 1, paddingHorizontal: 10 },
    taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, textAlign: 'right' },
    badgesRow: { flexDirection: 'row', justifyContent: 'flex-start' },
    miniBadge: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 5, overflow: 'hidden' },
    deleteBtn: { padding: 8 }
});