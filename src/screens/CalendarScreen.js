import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';

export default function CalendarScreen({ dark, setDark }) {
    const { todos } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    // استیت برای روز انتخاب شده (به صورت نمایشی برای رابط کاربری)
    const [selectedDate, setSelectedDate] = useState(25);

    // روزهای هفته به صورت نمونه برای پیاده‌سازی UI مطابق عکس
    const weekDays = [
        { day: 'ش', date: 25 },
        { day: 'ی', date: 26 },
        { day: 'د', date: 27 },
        { day: 'س', date: 28 },
        { day: 'چ', date: 29 },
        { day: 'پ', date: 30 },
        { day: 'ج', date: 31 },
    ];

    // در یک اپلیکیشن واقعی، اینجا کارها را بر اساس selectedDate فیلتر می‌کنیم
    // اما فعلاً برای نمایش، تمام کارهای موجود را در تایم‌لاین نشان می‌دهیم
    const dailyTodos = todos;

    // تولید یک زمان فرضی برای نمایش در تایم‌لاین (چون فعلاً کارهایمان زمان دقیق ندارند)
    const mockTimes = ['۰۸:۰۰', '۰۹:۳۰', '۱۱:۰۰', '۱۵:۰۰', '۱۸:۰۰', '۲۰:۰۰'];

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                {/* هدر تقویم: ماه و فلش‌ها */}
                <View style={styles.calendarHeader}>
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Feather name="chevron-right" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    
                    <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>اردیبهشت ۱۴۰۳</Text>
                    
                    <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Feather name="chevron-left" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* نوار روزهای هفته */}
                <View style={[styles.weekStrip, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    {weekDays.map((item, index) => {
                        const isSelected = item.date === selectedDate;
                        return (
                            <TouchableOpacity 
                                key={index} 
                                onPress={() => setSelectedDate(item.date)}
                                style={[styles.dayItem, isSelected && { backgroundColor: colors.primary }]}
                            >
                                <Text style={[styles.dayText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                                    {item.day}
                                </Text>
                                <Text style={[styles.dateText, { color: isSelected ? '#FFF' : colors.textPrimary }]}>
                                    {item.date}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* عنوان تایم‌لاین */}
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>وظایف روز</Text>

                {/* تایم‌لاین (خط زمانی) */}
                <View style={[styles.timelineContainer, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    {dailyTodos.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: colors.textMuted, padding: 20 }}>وظیفه‌ای برای این روز ثبت نشده است.</Text>
                    ) : (
                        dailyTodos.map((todo, index) => {
                            const isLast = index === dailyTodos.length - 1;
                            const time = todo.time || mockTimes[index % mockTimes.length]; // استفاده از زمان واقعی یا فرضی
                            
                            return (
                                <View key={todo.id} style={styles.timelineRow}>
                                    
                                    {/* بخش ساعت */}
                                    <View style={styles.timeColumn}>
                                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>{time}</Text>
                                    </View>

                                    {/* بخش خط و نقطه */}
                                    <View style={styles.lineColumn}>
                                        <View style={[styles.timelineDot, { 
                                            borderColor: todo.completed ? colors.success : colors.textMuted,
                                            backgroundColor: todo.completed ? colors.success : colors.bgCard 
                                        }]}>
                                            {todo.completed && <Feather name="check" size={10} color="#FFF" />}
                                        </View>
                                        {!isLast && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
                                    </View>

                                    {/* بخش کارت وظیفه */}
                                    <View style={styles.taskColumn}>
                                        <TouchableOpacity 
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