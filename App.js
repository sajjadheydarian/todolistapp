import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import { TodoProvider } from './src/context/TodoContext';
import { lightTheme, darkTheme } from './src/theme/AuraTheme';

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
        {/* هدر پیش‌فرض را خاموش کردیم چون در صفحه اصلی یک هدر گرافیکی و زیبا ساختیم */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {props => <HomeScreen {...props} dark={isDark} setDark={setIsDark} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}