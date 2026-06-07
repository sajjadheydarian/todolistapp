import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';

export default function CalendarScreen({ dark }) {
    const { todos, toggleTodo } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    // استیت برای روز انتخاب شده (پیش‌فرض: شروع امروز)
    const [selectedDate, setSelectedDate] = useState(new Date().setHours(0,0,0,0));

    // تولید تقویم شمسی پویا (از ۲ روز قبل تا ۴ روز آینده برای ظاهر زیباتر)
    const calendarDays = useMemo(() => {
        const days = [];
        for(let i = -2; i <= 4; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const ts = d.setHours(0,0,0,0);
            
            const dayChar = new Intl.DateTimeFormat('fa-IR', { weekday: 'narrow' }).format(d);
            const dayNum = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' }).format(d);
            
            days.push({ day: dayChar, dateText: dayNum, timestamp: ts });
        }
        return days;
    }, []);

    // نام ماه و سال جاری به شمسی برای هدر
    const currentMonthYear = new Intl.DateTimeFormat('fa-IR', { month: 'long', year: 'numeric' }).format(new Date());

    // فیلتر کارهای مربوط به روز انتخاب شده و مرتب‌سازی بر اساس زمان
    const dailyTodos = todos
        .filter(t => t.date === selectedDate)
        .sort((a, b) => {
            if (!a.time) return 1;
            if (!b.time) return -1;
            return a.time.localeCompare(b.time); // مرتب‌سازی صعودی بر اساس ساعت
        });

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                <View style={styles.calendarHeader}>
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Feather name="chevron-right" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>{currentMonthYear}</Text>
                    
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Feather name="chevron-left" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* نوار پویای روزهای هفته */}
                <View style={[styles.weekStrip, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    {calendarDays.map((item, index) => {
                        const isSelected = item.timestamp === selectedDate;
                        return (
                            <TouchableOpacity 
                                key={index} 
                                onPress={() => setSelectedDate(item.timestamp)}
                                style={[styles.dayItem, isSelected && { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.dayText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                                    {item.day}
                                </Text>
                                <Text style={[styles.dateText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                                    {item.dateText}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>وظایف این روز</Text>

                <View style={[styles.timelineContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    {dailyTodos.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: colors.textMuted, padding: 20 }}>وظیفه‌ای برای این روز ثبت نشده است.</Text>
                    ) : (
                        dailyTodos.map((todo, index) => {
                            const isLast = index === dailyTodos.length - 1;
                            const timeToDisplay = todo.time || '--:--'; 
                            
                            return (
                                <View key={todo.id} style={styles.timelineRow}>
                                    <View style={styles.timeColumn}>
                                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{timeToDisplay}</Text>
                                    </View>

                                    <View style={styles.lineColumn}>
                                        <TouchableOpacity onPress={() => toggleTodo(todo.id)} style={[styles.timelineDot, { 
                                            borderColor: todo.completed ? colors.success : colors.textMuted,
                                            backgroundColor: todo.completed ? colors.success : colors.bgCard 
                                        }]}>
                                            {todo.completed && <Feather name="check" size={10} color="#FFF" />}
                                        </TouchableOpacity>
                                        {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                                    </View>

                                    <View style={styles.taskColumn}>
                                        <TouchableOpacity 
                                            onPress={() => toggleTodo(todo.id)}
                                            style={[styles.taskCard, { 
                                                backgroundColor: todo.completed ? colors.bgApp : colors.bgCard,
                                                borderColor: todo.completed ? colors.success : colors.border 
                                            }]}
                                        >
                                            <Text style={[styles.taskTitle, { 
                                                color: todo.completed ? colors.textMuted : colors.textPrimary,
                                                textDecorationLine: todo.completed ? 'line-through' : 'none'
                                            }]}>
                                                {todo.title}
                                            </Text>
                                            {todo.priority === 'high' && (
                                                <Feather name="star" size={14} color={colors.accent} style={{ marginLeft: 8 }} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    monthTitle: { fontSize: 18, fontWeight: 'bold' },
    iconBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    weekStrip: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderRadius: 20, borderWidth: 1, marginBottom: 25 },
    dayItem: { width: 40, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    dayText: { fontSize: 13, marginBottom: 4 },
    dateText: { fontSize: 16, fontWeight: 'bold' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    timelineContainer: { padding: 15, borderRadius: 20, borderWidth: 1 },
    timelineRow: { flexDirection: 'row', minHeight: 60 },
    timeColumn: { width: 50, alignItems: 'center', paddingTop: 12 },
    timeText: { fontSize: 13, fontWeight: '500' },
    lineColumn: { width: 30, alignItems: 'center' },
    timelineDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 12, zIndex: 2 },
    timelineLine: { position: 'absolute', top: 30, bottom: -12, width: 2, zIndex: 1 },
    taskColumn: { flex: 1, paddingBottom: 15 },
    taskCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 4 },
    taskTitle: { flex: 1, fontSize: 14, fontWeight: '500', textAlign: 'right' }
});