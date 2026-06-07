import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Switch, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { lightTheme, darkTheme } from '../theme/AuraTheme';
import { TodoContext } from '../context/TodoContext';

export default function SettingsScreen({ dark, setDark }) {
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;
    
    // فراخوانی تابع واقعی پاک‌سازی از کانتکست
    const { clearAllData } = useContext(TodoContext); 

    const handleClearData = () => {
        Alert.alert(
            "پاک کردن تمام داده‌ها",
            "آیا مطمئن هستید؟ تمام وظایف شما برای همیشه پاک خواهند شد.",
            [
                { text: "انصراف", style: "cancel" },
                { 
                    text: "بله، پاک شود", 
                    onPress: async () => {
                        await clearAllData();
                        Alert.alert("موفقیت", "برنامه به حالت اولیه بازگشت.");
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
                <View style={styles.headerRow}>
                    <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>تنظیمات</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>شخصی‌سازی</Text>
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.primaryGlow }]}>
                                <Feather name={dark ? "moon" : "sun"} size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.textPrimary }]}>حالت تاریک</Text>
                        </View>
                        <Switch
                            value={dark} onValueChange={(val) => setDark(val)}
                            trackColor={{ false: colors.border, true: colors.primary }} thumbColor={"#FFF"}
                        />
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>داده‌ها</Text>
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <TouchableOpacity onPress={handleClearData} style={styles.settingRow}>
                        <View style={styles.settingIconText}>
                            <View style={[styles.iconWrapper, { backgroundColor: colors.dangerBg }]}>
                                <Feather name="trash-2" size={20} color={colors.danger} />
                            </View>
                            <Text style={[styles.settingText, { color: colors.danger }]}>پاک کردن تمام اطلاعات</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>توسعه یافته برای مدیریت بهتر وظایف</Text>
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