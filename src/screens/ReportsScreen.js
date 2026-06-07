import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import { LineChart } from 'react-native-chart-kit';
import Feather from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen({ dark }) {
    const { todos } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const [timeFrame, setTimeFrame] = useState('weekly'); 

    // محاسبه آمار کلی
    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // موتور محاسبه‌گر واقعیِ نمودار (۷ روز گذشته)
    const chartData = useMemo(() => {
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // استخراج حرف اول روز هفته (مثل: ش، ی، د)
            const dayName = new Intl.DateTimeFormat('fa-IR', { weekday: 'narrow' }).format(date);
            labels.push(dayName);
            
            // پیدا کردن کارهای ثبت شده در این روز
            const startOfDay = new Date(date.setHours(0,0,0,0)).getTime();
            const endOfDay = new Date(date.setHours(23,59,59,999)).getTime();
            
            const dayTasks = todos.filter(t => t.createdAt >= startOfDay && t.createdAt <= endOfDay);
            
            if (dayTasks.length === 0) {
                data.push(0); // اگر کاری نبود، درصد پیشرفت صفر
            } else {
                const completed = dayTasks.filter(t => t.completed).length;
                data.push(Math.round((completed / dayTasks.length) * 100));
            }
        }

        // جلوگیری از ایجاد خطای بصری در نمودار (اگر هیچ دیتایی نبود)
        const isAllZero = data.every(d => d === 0);

        return {
            labels,
            datasets: [{
                data: isAllZero ? [0, 0, 0, 0, 0, 0, 0] : data,
                color: (opacity = 1) => colors.primary,
                strokeWidth: 3
            }]
        };
    }, [todos, colors.primary]);

    const chartConfig = {
        backgroundGradientFrom: colors.bgCard,
        backgroundGradientTo: colors.bgCard,
        decimalPlaces: 0,
        color: (opacity = 1) => dark ? `rgba(69, 123, 157, ${opacity})` : `rgba(29, 53, 87, ${opacity})`,
        labelColor: (opacity = 1) => colors.textSecondary,
        style: { borderRadius: 16 },
        propsForDots: { r: '5', strokeWidth: '2', stroke: colors.primary }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>گزارش‌ها</Text>
                    <View style={[styles.dropdown, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>هفتگی</Text>
                        <Feather name="chevron-down" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                    </View>
                </View>

                <View style={[styles.progressCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <View style={[styles.bigCircle, { borderColor: colors.primary }]}>
                        <Text style={[styles.circlePercent, { color: colors.textPrimary }]}>{completionRate}٪</Text>
                        <Text style={[styles.circleLabel, { color: colors.textSecondary }]}>پیشرفت کلی</Text>
                    </View>
                    <View style={styles.miniStatsRow}>
                        <View style={styles.miniStatBox}>
                            <Text style={[styles.miniStatValue, { color: colors.textPrimary }]}>{totalTasks}</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.textMuted }]}>کل وظایف</Text>
                        </View>
                        <View style={styles.miniStatBox}>
                            <Text style={[styles.miniStatValue, { color: colors.success }]}>{completedTasks}</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.textMuted }]}>انجام شده</Text>
                        </View>
                        <View style={styles.miniStatBox}>
                            <Text style={[styles.miniStatValue, { color: colors.textPrimary }]}>{activeTasks}</Text>
                            <Text style={[styles.miniStatLabel, { color: colors.textMuted }]}>باقی‌مانده</Text>
                        </View>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>نمودار پیشرفت</Text>
                <View style={[styles.chartWrapper, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 70}
                        height={180}
                        chartConfig={chartConfig}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                        withVerticalLines={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    pageTitle: { fontSize: 22, fontWeight: 'bold' },
    dropdown: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
    dropdownText: { fontSize: 13, fontWeight: '500' },
    progressCard: { padding: 25, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginBottom: 25, elevation: 2 },
    bigCircle: { width: 150, height: 150, borderRadius: 75, borderWidth: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    circlePercent: { fontSize: 32, fontWeight: 'bold' },
    circleLabel: { fontSize: 12, marginTop: 4 },
    miniStatsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 15 },
    miniStatBox: { flex: 1, alignItems: 'center' },
    miniStatValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
    miniStatLabel: { fontSize: 11 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    chartWrapper: { padding: 10, borderRadius: 24, borderWidth: 1, alignItems: 'center' }
});