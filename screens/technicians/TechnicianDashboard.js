import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import UserCard from './UserCard';
import { useEffect } from 'react';
import { fetchMaintenances } from '../../redux/actions/residentAction';
import { useNavigation } from '@react-navigation/native';
const TechnicianDashboard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector((state) => state.auth.user);
  const { maintenances, loading, error } = useSelector((state) => state.maintenances);

  useEffect(() => {
    dispatch(fetchMaintenances());
  }, [dispatch]);

  const filteredMaintenances = maintenances.filter(maintenance => maintenance.technician_id === user.user.id);

  // Function to get background color based on maintenance status
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'IN PROGRESS':
        return 'yellow';
      case 'DONE':
        return 'green';
      default:
        return 'lightgray'; // Default color for other statuses
    }
  };

  const navigateToMaintenanceDetails = (maintenances) => {
    navigation.navigate('Maintenance Status', { maintenances });
};

  return (
    <View style={styles.container}>
      {user ? <UserCard user={user} /> : <Text>Loading...</Text>}
      <Text style={styles.header}>Maintenance</Text>
      
      <FlatList
        data={filteredMaintenances}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.maintenanceItem, { backgroundColor: getStatusColor(item.status) }]}
          onPress={() => navigateToMaintenanceDetails(item)}>
            <Text>Item: {item.itemName}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {item.request_date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white'
  },
  maintenanceItem: {
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    width: 320
  },
});

export default TechnicianDashboard;
