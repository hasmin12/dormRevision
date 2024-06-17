import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Logs = ({ user })  => {
  const [logs, setLogs] = useState([]);
  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await getAuthToken();
  
        const response = await axios.get(`${baseURL}/getLogs`,{
          headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { residentId: user.id },
      });
     
        setLogs(response.data);
        // console.log(logs)
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, [user]);
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>Purpose: {item.purpose}</Text>
            <Text>Leave Date: {item.leave_date}</Text>
            <Text>Return Date: {item.return_date || 'Not returned yet'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
export default Logs;
