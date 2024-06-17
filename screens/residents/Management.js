import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useDispatch } from 'react-redux';
import { LOGOUT_SUCCESS } from '../../redux/constants/UserConstants';
import Toast from 'react-native-toast-message/lib';
const Management = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const ViewProfile = () => {
        navigation.navigate("Profile"); // Navigate to the Profile screen
    };

    const ViewSettings = () => {
        navigation.navigate("Settings"); // Navigate to the Settings screen
    };

    const ViewScanner = () => {
        navigation.navigate("Logs Scanner"); // Navigate to the Settings screen
    };

    const Complaints = () => {
      navigation.navigate("Complaints"); // Navigate to the Settings screen
  };

  const DormSleep = () => {
    navigation.navigate("Sleep"); // Navigate to the Settings screen
  };
    const handleLogout = async () => {
        try {
        await axios.post(`${baseURL}/signout`);
        // Dispatch the LOGOUT_SUCCESS action to update the user state
        dispatch({
            type: LOGOUT_SUCCESS,
        });
        // Remove the token from AsyncStorage
        await AsyncStorage.removeItem('token');
        // Navigate to the login screen
        Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Logout Successful",
            visibilityTime: 800,
        });
        navigation.navigate('DormXtend');
        } catch (error) {
        console.error('Error logging out:', error);
        // Handle error if needed
        }
    };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={ViewProfile} style={styles.card}>
        <Text>View Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={ViewSettings} style={styles.card}>
        <Text>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ViewScanner} style={styles.card}>
        <Text>LogsScanner</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={Complaints} style={styles.card}>
        <Text>Make A Complaint</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={DormSleep} style={styles.card}>
        <Text>Dormitory Sleep</Text>
      </TouchableOpacity>
      

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default Management;
