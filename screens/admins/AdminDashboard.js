import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import DropDownPicker from "react-native-dropdown-picker";
import baseURL from '../../assets/common/baseUrl';

const AdminDashboard = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Both", value: "" },
    { label: "Dormitory", value: "Dormitory" },
    { label: "Hostel", value: "Hostel" },
  ]);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAuthToken();
        const response = await axios.get(`${baseURL}/getDashboardData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { branch: selectedBranch },
        });
    
        if (response.status === 200) {
          const data = response.data;
          setDashboardData(data);
        } else {
          console.error('Error fetching dashboard data:', response);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [selectedBranch]); 

  const quickStats = [
    { title: 'Total Residents', value: dashboardData?.totalResidents, targetScreen: 'Resident Chart' },
    { title: 'Total Rooms', value: dashboardData?.totalRooms, targetScreen: 'Rooms' },
    { title: 'Maintenance Requests', value: dashboardData?.totalBeds, targetScreen: 'Maintenances' },
    { title: 'Lost Items', value: dashboardData?.lostItems, targetScreen: 'LostItems' },
    { title: 'Violations', value: dashboardData?.paidResidents, targetScreen: 'ViolationList' },
    { title: 'Visit Request', value: dashboardData?.unpaidResidents, targetScreen: 'VisitRequestList' },
    { title: 'Month Income', value: dashboardData?.monthIncome, targetScreen: 'MonthIncomeList' },
    { title: 'Total Income', value: dashboardData?.totalIncome, targetScreen: 'TotalIncomeList' },
  ];

  const statCardColors1 = ['#ffd3d3', '#d3d3ff', '#d3ffd3', '#ffffcc'];
  const statCardColors2 = ['#ffc0cb', '#c0c0c0', '#ffb6c1', '#a9a9a9'];

  const handleCardPress = (targetScreen) => {
    navigation.navigate(targetScreen);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={selectedBranch}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedBranch}
          setItems={setItems}
        />
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statsColumn}>
          {quickStats.slice(0, 4).map((stat, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(stat.targetScreen)}>
              <View style={[styles.statCard, { backgroundColor: statCardColors1[index % statCardColors1.length] }]}>
                <Text style={styles.cardTitle}>{stat.title}</Text>
                <Text style={styles.cardText}>{stat.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.statsColumn}>
          {quickStats.slice(4).map((stat, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(stat.targetScreen)}>
              <View style={[styles.statCard, { backgroundColor: statCardColors2[index % statCardColors2.length] }]}>
                <Text style={styles.cardTitle}>{stat.title}</Text>
                <Text style={styles.cardText}>{stat.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

   
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', 
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statCard: {
    height: 100,
    width: 150,
    backgroundColor: '#ffd3d3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center', 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default AdminDashboard;
