import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = (props) => {
    return (
        <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            name={props.name}
            id={props.id}
            value={props.value}
            autoCorrect={props.autoCorrect}
            onChangeText={props.onChangeText}
            onFocus={props.onFocus}
            secureTextEntry={props.secureTextEntry}
            keyboardType={props.keyboardType}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: 250,
        height: 50,
        backgroundColor: 'transparent', // Set background color to transparent
        margin: 10,
        padding: 0, // Adjust padding to reduce the space
        borderBottomWidth: 1, // Add bottom border
        borderBottomColor: 'black', // Color of the bottom border
    },
});

export default Input;
