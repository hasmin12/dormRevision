import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import UserCard from '../components/UserCard';
import PaymentHistory from './PaymentHistory';
import ReservationHistory from './ReservationHistory';
import ImagePicker from 'react-native-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const ResidentDashboard = () => {
  const user = useSelector((state) => state.auth.user);

  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [contractFile, setContractFile] = useState(null);

  const openContractModal = () => {
    setContractModalVisible(true);
  };

  const closeContractModal = () => {
    setContractModalVisible(false);
  };

  const handleFileUpload = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${baseURL}/passContract`, { contract: contractFile, residentId: user.user.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setContractModalVisible(false);
    } catch (error) {
      console.error('Error pass contract:', error);
    }
  };

  const pickContractFile = async () => {
    try {
        const options = {
            title: 'Select Contract File',
            mediaType: 'mixed',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };

        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled picking contract file');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                const selectedAsset = response.assets[0];
                setContractFile(selectedAsset);
            }
        });
    } catch (error) {
        console.error('Error picking contract file:', error);
    }
};

  console.log(user.user.contract)
  return (
    <ScrollView style={styles.container}>
      {user ? <UserCard user={user} /> : <Text>Loading...</Text>}
      {user.user.branch  == "Dormitory" ? (
        <View>
          <Text style={styles.header}>Payment History</Text>
          <PaymentHistory />
          
        </View>
      ) : (
        <ReservationHistory />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },

  contractContainer: {
    padding: 20,
    margin: 10,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },

  messageContract: {
    fontSize: 16,
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ResidentDashboard;
