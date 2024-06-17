import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const Maintenance = () => {
  const [repairType, setRepairType] = useState('');
  const [description, setDescription] = useState('');

  const handleRequestSubmit = async () => {
    try {
      // You can add validation logic here before making the API request

      const response = await axios.post(`${baseURL}maintenance-request`, {
        repairType,
        description,
        // Add any other required fields here
      });

      if (response.status === 201) {
        // Request successful
        Alert.alert('Request Submitted', 'Your repair request has been submitted successfully.');
        // You can also navigate the user to a confirmation screen or perform other actions
      } else {
        Alert.alert('Error', 'Failed to submit repair request. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting repair request:', error);
      Alert.alert('Error', 'Failed to submit repair request. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Maintenance Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Repair Type (e.g., Electric Fan, Refrigerator, Door)"
        value={repairType}
        onChangeText={(text) => setRepairType(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="Submit Request" onPress={handleRequestSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Maintenance;
