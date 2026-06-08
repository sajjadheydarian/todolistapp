import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TAPSELL_APP_KEY } from '@env';
import { TapsellPlus } from 'react-native-tapsell-plus';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import AllTasksScreen from './src/screens/AllTasksScreen';
import OverdueTasksScreen from './src/screens/OverdueTasksScreen';
import { TodoProvider } from './src/context/TodoContext';
import { lightTheme, darkTheme } from './src/theme/AuraTheme';

TapsellPlus.initialize(TAPSELL_APP_KEY);
TapsellPlus.setGDPRConsent(true);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  const activeTheme = isDark ? darkTheme : lightTheme;

  const navTheme = {
    dark: isDark,
    colors: {
      primary: activeTheme.colors.primary,
      background: activeTheme.colors.bgApp,
      card: activeTheme.colors.bgCard,
      text: activeTheme.colors.textPrimary,
      border: activeTheme.colors.border,
      notification: activeTheme.colors.danger,
    },
  };

  return (
    <TodoProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* نوار ناوبری اصلی */}
          <Stack.Screen name="MainTabs">
            {props => <MainTabNavigator {...props} dark={isDark} setDark={setIsDark} />}
          </Stack.Screen>

          {/* صفحه نمایش همه وظایف */}
          <Stack.Screen name="AllTasks">
            {props => <AllTasksScreen {...props} dark={isDark} />}
          </Stack.Screen>

          {/* صفحه کارهای عقب‌افتاده و انجام‌نشده */}
          <Stack.Screen name="OverdueTasks">
            {props => <OverdueTasksScreen {...props} dark={isDark} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}