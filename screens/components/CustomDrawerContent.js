import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGOUT_SUCCESS } from '../../redux/constants';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import url from '../../assets/common/url';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons'; 
// import {  } from 'react-redux';
const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
        // text2: "Please Login into your account",
      });
      navigation.navigate('DormXtend');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error if needed
    }
  };

  const user = useSelector((state) => state.auth);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffd3d3" }}>
      {/* Custom header with user image */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backgroundColor: "#d06262",
        }}
      >
        {user && user.user.user.img_path ? (
          <Image
          source={{ uri: `${url}${user.user.user.img_path}` }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        ) : (
          <Text>No Image</Text>
        )}
         <Text>{user.user.user.name}</Text>
      </View>

      {/* Drawer items */}
      {user && user.user.user.role == "Admin" ? (
      <TouchableOpacity
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate("DormXtend");
        }}
      >
        <Text>DormXtend</Text>
      </TouchableOpacity>
      ) : (
        <>
      <TouchableOpacity
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate("Announcements");
        }}
      >
        <Text>Announcement</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={{ padding: 16 }}
      onPress={() => {
        navigation.navigate("BillingPayment");
      }}
    >
      <Text>Billing</Text>
    </TouchableOpacity>
    <TouchableOpacity
    style={{ padding: 16 }}
    onPress={() => {
      navigation.navigate("LostItems");
    }}
  >
    <Text>Lost and Found</Text>
  </TouchableOpacity>
  <TouchableOpacity
  style={{ padding: 16 }}
  onPress={() => {
    navigation.navigate("Maintenance");
  }}
>
  <Text>Maintenance</Text>
</TouchableOpacity>
<TouchableOpacity
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate("Laundry");
        }}
      >
        <Text>Laundry Schedule</Text>
      </TouchableOpacity>
      </>
        )}
      <TouchableOpacity
        style={{ padding: 16 }}
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Text>Settings</Text>
      </TouchableOpacity>

      {/* Add other drawer items here */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#d06262',
        }}
      >
       <TouchableOpacity
          style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 10 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawerContent;
