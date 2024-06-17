import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../assets/common/baseUrl';

const ReservationHistory = ({ user })  => {
  const [ReservationHistory, setReservationHistory] = useState([]);
  // const resident = route.params;

  useEffect(() => {
    const fetchReservationHistory = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const response = await axios.get(`${baseURL}/getReservationHistory`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          params: { residentId: user.id },
        });
        setReservationHistory(response.data.reservations);
        console.log('Reservations Fetched', response.data.reservations);
      } catch (error) {
        console.error('Error fetching Reservations history:', error);
      }
    };

    fetchReservationHistory();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.ReservationHistoryTitle}>Reservations</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
        <Text style={[styles.header]}>Room</Text>
          {/* <Text style={styles.header}>Check-In</Text> */}
          <Text style={styles.header}>Check-In</Text>
          <Text style={styles.header}>Check-Out</Text>
          <Text style={styles.header}>Status</Text>
        </View>
        {/* Table Body */}
        {ReservationHistory.map((reservation, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={[styles.cell, { flex: 2 }]}>{reservation.room_id}</Text>
            <Text style={styles.cell}>{reservation.checkin_date}</Text>
            <Text style={styles.cell}>{reservation.checkout_date}</Text>
            <Text style={styles.cell}>{reservation.status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  residentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  residentDetails: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ReservationHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  header: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ReservationHistory;
