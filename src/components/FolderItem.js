import React from 'react';

import {TouchableOpacity, Text, View} from 'react-native';

export default function FolderItem({item, onPress}) {

return (

<TouchableOpacity

onPress={onPress}

style={{

padding: 18,

backgroundColor: '#ececec',

marginTop: 12,

borderRadius: 10

}}>

<Text style={{fontSize: 18}}>{item.title}</Text>

<Text style={{color: '#777'}}>{item.todos.length} کار</Text>

</TouchableOpacity>

);

}