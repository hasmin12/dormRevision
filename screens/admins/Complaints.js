import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchComplaints = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getComplaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setComplaints(response.data.complaints); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Complaints:', error.response); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Function to format the timestamp to display only month, day, and year
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.complaintItem}>
              <View style={styles.userInfo}>
                <FontAwesome name="user-circle" size={24} color="black" />
                <Text style={styles.complaintTitle}>{item.name}</Text>
              </View>
              <Text style={styles.complaintText}>{item.complaint}</Text>
              <View style={styles.timestampContainer}>
                {/* Call formatTimestamp function to display formatted timestamp */}
                <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  complaintItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  complaintTitle: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  complaintText: {
    marginLeft: 5,
  },
  timestampContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
});

export default Complaints;
