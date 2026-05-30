import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '…/screens/HomeScreen';

import FolderScreen from '…/screens/FolderScreen';

const Stack = createNativeStackNavigator();

export default function Navigation({ dark, setDark }) {

    return (

        <Stack.Navigator>

            <Stack.Screen

                name="Home"

                options={{ title: "کارام" }}>

                {props => <HomeScreen {...props} dark={dark} setDark={setDark} />}

            </Stack.Screen>

            <Stack.Screen

                name="Folder"

                component={FolderScreen}

                options={{ title: "پوشه" }} />

        </Stack.Navigator>

    );

}