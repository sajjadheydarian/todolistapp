import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Dimensions, Modal } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import { LineChart } from 'react-native-chart-kit';
import Feather from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen({ dark }) {
    const { todos } = useContext(TodoContext);
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [timeFrame, setTimeFrame] = useState({ label: 'هفتگی', days: 7 }); 

    const timeOptions = [
        { label: '۳ روزه', days: 3 },
        { label: 'هفتگی', days: 7 },
        { label: 'دو هفته', days: 14 },
        { label: 'یک ماهه', days: 30 },
    ];

    const totalTasks = todos.length;
    const completedTasks = todos.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const chartData = useMemo(() => {
        const labels = [];
        const data = [];
        
        for (let i = timeFrame.days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // برای بازه 30 روزه، فقط بعضی لیبل‌ها را نشان می‌دهیم تا نمودار شلوغ نشود
            if (timeFrame.days <= 7 || i % Math.ceil(timeFrame.days / 7) === 0) {
                labels.push(new Intl.DateTimeFormat('fa-IR', { weekday: 'narrow' }).format(date));
            } else {
                labels.push('');
            }
            
            const startOfDay = new Date(date.setHours(0,0,0,0)).getTime();
            const endOfDay = new Date(date.setHours(23,59,59,999)).getTime();
            
            const dayTasks = todos.filter(t => t.createdAt >= startOfDay && t.createdAt <= endOfDay);
            
            if (dayTasks.length === 0) {
                data.push(0);
            } else {
                const completed = dayTasks.filter(t => t.completed).length;
                data.push(Math.round((completed / dayTasks.length) * 100));
            }
        }

        const isAllZero = data.every(d => d === 0);
        return {
            labels,
            datasets: [{
                data: isAllZero ? Array(timeFrame.days).fill(0) : data,
                color: (opacity = 1) => colors.primary,
                strokeWidth: 3
            }]
        };
    }, [todos, colors.primary, timeFrame.days]);

    const chartConfig = {
        backgroundGradientFrom: colors.bgCard,
        backgroundGradientTo: colors.bgCard,
        decimalPlaces: 0,
        color: (opacity = 1) => dark ? `rgba(69, 123, 157, ${opacity})` : `rgba(29, 53, 87, ${opacity})`,
        labelColor: (opacity = 1) => colors.textSecondary,
        style: { borderRadius: 16 },
        propsForDots: { r: timeFrame.days > 14 ? '2' : '5', strokeWidth: '2', stroke: colors.primary }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>گزارش‌ها</Text>
                    
                    <TouchableOpacity onPress={() => setIsDropdownOpen(true)} style={[styles.dropdown, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>{timeFrame.label}</Text>
                        <Feather name="chevron-down" size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
                    </TouchableOpacity>
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
                        data={chartData} width={screenWidth - 70} height={180}
                        chartConfig={chartConfig} bezier style={{ marginVertical: 8, borderRadius: 16 }}
                        withVerticalLines={false}
                    />
                </View>
            </ScrollView>

            {/* مودال انتخاب بازه زمانی */}
            <Modal visible={isDropdownOpen} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsDropdownOpen(false)}>
                    <View style={[styles.dropdownMenu, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        {timeOptions.map((opt, idx) => (
                            <TouchableOpacity 
                                key={idx} 
                                style={[styles.dropdownItem, idx < timeOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                                onPress={() => { setTimeFrame(opt); setIsDropdownOpen(false); }}
                            >
                                <Text style={{ color: timeFrame.days === opt.days ? colors.primary : colors.textPrimary, fontWeight: timeFrame.days === opt.days ? 'bold' : 'normal' }}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    chartWrapper: { padding: 10, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    dropdownMenu: { width: 200, borderRadius: 15, borderWidth: 1, overflow: 'hidden', elevation: 5 },
    dropdownItem: { padding: 15, alignItems: 'center' }
});