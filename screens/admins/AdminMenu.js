import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { LOGOUT_SUCCESS } from '../../redux/constants';
const AdminMenu = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const AccountInformation = () => {
    navigation.navigate("Account Information"); 
  };

  const Settings = () => {
    navigation.navigate("Settings"); 
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
    }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={AccountInformation} style={styles.card}>
        <Text>Account Information</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={Settings} style={styles.card}>
        <Text>Settings</Text>
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

export default AdminMenu;
