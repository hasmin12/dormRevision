import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';

const Sleep = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [timeRemain, setTimeRemain] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseURL}/myLogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    updateRemainingTime(); 
    const timer = setInterval(updateRemainingTime, 1000); 
    fetchLogs();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const sleepLogToday = logs.find(log => log.name === 'Sleep' && log.dateLog === currentDate);

    if (currentHour >= 19 && currentHour <= 23) {
      setTimeRemain(false);
      if (sleepLogToday) {
        setShowGif(true);
        setShowScanner(false);
      } else {
        setShowGif(false);
        setShowScanner(true);
      }
    } else {
      setTimeRemain(true);
      setShowGif(false);
      setShowScanner(false);
    }
  }, [logs]);

  const updateRemainingTime = () => {
    const currentHour = new Date().getHours();
    const endHour = 23; 
    const endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0); // Set the end time to 11 PM
    if (currentHour >= 19 && currentHour <= 23) {
      setRemainingTime(null);
    } else {
      const timeDiff = endTime.getTime() - Date.now();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setRemainingTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  };

  const handleBarCodeScanned = async () => {
    setScanned(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseURL}/sendSleep`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLogs();
      setShowScanner(false);
      alert('Data sent to backend successfully!');
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert('Error sending data to backend');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {showGif && (
        <Image source={require('../../assets/sleep.gif')} style={styles.gif} />
      )}
      {showScanner && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
        />
      )}
      {timeRemain && (
        <Text style={styles.remainingTime}>Time remaining: {remainingTime}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 200,
    height: 200,
  },
  remainingTime: {
    fontSize: 18,
    marginBottom: 10,
  },
  scanner: {
    width: 500,
    height: 500,
  },
});

export default Sleep;
