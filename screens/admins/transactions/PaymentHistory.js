import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../assets/common/baseUrl';

const PaymentHistory = ({ user })  => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  // const resident = route.params;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const response = await axios.get(`${baseURL}/getPaymentHistory`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
          params: { residentId: user.id },
        });
        setPaymentHistory(response.data.payment_history);
        console.log('Payments Fetched', response.data.payment_history);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, [user]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.residentCard}>
        <Image
          source={{ uri: user.img_path }}
          style={styles.residentImage}
        />
        <View style={styles.residentDetails}>
          <Text style={styles.title}>{user.name}</Text>
          <Text>{user.Tuptnum}</Text>
        </View>
      </View> */}
      <Text style={styles.paymentHistoryTitle}>Payment History</Text>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
        <Text style={[styles.header]}>Payment</Text>
          <Text style={styles.header}>Receipt</Text>
          <Text style={styles.header}>Amount</Text>
          <Text style={styles.header}>Status</Text>
        </View>
        {/* Table Body */}
        {paymentHistory.map((payment, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.cell}>{payment.payment_month}</Text>
            <Text style={styles.cell}>{payment.receipt}</Text>
            <Text style={styles.cell}>{payment.totalAmount}</Text>
            <Text style={styles.cell}>{payment.status}</Text>
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
  paymentHistoryTitle: {
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

export default PaymentHistory;
