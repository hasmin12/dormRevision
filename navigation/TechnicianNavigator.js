import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, TouchableOpacity } from 'react-native';

import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MaintenanceList from "../screens/technicians/MaintenanceList";
import MaintenanceStatus from "../screens/technicians/MaintenanceStatus";
import TechnicianDashboard from "../screens/technicians/TechnicianDashboard";
import Management from "../screens/technicians/Management";
import AcceptMaintenance from "../screens/technicians/AcceptMaintenance";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();


// Custom header component to display the bell icon
const HeaderBellIcon = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => navigation.navigate('Notifications')}
    >
      <Icon name="bell" size={20} color={"#ff4d4d"} />
    </TouchableOpacity>
  );
};

const TechnicianTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell";
          } else if (route.name === "Maintenance") {
            iconName = focused ? "wrench" : "wrench";
          } else if (route.name === "Announcement") {
            iconName = focused ? "bullhorn" : "bullhorn";
          } else if (route.name === "LostItem") {
            iconName = focused ? "search" : "search";
          } else if (route.name === "Laundry") {
            iconName = focused ? "calendar" : "calendar";
          } else{
            iconName = focused ? "navicon" : "navicon";
          }
          

          return <Icon name={iconName} size={20} color={"#ff4d4d"} />;
        },
        // tabBarLabel: Hidden,
      })}
    >
 
      <Tab.Screen name="Dashboard" component={TechnicianDashboard} />
      <Tab.Screen name="Maintenance" component={MaintenanceList} />
      <Tab.Screen name="Management" component={Management} />



    </Tab.Navigator>
  );
};

const TechnicianNavigator = () => {
  return (
    
    <Stack.Navigator>
        <Stack.Screen
          name="DormXtend"
          component={TechnicianTabs}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => <HeaderBellIcon navigation={navigation} />,
          })}
        />


        <Stack.Screen name="Maintenance Status" component={MaintenanceStatus} />
        <Stack.Screen name="Accept Maintenance" component={AcceptMaintenance} />



    </Stack.Navigator>
  );
};





export default TechnicianNavigator;
