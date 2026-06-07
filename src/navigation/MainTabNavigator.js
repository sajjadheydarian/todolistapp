import React, { useEffect, useState, useContext, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { TAPSELL_ZONE_ID } from '@env';
import { TapsellPlus, TapsellPlusBannerType, TapsellPlusHorizontalGravity, TapsellPlusVerticalGravity } from 'react-native-tapsell-plus';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import { TodoContext } from '../context/TodoContext';

const EmptyScreen = () => null;

const Tab = createBottomTabNavigator();
const screenHeight = Dimensions.get('window').height;

const CustomTabBarButton = ({ children, onPress, colors }) => (
    <TouchableOpacity style={styles.customBtnWrapper} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.customBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function MainTabNavigator({ dark, setDark }) {
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    const { addTodo, categories } = useContext(TodoContext);
    const [isModalVisible, setModalVisible] = useState(false);

    // استیت‌های فرم ایجاد وظیفه جدید
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('medium');
    const [newTaskCat, setNewTaskCat] = useState('personal');
    const [selectedDate, setSelectedDate] = useState(new Date().setHours(0, 0, 0, 0));
    const [selectedTime, setSelectedTime] = useState('بدون زمان');

    // تولید 7 روز آینده برای انتخاب تقویم
    const upcomingDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const ts = d.setHours(0, 0, 0, 0);
            const dayName = i === 0 ? 'امروز' : (i === 1 ? 'فردا' : new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(d));
            days.push({ label: dayName, value: ts });
        }
        return days;
    }, []);

    const timeOptions = ['بدون زمان', '۰۸:۰۰', '۱۰:۰۰', '۱۲:۰۰', '۱۵:۰۰', '۱۸:۰۰', '۲۰:۰۰', '۲۲:۰۰'];

    useEffect(() => {
        let currentBannerId = null;
        TapsellPlus.requestStandardBannerAd(TAPSELL_ZONE_ID, TapsellPlusBannerType.BANNER_320x50)
            .then((responseId) => {
                currentBannerId = responseId;
                TapsellPlus.showStandardBannerAd(
                    responseId, TapsellPlusHorizontalGravity.BOTTOM, TapsellPlusVerticalGravity.CENTER,
                    () => console.log("Banner Global"), (error) => console.log("Banner error:", error)
                );
            }).catch(e => console.log("Request error:", e));
        return () => { if (currentBannerId) TapsellPlus.destroyStandardBannerAd(currentBannerId); };
    }, []);

    const handleSaveTask = () => {
        if (newTaskTitle.trim()) {
            // ذخیره همراه با تاریخ و زمان
            addTodo(newTaskTitle, '', newTaskCat, newTaskPriority, selectedDate, selectedTime === 'بدون زمان' ? null : selectedTime);
            setModalVisible(false);
            setNewTaskTitle('');
            setSelectedTime('بدون زمان');
        }
    };

    return (
        <View style={{ flex: 1, paddingBottom: 50, backgroundColor: colors.bgApp }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false, tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute', bottom: 15, left: 20, right: 20,
                        elevation: 0, backgroundColor: colors.bgCard, borderRadius: 20,
                        height: 70, borderTopWidth: 0, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 10,
                    }
                }}
            >
                <Tab.Screen name="HomeTab" options={{ tabBarIcon: ({ focused }) => <Feather name="home" size={24} color={focused ? colors.primary : colors.textMuted} /> }}>
                    {props => <HomeScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>
                <Tab.Screen name="CalendarTab" options={{ tabBarIcon: ({ focused }) => <Feather name="calendar" size={24} color={focused ? colors.primary : colors.textMuted} /> }}>
                    {props => <CalendarScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>
                <Tab.Screen
                    name="AddTab"
                    component={EmptyScreen} // این خط تغییر کرد
                    listeners={{ tabPress: (e) => { e.preventDefault(); setModalVisible(true); } }}
                    options={{
                        tabBarIcon: () => <Feather name="plus" size={32} color="#FFF" />,
                        tabBarButton: (props) => <CustomTabBarButton {...props} colors={colors} />
                    }}
                />
                <Tab.Screen name="ReportsTab" options={{ tabBarIcon: ({ focused }) => <Feather name="bar-chart-2" size={24} color={focused ? colors.primary : colors.textMuted} /> }}>
                    {props => <ReportsScreen {...props} dark={dark} />}
                </Tab.Screen>
                <Tab.Screen name="SettingsTab" options={{ tabBarIcon: ({ focused }) => <Feather name="settings" size={24} color={focused ? colors.primary : colors.textMuted} /> }}>
                    {props => <SettingsScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>
            </Tab.Navigator>

            <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.bgCard, maxHeight: screenHeight * 0.85 }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Feather name="x" size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>افزودن کار جدید</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput
                                value={newTaskTitle} onChangeText={setNewTaskTitle}
                                placeholder="عنوان وظیفه..." placeholderTextColor={colors.textMuted}
                                style={[styles.modalInput, { backgroundColor: colors.bgApp, color: colors.textPrimary, borderColor: colors.border }]}
                            />

                            {/* انتخاب روز */}
                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>تاریخ انجام:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {upcomingDays.map((d, i) => (
                                    <TouchableOpacity key={i} onPress={() => setSelectedDate(d.value)} style={[styles.chip, { backgroundColor: selectedDate === d.value ? colors.primary : colors.bgApp, borderColor: selectedDate === d.value ? colors.primary : colors.border }]}>
                                        <Text style={{ color: selectedDate === d.value ? '#fff' : colors.textSecondary, fontSize: 13 }}>{d.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* انتخاب زمان */}
                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>ساعت (اختیاری):</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {timeOptions.map((t, i) => (
                                    <TouchableOpacity key={i} onPress={() => setSelectedTime(t)} style={[styles.chip, { backgroundColor: selectedTime === t ? colors.accent : colors.bgApp, borderColor: selectedTime === t ? colors.accent : colors.border }]}>
                                        <Text style={{ color: selectedTime === t ? '#fff' : colors.textSecondary, fontSize: 13, fontWeight: selectedTime === t ? 'bold' : 'normal' }}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>دسته‌بندی:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {categories.map(cat => (
                                    <TouchableOpacity key={cat.id} onPress={() => setNewTaskCat(cat.id)} style={[styles.chip, { backgroundColor: newTaskCat === cat.id ? cat.color : colors.bgApp, borderColor: newTaskCat === cat.id ? cat.color : colors.border }]}>
                                        <Text style={{ color: newTaskCat === cat.id ? '#fff' : colors.textSecondary, fontSize: 13 }}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>اولویت:</Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 30 }}>
                                <TouchableOpacity onPress={() => setNewTaskPriority('medium')} style={[styles.priBtn, { backgroundColor: newTaskPriority === 'medium' ? colors.primary + '20' : colors.bgApp, borderColor: newTaskPriority === 'medium' ? colors.primary : colors.border }]}>
                                    <Text style={{ color: newTaskPriority === 'medium' ? colors.primary : colors.textSecondary }}>عادی</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setNewTaskPriority('high')} style={[styles.priBtn, { backgroundColor: newTaskPriority === 'high' ? colors.dangerBg : colors.bgApp, borderColor: newTaskPriority === 'high' ? colors.danger : colors.border }]}>
                                    <Text style={{ color: newTaskPriority === 'high' ? colors.danger : colors.textSecondary }}>فوری</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={handleSaveTask} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                                <Text style={styles.saveBtnText}>ذخیره وظیفه</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    customBtnWrapper: { top: -25, justifyContent: 'center', alignItems: 'center' },
    customBtn: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold' },
    modalInput: { height: 55, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 16, textAlign: 'right', marginBottom: 20 },
    modalLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 15, borderWidth: 1, marginLeft: 8 },
    priBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
    saveBtn: { height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2, marginBottom: 20 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});