import React, { useEffect, useState } from 'react';
import { I18nManager, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import { TodoProvider } from './src/context/TodoContext';
import LightTheme from './LightTheme'; 
import DarkTheme from './DarkTheme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  // ترکیب تم اختصاصی شما با تمِ نویگیشن
  const appTheme = isDark 
    ? { ...NavDarkTheme, colors: { ...NavDarkTheme.colors, ...DarkTheme.colors, primary: '#00eaff' } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, ...LightTheme.colors, primary: '#008B8B' } };

  return (
    <TodoProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={appTheme.colors.card} />
      <NavigationContainer theme={appTheme}>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' } }}>
          <Stack.Screen name="Home" options={{ title: 'مدیریت کارها' }}>
            {/* پاس دادن صحیح توابع تم به صفحه اصلی */}
            {props => <HomeScreen {...props} dark={isDark} setDark={setIsDark} />}
          </Stack.Screen>
          <Stack.Screen name="Folder" component={FolderScreen} options={{ title: 'پوشه کار' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}