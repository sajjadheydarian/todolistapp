import React from 'react';

import { TouchableOpacity, Text, View } from 'react-native';

export default function ThemeSwitch({ dark, setDark }) {

    return (

        <TouchableOpacity

            onPress={() => setDark(!dark)}

            style={{

                padding: 10,

                alignSelf: 'flex-end',

                backgroundColor: dark ? "#00eaff" : "#007aff",

                borderRadius: 8,

                marginBottom: 15

            }}>

            <Text style={{ color: 'white' }}>{dark ? "حالت روشن" : "حالت تیره"}</Text>

        </TouchableOpacity>

    );

}