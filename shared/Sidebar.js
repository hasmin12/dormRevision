import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ResidentDashboard from '../screens/residents/ResidentDashboard';

const Drawer = createDrawerNavigator();

function Sidebar() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="ResidentDashboard">
      
      
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Sidebar;
