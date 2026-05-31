import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNRestart from 'react-native-restart'; // برای اعمال راست‌چین نیاز به ری‌استارت اپلیکیشن است

// وارد کردن فایل‌های خودتان (مسیرها را در صورت نیاز بررسی کنید)
import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import { TodoProvider } from './src/context/TodoContext';

const Stack = createNativeStackNavigator();

export default function App() {
  
  // تنظیم اپلیکیشن برای پشتیبانی از زبان فارسی و راست‌چین شدن
  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      // این دستور اپلیکیشن را یک بار ری‌استارت می‌کند تا چینش راست‌به‌چپ اعمال شود
      RNRestart.restart(); 
    }
  }, []);

  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'مدیریت کارها' }} 
          />
          <Stack.Screen 
            name="Folder" 
            component={FolderScreen} 
            options={{ title: 'پوشه کار' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}