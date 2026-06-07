import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from './src/screens/SettingsScreen';

import HomeScreen from './src/screens/HomeScreen';
import { TodoProvider } from './src/context/TodoContext';
import { lightTheme, darkTheme } from './src/theme/AuraTheme';
import { TAPSELL_APP_KEY } from '@env';

// ۱. اضافه کردن کتابخانه تپسل
import { TapsellPlus } from 'react-native-tapsell-plus';


// ۳. روشن کردن موتور تپسل در فضای سراسری (قبل از اینکه صفحات ساخته شوند)

TapsellPlus.initialize(TAPSELL_APP_KEY);
TapsellPlus.setGDPRConsent(true);

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  // اجبار به راست‌چین شدن اپلیکیشن

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  const activeTheme = isDark ? darkTheme : lightTheme;

  // تنظیم رنگ‌های پایه نویگیشن برای هماهنگی با گوشی

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
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} dark={isDark} setDark={setIsDark} />}
          </Stack.Screen>
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}