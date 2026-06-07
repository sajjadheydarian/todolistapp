import React, { useContext, useState } from 'react';
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

    const [timeFrame, setTimeFrame] = useState('weekly'); // هفتگی، ماهانه، کلی

    // محاسبه آمار کلی
    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // داده‌های فرضی برای نمودار خطی متناسب با عکس طراحی
    const chartData = {
        labels: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
        datasets: [
            {
                data: [20, 45, 28, 80, 59, 43, 65], // میزان درصد پیشرفت فرضی در روزها
                color: (opacity = 1) => colors.primary, // رنگ اصلی خط نمودار
                strokeWidth: 3
            }
        ]
    };

    // پیکربندی گرافیکی نمودار خطی
    const chartConfig = {
        backgroundGradientFrom: colors.bgCard,
        backgroundGradientTo: colors.bgCard,
        decimalPlaces: 0,
        color: (opacity = 1) => dark ? `rgba(69, 123, 157, ${opacity})` : `rgba(29, 53, 87, ${opacity})`,
        labelColor: (opacity = 1) => colors.textSecondary,
        style: { borderRadius: 16 },
        propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: colors.primary
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                {/* هدر صفحه گزارش‌ها و فیلتر بازه زمانی */}
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>گزارش‌ها</Text>
                    
                    <View style={[styles.dropdown, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
                            {timeFrame === 'weekly' ? 'هفتگی' : timeFrame === 'monthly' ? 'ماهانه' : 'کلی'}
                        </Text>
                        <Feather name="chevron-down" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                    </View>
                </View>

                {/* کارت درصد پیشرفت کلی */}
                <View style={[styles.progressCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <View style={[styles.bigCircle, { borderColor: colors.primary }]}>
                        <Text style={[styles.circlePercent, { color: colors.textPrimary }]}>{completionRate}٪</Text>
                        <Text style={[styles.circleLabel, { color: colors.textSecondary }]}>پیشرفت کلی</Text>
                    </View>

                    {/* اطلاعات تکمیلی زیر دایره */}
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

                {/* بخش نمودار پیشرفت */}
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>نمودار پیشرفت</Text>
                <View style={[styles.chartWrapper, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 70} // تنظیم دقیق اندازه عرض نمودار نسبت به کارت
                        height={180}
                        chartConfig={chartConfig}
                        bezier // منحنی کردن خطوط نمودار دقیقا مثل عکس طراحی
                        style={{ marginVertical: 8, borderRadius: 16 }}
                        withVerticalLines={false} // حذف خطوط عمودی برای خلوت شدن و زیبایی نمودار
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
    
    progressCard: { padding: 25, borderRadius: 24, borderWidth: 1, alignItems: 'center', marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 } },
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