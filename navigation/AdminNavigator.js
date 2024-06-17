import React, { useState, useEffect } from 'react';

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, TouchableOpacity } from "react-native";
import AdminDashboard from "../screens/admins/AdminDashboard";
import ResidentsList from "../screens/admins/ResidentsList";
import RoomsList from "../screens/admins/RoomsList";
import Management from "../screens/components/Management";
import NotificationsList from "../screens/admins/NotificationsList";
import { FontAwesome } from '@expo/vector-icons'; 
import BedList from "../screens/admins/BedsListss";
import { useNavigation, useRoute } from "@react-navigation/native";
import AnnouncementsList from "../screens/admins/AnnouncementsList";
import AnnouncementDetails from '../screens/admins/AnnouncementDetails';
import LostItemList from "../screens/admins/LostItemList";
import Laundry from "../screens/admins/Laundry";
import TechnicianList from "../screens/admins/TechnicianList";
import PaymentHistory from "../screens/admins/transactions/PaymentHistory";
import Violations from '../screens/admins/Violations';
import Logs from '../screens/admins/Logs';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../screens/components/CustomDrawerContent";
import Complaints from "../screens/admins/Complaints";
import Applicants from '../screens/admins/Applicants';
import AdminMenu from "../screens/admins/AdminMenu"
import { fetchNotifications } from "../redux/actions/notificationAction";
import { useDispatch, useSelector } from "react-redux";
//chart
import ResidentChart from '../screens/admins/charts/ResidentChart';
// import ResidentTransactions from '../screens/admins/ResidentTransactions';
import ResidentDetails from '../screens/admins/ResidentDetails';
import Equipment from '../screens/admins/Equipment';
import Attendance from '../screens/admins/Attendance';
import Payments from "../screens/admins/Payments";
import PaymentDetails from "../screens/admins/Payments";
import VisitorsList from '../screens/admins/VisitorsList';
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
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
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Notifications") {
            iconName = focused ? "bell" : "bell";
          } else if (route.name === "Management") {
            iconName = focused ? "cogs" : "cogs";
          } else if (route.name === "Menu") {
            iconName = focused ? "bars" : "bars";
          }

          return <Icon name={iconName} size={20} color={"#ff4d4d"} />;
        },
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Management" component={Management} />
      <Tab.Screen name="Menu" component={AdminMenu} />

    </Tab.Navigator>
  );
};

const AdminNavigator = () => {
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchNotifications());
    }, [dispatch]);
 
  return (
    
    <Stack.Navigator>
        {/* <Stack.Screen
          name="AdminDrawer"
          component={AdminDrawer}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => <HeaderBellIcon navigation={navigation} notificationCount={notificationCount} />,
          })}
        /> */}
      <Stack.Screen name="Admin" component={AdminTabs}
      options={({ navigation }) => ({
        headerShown: true,
        headerRight: () => <HeaderBellIcon navigation={navigation} notificationCount={notifications.length} />,
      })} />
      <Stack.Screen name="Residents" component={ResidentsList} />
      <Stack.Screen name="Rooms" component={RoomsList} />
      <Stack.Screen name="Room Details" component={BedList} />

      <Stack.Screen name="Announcements" component={AnnouncementsList} />
      <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails} />
      <Stack.Screen name="Visitors" component={VisitorsList} />
      <Stack.Screen name="Attendance" component={Attendance} />


      <Stack.Screen name="LostItems" component={LostItemList} />
      <Stack.Screen name="Laundry" component={Laundry} />
      <Stack.Screen name="Payments" component={Payments} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetails} />

      <Stack.Screen name="Complaints" component={Complaints} />
      <Stack.Screen name="Notifications" component={NotificationsList} />
      <Stack.Screen name="Violations" component={Violations} />
      <Stack.Screen name="Applicants" component={Applicants} />
      {/* <Stack.Screen name="Logs" component={Logs} /> */}
      <Stack.Screen name="Resident Details" component={ResidentDetails} />
      <Stack.Screen name="Equipment" component={Equipment} />


      <Stack.Screen name="Resident Chart" component={ResidentChart} />

    </Stack.Navigator>
  );
};


// const AdminDrawer = () => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         drawerStyle: {
//           backgroundColor: '#ffd3d3',
//           width: 240,
//           marginTop:35
//         },
//         // drawerPosition: "left",
//       }}
//       drawerContent={(props) => (
//         <CustomDrawerContent/>
//       )}
//     >
//       <Drawer.Screen name="Admin" component={AdminTabs} />
//     </Drawer.Navigator>
//   );
// };



  export default AdminNavigator;
