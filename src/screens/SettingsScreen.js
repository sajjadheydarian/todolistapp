import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Switch, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import { TodoContext } from '../context/TodoContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ dark, setDark }) {
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;
    
    // در صورت نیاز به پاکسازی کل داده‌ها
    // const { setTodos, setCategories } = useContext(TodoContext); 

    const handleClearData = () => {
        Alert.alert(
            "پاک کردن تمام داده‌ها",
            "آیا مطمئن هستید؟ تمام وظایف و دسته‌بندی‌های شما برای همیشه پاک خواهند شد و قابل بازیابی نیستند.",
            [
                { text: "انصراف", style: "cancel" },
                { 
                    text: "بله، پاک شود", 
                    onPress: async () => {
                        // await AsyncStorage.clear();
                        // در یک نسخه کامل اینجا توابع ریست کردن Context صدا زده می‌شوند
                        Alert.alert("موفقیت", "داده‌ها با موفقیت پاک شدند. (این یک پیام نمایشی است)");
                    }, 
                    style: "destructive" 
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgApp} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                
                {/* هدر صفحه */}
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>تنظیمات</Text>
                </View>

                {/* بخش اول: شخصی‌سازی (ظاهر اپلیکیشن) */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>شخصی‌سازی</Text>
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryGlow }]}>
                                <Feather name={dark ? "moon" : "sun"} size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>حالت تاریک (Dark Mode)</Text>
                        </View>
                        <Switch
                            value={dark}
                            onValueChange={(val) => setDark(val)}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={"#FFF"}
                        />
                    </View>
                </View>

                {/* بخش دوم: مدیریت داده‌ها */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>داده‌ها و حریم خصوصی</Text>
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                <Feather name="download-cloud" size={20} color={colors.success} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>پشتیبان‌گیری از داده‌ها</Text>
                        </View>
                        <Feather name="chevron-left" size={20} color={colors.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleClearData} style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.dangerBg }]}>
                                <Feather name="trash-2" size={20} color={colors.danger} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.danger }]}>پاک کردن تمام اطلاعات</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* بخش سوم: درباره اپلیکیشن */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>درباره</Text>
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryGlow }]}>
                                <Feather name="star" size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>امتیاز به برنامه</Text>
                        </View>
                        <Feather name="chevron-left" size={20} color={colors.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryGlow }]}>
                                <Feather name="mail" size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>تماس با پشتیبانی</Text>
                        </View>
                        <Feather name="chevron-left" size={20} color={colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryGlow }]}>
                                <Feather name="info" size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>نسخه برنامه</Text>
                        </View>
                        <Text style={{ color: colors.textMuted, fontSize: 14 }}>۱.۰.۰</Text>
                    </View>
                </View>

                {/* امضای توسعه‌دهنده */}
                <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>توسعه یافته با ❤️ برای نظم بیشتر</Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    pageTitle: { fontSize: 24, fontWeight: 'bold' },
    
    sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
    
    card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 10 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    settingIconText: { flexDirection: 'row', alignItems: 'center' },
    
    iconWrapper: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
    settingText: { fontSize: 15, fontWeight: '500' }
});