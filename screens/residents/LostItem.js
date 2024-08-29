import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LostItem = () => {
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {

        const response = await axios.get(`${baseURL}/mobile/getLostitems`);
        setLostItems(response.data.lostitems);
      } catch (error) {
        console.error('Error fetching Lost Items:', error);
      }
    };

    fetchLostItems();
  }, []);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lost and Found</Text>
      <FlatList
        data={lostItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.itemName}</Text>
            <Text>Date Lost: {item.dateLost}</Text>
            <Text>Location Lost: {item.locationLost}</Text>
            <Text>Finder's Name: {item.findersName}</Text>
            <Text>Status: {item.status}</Text>
            {item.img_path && (
              <Image
                source={{ uri: `http://192.168.100.18:8000${item.img_path}` }}
                style={styles.itemImage}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default LostItem;
