import React from "react";
import { useSelector } from "react-redux";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/users/HomeScreen";
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, TouchableOpacity } from "react-native";
import DormitoryLogin from '../screens/users/DormitoryLogin';
import DormitoryRegister from '../screens/users/DormitoryRegister';
import HostelRooms from "../screens/users/HostelRooms";
import HostelRoomDetails from "../screens/users/HostelRoomDetails";
import SignUpScreen from "../screens/users/SignUpScreen";

import Visitor from "../screens/users/Visitor";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const UserNavigator = (props) => {
  const user = useSelector((state) => state.auth);

  const UserTabs = () => {
    return (
      <Tab.Navigator
        initialRouteName="Login"
        gestureEnabled={true} 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Login") {
              iconName = "user-check"
            } else if (route.name === "Hostel Rooms") {
              iconName = "hotel"
            } else if (route.name === "Dormitory Signup") {
              iconName = "school";
            }
               return <FontAwesome6 name={iconName} size={20} color={focused ? "#ff4d4d" : "gray"} />    
          },
          // tabBarLabel: Hidden,
        })}
        // tabBarOptions={{
        //   activeTintColor: "#ff4d4d", // Color for the active tab
        //   inactiveTintColor: "gray", // Color for inactive tabs
        // }}
      >
        <Tab.Screen name="Hostel Rooms" component={HostelRooms}
        options={{
          title: 'Hostel Rooms',
       
        }} />
        <Tab.Screen name="Login" component={DormitoryLogin} />
        {/* <Tab.Screen name="Dormitory Register" component={DormitoryRegister} /> */}
        <Tab.Screen name="Dormitory Signup" component={SignUpScreen} />

      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator initialRouteName="DormXtend" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DormXtend" component={HomeScreen} />
      <Stack.Screen name="Dormitory" component={UserTabs} />
      <Stack.Screen
        name="HostelRoomDetails"
        component={HostelRoomDetails}
        options={({ route }) => ({
          title: route.params.room.name, 
          headerShown: true, 
        })}
      />
      <Stack.Screen name="Visitor" component={Visitor}
      options={({ route }) => ({
        // title: route.params.room.name, 
        headerShown: true, 
      })} />

    </Stack.Navigator>
  );
}

export default UserNavigator;
