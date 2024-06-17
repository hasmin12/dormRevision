import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Applicants from '../admins/Applicants';

const Management = () => {
  const navigation = useNavigation();

  const ResidentsList = () => {
    navigation.navigate("Residents"); // Navigate to the Residents screen
  };

  const RoomsList = () => {
    navigation.navigate("Rooms"); // Navigate to the Rooms screen
  };
  
  const RepairMansList = () => {
    navigation.navigate("RepairmanList"); // Navigate to the RepairMen screen
  };

  const AnnouncementsList = () => {
    navigation.navigate("Announcements"); // Navigate to the Announcements screen
  };

  const PaymentsList = () => {
    navigation.navigate("Payments"); // Navigate to the Payments screen
  };

  const LostAndFoundList = () => {
    navigation.navigate("LostItems"); // Navigate to the LostItems screen
  };

  const LaundryList = () => {
    navigation.navigate("Laundry"); // Navigate to the Laundry screen
  };

  const VisitorsList = () => {
    navigation.navigate("Visitors"); // Navigate to the Visitors screen
  };
  const ViolationList = () => {
    navigation.navigate("Violations"); // Navigate to the Visitors screen
  };
  const ComplaintsList = () => {
    navigation.navigate("Complaints"); // Navigate to the Visitors screen
  };

  const Applicants = () => {
    navigation.navigate("Applicants"); // Navigate to the Visitors screen
  };

  const Logs = () => {
    navigation.navigate("Logs"); // Navigate to the Visitors screen
  };

  const SleepLogs = () => {
    navigation.navigate("Attendance"); // Navigate to the Visitors screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={ResidentsList} style={styles.card}>
        <Text>Residents</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={Applicants} style={styles.card}>
        <Text>Applicants</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={RoomsList} style={styles.card}>
        <Text>Rooms</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={RepairMansList} style={styles.card}>
        <Text>Repair Men</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={AnnouncementsList} style={styles.card}>
        <Text>Announcements</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={PaymentsList} style={styles.card}>
        <Text>Payments</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={LostAndFoundList} style={styles.card}>
        <Text>Lost And Found</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={LaundryList} style={styles.card}>
        <Text>Laundry</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={Logs} style={styles.card}>
        <Text>Logs</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={VisitorsList} style={styles.card}>
        <Text>Visitors</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ViolationList} style={styles.card}>
        <Text>Violations</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={ComplaintsList} style={styles.card}>
        <Text>Complaints</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={SleepLogs} style={styles.card}>
        <Text>Sleep Logs</Text>
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
});

export default Management;
