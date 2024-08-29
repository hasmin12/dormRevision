import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import { useSelector } from 'react-redux'; 

const Complaints = () => {
  const user = useSelector((state) => state.auth.user);

  const [name, setName] = useState('Anonymous User');
  const [complaint, setComplaint] = useState('');
  const [useName, setUseName] = useState(false);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  
const handleSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append('name', useName ? name : ''); 
    formData.append('complaint', complaint);

    // Adjust the URL if necessary
    const response = await axios.post(
      `${baseURL}/mobile/createComplaint/${user.user.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Complaint submitted successfully:', response.data);

    Toast.show({
      topOffset: 60,
      type: 'success',
      text1: 'Complaint submitted successfully',
    });

    // Clear form fields
    setName('');
    setComplaint('');
    setUseName(false); 
  } catch (error) {
    console.error('Error submitting Complaint:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }

    Toast.show({
      topOffset: 60,
      type: 'error',
      text1: 'Error submitting Complaint',
      text2: 'Please try again later',
    });
  }
};
  
  

  const handleCheckboxChange = () => {
    setUseName(!useName); 
    if (!useName && user) {
      setName(user.user.name); 
    } else {
      setName('Anonymous User'); 
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={[styles.checkbox, useName && styles.checked]}
          onPress={handleCheckboxChange}
        >
          {useName && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
        <Text>Use Name?</Text>
      </View>
      <TextInput
        style={[styles.input]}
        editable={false}
        value={name}
      />
      <TextInput
        style={[styles.input, { height: 150 }]}
        placeholder="Enter your complaint"
        multiline
        value={complaint}
        onChangeText={setComplaint}
      />
      <Button title="Submit" onPress={handleSubmit} accessibilityLabel="Submit Complaint" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
  },
  checked: {
    backgroundColor: 'green',
  },
});

export default Complaints;
