import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { TodoContext } from '../context/TodoContext';
import { lightTheme, darkTheme } from '../theme/AuraTheme';

// پالت رنگ‌های پیشنهادی برای ساخت دسته جدید
const PRESET_COLORS = ['#6366f1', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function SettingsScreen({ route, navigation }) {
    const { dark } = route.params;
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;
    const { categories, addCategory, deleteCategory } = useContext(TodoContext);

    const [catName, setCatName] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const handleAdd = () => {
        if (catName.trim()) {
            addCategory(catName, selectedColor);
            setCatName('');
        }
    };

    const confirmDelete = (id, name) => {
        Alert.alert("حذف دسته‌بندی", `آیا دسته‌بندی "${name}" حذف شود؟ کارهای این دسته بدون برچسب می‌شوند.`, [
            { text: "انصراف", style: "cancel" },
            { text: "حذف", onPress: () => deleteCategory(id), style: "destructive" }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgApp }]}>
            {/* هدر صفحه تنظیمات */}
            <View style={[styles.header, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>➔ بازگشت</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>تنظیمات دسته‌ها</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* فرم ساخت دسته‌بندی */}
                <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>ایجاد دسته‌بندی جدید</Text>
                    
                    <TextInput
                        value={catName} onChangeText={setCatName}
                        placeholder="نام دسته‌بندی (مثلاً: باشگاه)" placeholderTextColor={colors.textMuted}
                        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.bgApp }]}
                    />
                    
                    <Text style={[styles.subTitle, { color: colors.textSecondary }]}>انتخاب رنگ:</Text>
                    <View style={styles.colorRow}>
                        {PRESET_COLORS.map(color => (
                            <TouchableOpacity 
                                key={color} onPress={() => setSelectedColor(color)}
                                style={[styles.colorCircle, { 
                                    backgroundColor: color, 
                                    borderWidth: selectedColor === color ? 3 : 0, 
                                    borderColor: colors.textPrimary 
                                }]} 
                            />
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleAdd} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                        <Text style={styles.addBtnText}>+ افزودن دسته</Text>
                    </TouchableOpacity>
                </View>

                {/* لیست دسته‌بندی‌های موجود */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>دسته‌بندی‌های فعلی</Text>
                {categories.map(cat => (
                    <View key={cat.id} style={[styles.catRow, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <View style={styles.catInfo}>
                            <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                            <Text style={[styles.catName, { color: colors.textPrimary }]}>{cat.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => confirmDelete(cat.id, cat.name)}>
                            <Text style={{ color: colors.danger, fontSize: 18 }}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, borderWidth: 1, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    
    card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 25, elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'right' },
    input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16, textAlign: 'right', marginBottom: 15 },
    subTitle: { fontSize: 14, marginBottom: 10, textAlign: 'right' },
    
    colorRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', marginBottom: 20, gap: 10 },
    colorCircle: { width: 35, height: 35, borderRadius: 18 },
    
    addBtn: { padding: 14, borderRadius: 10, alignItems: 'center', elevation: 3 },
    addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },

    sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
    catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
    catInfo: { flexDirection: 'row', alignItems: 'center' },
    catDot: { width: 12, height: 12, borderRadius: 6, marginLeft: 10 }, // margin left بخاطر راست چین بودن
    catName: { fontSize: 16, fontWeight: '500' }
});