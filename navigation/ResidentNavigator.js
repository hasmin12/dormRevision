import React, { useState,useEffect } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, TouchableOpacity } from 'react-native';
import ResidentDashboard from "../screens/residents/ResidentDashboard";
import BillingPayment from "../screens/residents/BillingPayment";
import Announcement from "../screens/residents/Announcement";
import LostItem from "../screens/residents/LostItem";
import Laundry from "../screens/residents/Laundry";
import CustomDrawerContent from "../screens/components/CustomDrawerContent";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PaymentDetails from "../screens/residents/PaymentDetails";
import Management from "../screens/residents/Management";
import LogsScanner from "../screens/residents/LogsScanner";
import MaintenanceList from "../screens/residents/MaintenanceList";
import MaintenanceStatus from "../screens/residents/MaintenanceStatus";
import Complaints from "../screens/residents/Complaints";
// import NotificationsList from "../screens/residents/NotificationsList";
import Notifications from "../screens/users/Notifications";
import Equipment from "../screens/residents/Equipment";
import Sleep from "../screens/residents/Sleep";
import { fetchNotifications } from "../redux/actions/notificationAction";
import { useDispatch, useSelector } from "react-redux";
import AnnouncementDetails from "../screens/residents/AnnouncementDetails";
import ReservationDetails from "../screens/residents/ReservationDetails";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const HeaderBellIcon = ({ navigation, notificationCount }) => {
  return (
    <TouchableOpacity
      style={{ marginRight: 10 }}
      onPress={() => navigation.navigate('Notifications')}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="bell" size={20} color={"#ff4d4d"} />
        {notificationCount > 0 && (
          <View style={{ backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2, marginLeft: 5 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>{notificationCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ResidentTabs = () => {
  const user = useSelector((state) => state.auth.user);

  const hasContract = user.user.status=="Active" || user.user.status=="Checked-In";

  if (hasContract) {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Maintenance') {
              iconName = focused ? 'wrench' : 'wrench';
            } else if (route.name === 'Announcement') {
              iconName = focused ? 'bullhorn' : 'bullhorn';
            } else if (route.name === 'LostItem') {
              iconName = focused ? 'search' : 'search';
            } else if (route.name === 'Laundry') {
              iconName = focused ? 'calendar' : 'calendar';
            } else {
              iconName = focused ? 'navicon' : 'navicon';
            }

            return <Icon name={iconName} size={20} color={'#ff4d4d'} />;
          },
        })}
        tabBarOptions={{
          showLabel: false, // hide tab bar labels
        }}
      >
        <Tab.Screen name="Dashboard" component={ResidentDashboard} />
        <Tab.Screen name="Maintenance" component={MaintenanceList} />
        <Tab.Screen name="Announcement" component={Announcement} />
        <Tab.Screen name="LostItem" component={LostItem} />
        <Tab.Screen name="Laundry" component={Laundry} />
        <Tab.Screen name="Management" component={Management} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Maintenance') {
              iconName = focused ? 'wrench' : 'wrench';
            } else if (route.name === 'Announcement') {
              iconName = focused ? 'bullhorn' : 'bullhorn';
            } else if (route.name === 'LostItem') {
              iconName = focused ? 'search' : 'search';
            } else if (route.name === 'Laundry') {
              iconName = focused ? 'calendar' : 'calendar';
            } else {
              iconName = focused ? 'navicon' : 'navicon';
            }

            return <Icon name={iconName} size={20} color={'#ff4d4d'} />;
          },
        
        })}
      >
        <Tab.Screen name="Dashboard" component={ResidentDashboard} />
        <Tab.Screen name="Management" component={Management} />
        
      </Tab.Navigator>
    );
  }
};

const ResidentNavigator = () => {
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchNotifications());
    }, [dispatch]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DormXtend"
        component={ResidentTabs}
        options={({ navigation }) => ({
          headerShown: true,
          headerRight: () => <HeaderBellIcon navigation={navigation} notificationCount={notifications.length} />,
        })}
      />
      <Stack.Screen name="BillingPayment" component={BillingPayment} />
      <Stack.Screen name="Maintenance Status" component={MaintenanceStatus} />
      <Stack.Screen name="Payment Details" component={PaymentDetails} />
      <Stack.Screen name="Billing" component={BillingPayment} />
      <Stack.Screen name="Logs Scanner" component={LogsScanner} />
      <Stack.Screen name="Complaints" component={Complaints} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Equipment" component={Equipment} />
      <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails} />
      <Stack.Screen name="Sleep" component={Sleep} />
      <Stack.Screen name="Reservation Details" component={ReservationDetails} />

      

    </Stack.Navigator>
  );
};

export default ResidentNavigator;
