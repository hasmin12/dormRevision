import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Platform, Modal, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import baseURL from '../../assets/common/baseUrl';
import url from '../../assets/common/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import format from 'date-fns/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';

export default function LogsScanner() {
  const user = useSelector((state) => state.auth.user);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanningOutsideModal, setScanningOutsideModal] = useState(false); // New state
  const [qrData, setQrData] = useState('');
  const [purpose, setPurpose] = useState('');
  const [returnDate, setReturnDate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [id ,setId] = useState('');
  const [gatePass, setGatepass] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showScannerOutsideModal, setShowScannerOutsideModal] = useState(false);
  const today = format(new Date(),'yyyy-MM-dd');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
  
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA);
          if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
          }
        }
      }
      fetchLogs();
    })();
  }, []);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const outsideBarCodeScanned = async ({ type, data }) => {
    if (!scanningOutsideModal) return; 
    setScanningOutsideModal(false);
    console.log(data);
  
    if (data === 'https://dormxtend.online/DormLeave') {
      try {
        const formData = new FormData();
        formData.append("logId", id);
  
        const response = await axios.post(`${baseURL}/mobile/sendLogs/${user.user.id}`, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data' // Do not set this manually
          }
        });
        fetchLogs();
        setId('');
      } catch (error) {
        console.error('Error sending data to backend:', error);
        alert('Error sending data to backend. Check the console for more details.');
      }
    } else {
      alert('Invalid QR code scanned');
    }
  };
  
  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanning) return;
    setScanning(false);
    console.log(data);
  
    if (data === 'https://dormxtend.online/DormLeave') {
      try {
        const formData = new FormData();
        const formatDate = format(returnDate, 'yyyy-MM-dd');
        formData.append("purpose", purpose);
        formData.append("expectedReturn", formatDate);
        formData.append("gatePass", {
          name: "gatePass.jpg",
          type: "image/jpeg",
          uri: gatePass,
        });
  
        // No need to manually set Content-Type; Axios handles it
        const response = await axios.post(`${baseURL}/mobile/sendLogs/${user.user.id}`, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data' // Do not set this manually
          }
        });
  
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Data sent to the backend successfully!',
        });
        setIsModalVisible(false);
        setPurpose('');
        setGatepass('');
        fetchLogs(); // Fetch logs after sending data
      } catch (error) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // No response received
          console.error('Request data:', error.request);
        } else {
          // Other errors
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        alert('Failed to send data to the backend.');
      }
    } else {
      alert('Invalid QR code scanned');
    }
  };
  
  


  const pickGatepass = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      const selectedUri = result.assets.length > 0 ? result.assets[0].uri : null;
  
      if (!result.cancelled) {
        setGatepass(selectedUri);
      }
    } catch (error) {
      console.error('Error picking gate pass:', error);
    }
  };
  

  const fetchLogs = async () => {
    try {
      const token = await getAuthToken();
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

  const toggleScanner = () => {
    setScanning(!scanning); 
  };

  const handleLogClick = (logItem) => {
    console.log(today)
    setId(logItem.id)
    setScanningOutsideModal(true); // Change state for scanning outside modal
  };
  
  const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
            setReturnDate(selectedDate);
        }
    };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logs</Text>
        <Text style={styles.time}>{currentTime}</Text>
      </View>
     
<FlatList
  data={logs}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => {
    const isPast = today > item.expectedReturn;
    const isExpectedReturn = today >= item.expectedReturn;
    let isClickable;
    let backgroundColor;
    if (item.return_date) {
      backgroundColor = 'lightgreen';
      isClickable = false
    } else if (isExpectedReturn) {
      if(currentTime > '22:00'){
        backgroundColor = 'red';
        isClickable = false
      }else{
        backgroundColor = 'lightblue';
        isClickable = true
      }
    } else {
      backgroundColor = 'lightblue';
      isClickable = true

    }
    
    console.log(isClickable)
    return (
      <TouchableOpacity
        onPress={() => {
          if (isClickable) {
            handleLogClick(item);
          }
        }}
        disabled={!isClickable}
      >
        <Card style={[styles.card, { backgroundColor }]}>
          <Card.Content>
            <Title>{item.purpose}</Title>
            <Paragraph>{item.leave_date} - {item.return_date ? item.return_date : "Not Returned Yet"} </Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }}
/>



     
      {scanningOutsideModal && (
        <View style={styles.scannerOutsideModal}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setScanningOutsideModal(false)}>
          <MaterialCommunityIcons name="close" size={30} color="black" />
        </TouchableOpacity>
          <BarCodeScanner
            onBarCodeScanned={outsideBarCodeScanned}
            style={styles.scanner}
          />
        </View>
      )}

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter purpose"
              onChangeText={text => setPurpose(text)}
              value={purpose}
              editable={!scanning} 
            />

                <View>
                <View style={styles.inputWithIcon}>
                                <TextInput style={styles.dateField}
                                    placeholder="Birthdate"
                                    value={format(returnDate, 'yyyy-MM-dd')}
                                />
                                <Icon name="calendar" size={20} onPress={() => setShowDatePicker(true)} />
                            </View>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={returnDate}
                                    mode="date"
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={handleDateChange}
                                />
                            )}
                </View>
            <Text style={styles.label}>Gate Pass:</Text>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: gatePass || 'https://example.com/default-image.jpg' }}
              />
              <TouchableOpacity
                onPress={pickGatepass}
                style={styles.imagePicker}
              >
                <Icon style={{ color: "black" }} name="camera" />
              </TouchableOpacity>
              
            </View>
            {!scanning  && (
              <TouchableOpacity style={styles.button} onPress={toggleScanner}>
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>
            )}
      
            {scanning && (
              <TouchableOpacity style={styles.closeButton} onPress={toggleScanner}>
                <MaterialCommunityIcons name="close" size={30} color="black" />
              </TouchableOpacity>
            )}
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
        <View style={styles.scannerContainer}>
          {scanning && (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={styles.scanner}
            />
          )}
        </View>
      </Modal>
      
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>New Log</Text>
      </TouchableOpacity>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  card: {
    marginBottom: 10,
    elevation: 4,
    backgroundColor: 'lightblue'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: 800
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor: '#ccc', 
  },
  imagePicker: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1, 
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 1, 
    position: 'absolute',
    top: 100
  },
  scannerOutsideModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanner: {
    width: 500,
    height: 500,
  },
  dateField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 280,
},
inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
},
});
