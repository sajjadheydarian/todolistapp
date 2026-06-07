import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { TAPSELL_ZONE_ID } from '@env';
import { TapsellPlus, TapsellPlusBannerType, TapsellPlusHorizontalGravity, TapsellPlusVerticalGravity } from 'react-native-tapsell-plus';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { lightTheme, darkTheme } from '../theme/AuraTheme';

// کامپوننت موقت برای صفحاتی که در فازهای بعدی برنامه‌نویسی می‌کنیم
const DummyScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>در حال ساخت...</Text>
    </View>
);

const Tab = createBottomTabNavigator();

// طراحی دکمه برجسته و شناور در مرکز نوار
const CustomTabBarButton = ({ children, onPress, colors }) => (
    <TouchableOpacity
        style={styles.customBtnWrapper}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={[styles.customBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
            {children}
        </View>
    </TouchableOpacity>
);

export default function MainTabNavigator({ dark, setDark }) {
    const theme = dark ? darkTheme : lightTheme;
    const { colors } = theme;

    // مدیریت سراسری بنر تبلیغاتی
    useEffect(() => {
        let currentBannerId = null;
        TapsellPlus.requestStandardBannerAd(TAPSELL_ZONE_ID, TapsellPlusBannerType.BANNER_320x50)
            .then((responseId) => {
                currentBannerId = responseId;
                TapsellPlus.showStandardBannerAd(
                    responseId,
                    TapsellPlusHorizontalGravity.BOTTOM,
                    TapsellPlusVerticalGravity.CENTER,
                    () => console.log("Banner Opened Globally"),
                    (error) => console.log("Banner error:", error)
                );
            })
            .catch(error => console.log("Request error:", error));

        return () => {
            if (currentBannerId) TapsellPlus.destroyStandardBannerAd(currentBannerId);
        };
    }, []);

    return (
        // پدینگ 50 تایی برای اینکه تب‌بار دقیقاً بالای بنر تپسل قرار بگیرد و زیر آن نرود
        <View style={{ flex: 1, paddingBottom: 50, backgroundColor: colors.bgApp }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 15, // فاصله از پایین (بالای تبلیغ)
                        left: 20,
                        right: 20,
                        elevation: 0,
                        backgroundColor: colors.bgCard,
                        borderRadius: 20,
                        height: 70,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                    }
                }}
            >
                <Tab.Screen
                    name="HomeTab"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Feather name="home" size={24} color={focused ? colors.primary : colors.textMuted} />
                        )
                    }}
                >
                    {props => <HomeScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>

                <Tab.Screen
                    name="CalendarTab"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Feather name="calendar" size={24} color={focused ? colors.primary : colors.textMuted} />
                        )
                    }}
                >
                    {props => <CalendarScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>

                {/* دکمه مرکزی شناور */}
                <Tab.Screen
                    name="AddTab"
                    component={DummyScreen}
                    options={{
                        tabBarIcon: () => (
                            <Feather name="plus" size={32} color="#FFF" />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} colors={colors} />
                        )
                    }}
                />

                <Tab.Screen
                    name="ReportsTab"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Feather name="bar-chart-2" size={24} color={focused ? colors.primary : colors.textMuted} />
                        )
                    }}
                >
                    {props => <ReportsScreen {...props} dark={dark} />}
                </Tab.Screen>

                <Tab.Screen
                    name="SettingsTab"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Feather name="settings" size={24} color={focused ? colors.primary : colors.textMuted} />
                        )
                    }}
                >
                    {props => <SettingsScreen {...props} dark={dark} setDark={setDark} />}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    customBtnWrapper: {
        top: -25, // بیرون‌زدگی از نوار
        justifyContent: 'center',
        alignItems: 'center',
    },
    customBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
});