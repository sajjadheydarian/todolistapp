import React from 'react';

import { TouchableOpacity, Text, View } from 'react-native';

export default function TodoItem({ item, onToggle, onSelect, selected }) {

    return (

        <TouchableOpacity

            onPress={onToggle}

            onLongPress={onSelect}

            style={{

                padding: 15,

                backgroundColor: selected ? '#ffb3b3' : '#f2f2f2',

                marginTop: 10,

                borderRadius: 8

            }}>

            <Text style={{ fontSize: 18 }}>

                {item.done ? '✔️ ' : '⬜ '}

                {item.text}

            </Text>

        </TouchableOpacity>

    );

}