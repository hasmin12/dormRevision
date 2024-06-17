import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';
import Input from '../../shared/Form/Input';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import DropDownPicker from 'react-native-dropdown-picker';

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [violationName, setViolationName] = useState('');
//   const [violationDate, setViolationDate] = useState('');
  const [violationType, setViolationType] = useState('');
  const [penalty, setPenalty] = useState('');

  // Residents dropdown options
  const [residentOptions, setResidentOptions] = useState([]);

  const [selectedResident, setSelectedResident] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([

  ]);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };
  // Fetch residents data
  const fetchResidents = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getResidents`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      console.log(response.data);

      // Assuming response.data.residents is an array of resident names
      setResidentOptions(response.data.residents); 
    } catch (error) {
      console.error('Error fetching Residents:', error.response);
    }
  };

  // Fetch violations data
  const fetchViolations = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getViolations`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      console.log(response.data);

      setViolations(response.data.violations); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Violations:', error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents(); // Fetch residents data when component mounts
    fetchViolations(); // Fetch violations data when component mounts
  }, []);

  const handleAdd = () => {
    setAddModalVisible(true);
  };
console.log(selectedResident);
  const handleAddModalClose = () => {
    setAddModalVisible(false);
  };

  const handleSaveAdd = async () => {
    try {
        const token = await getAuthToken();
    
        const formData = new FormData();
        formData.append('user_id', selectedResident);
        formData.append('violationName', violationName);
        formData.append('violationType', violationType);
        formData.append('penalty', penalty);
      
        const response = await axios.post(`${baseURL}/createViolation`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('Announcement added successfully:', response.data);
    
        // Close the add modal and refresh the list of announcements
        handleAddModalClose();
        fetchViolations();
        setSelectedResident('');
        setViolationName('');
        setViolationType('');
        setPenalty('');
        // Optionally, you can show a success toast message
        Toast.show({
          topOffset: 60,
          type: 'success',
          text1: 'Violation added successfully',
        });
      } catch (error) {
        console.error('Error adding Violation:', error);
        if (error.response) {
          console.error('Error details:', error.response.data);
        }
    
        // Optionally, you can show an error toast message
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Error adding Violation',
          text2: 'Please try again later',
        });
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => handleAdd()} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Student Violations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {violations.map((violation, index) => (
            <View key={index} style={styles.violationItem}>
              <Text style={styles.dateText}>{violation.violationDate}</Text>
              <Text style={styles.text}>Resident: {violation.residentName}</Text>
              <Text style={styles.text}>Violation Name: {violation.violationName}</Text>
              <Text style={styles.text}>Violation Type: {violation.violationType}</Text>
              <Text style={styles.text}>Violation Status: {violation.status}</Text>
            </View>
          ))}
        </View>
      )}

      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleAddModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>New Violation</Text>
            <DropDownPicker
                open={open}
                value={selectedResident}
                items={residentOptions.map(resident => ({ label: resident.name, value: resident.id }))}
                setOpen={setOpen}
                setValue={setSelectedResident}
                setItems={setItems}
            />
            <Input placeholder="Violation Name" value={violationName} onChangeText={setViolationName} />
            <Input placeholder="Violation Type" value={violationType} onChangeText={setViolationType} />
            <Input placeholder="Penalty" value={penalty} onChangeText={setPenalty} />
            <View>
              <Button title="Save" onPress={handleSaveAdd} color="green" />
              <Button title="Cancel" onPress={handleAddModalClose} color="red" />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  violationItem: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    width: 320,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative', 
  },
  text: {
    marginBottom: 5,
  },
  dateText: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 12,
    color: '#666', 
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: 16, // Adjust the bottom distance as needed
    left: 16, // Adjust the right distance as needed
  },

  addButton: {
    backgroundColor: 'blue',
    borderRadius: 50, // Make it a circle by setting borderRadius to half of the width and height
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonLabel: {
    color: 'white',
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
  },
});

export default Violations;
