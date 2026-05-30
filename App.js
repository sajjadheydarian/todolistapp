import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import Navigation from './src/navigation';

import { TodoProvider } from './src/context/TodoContext';

import LightTheme from './src/theme/LightTheme';

import DarkTheme from './src/theme/DarkTheme';

export default function App() {

    const [dark, setDark] = useState(false);

    return (

        <TodoProvider>

            <NavigationContainer theme={dark ? DarkTheme : LightTheme}>

                <Navigation dark={dark} setDark={setDark} />

            </NavigationContainer>

        </TodoProvider>

    );

}