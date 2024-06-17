import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const RoomsList = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchRooms = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getRooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(response.data.rooms); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error.response); 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [isFocused]);

  const handleCheck = (room) => {
    navigation.navigate('Room', { roomId: room.id });
  };

  const handleDelete = async (roomId) => {
    try {
      Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this room?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const token = await getAuthToken();
              await axios.delete(`${baseURL}/deleteRoom/${roomId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchRooms();
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Room deleted successfully",
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error deleting room:', error.response);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <Table>
          <Row data={['Rooms', 'Slot', 'Type','Category']} style={styles.head} textStyle={styles.text} />
          {rooms.map((room, index) => (
            <View key={room.id}>
               <TouchableOpacity key={room.id} onPress={() => handleCheck(room)}>
              <Row
                data={[`${room.name}`, `${room.occupiedBeds}/${room.totalBeds}`,`${room.type}`,`${room.category}` ]}
                textStyle={styles.text}
                style={index === rooms.length - 1 ? styles.lastRow : styles.rowStyle} 
              />
              </TouchableOpacity>
              {index !== rooms.length - 1 && <View style={styles.divider} />} 
            </View>
          ))}
        </Table>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  rowStyle: { height: 60, borderBottomWidth: 1, borderColor: '#ccc' }, // Add border to each row
  lastRow: { height: 60 }, // Adjust the height of the last row if needed
  divider: { borderBottomWidth: 1, borderColor: '#ccc' } // Style for the divider between rows
});

export default RoomsList;
