import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button, TextInput, Modal, Image, ScrollView } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import * as ImagePicker from 'expo-image-picker';

import Toast from 'react-native-toast-message';

import Input from '../../shared/Form/Input';
import { fetchMaintenances } from '../../redux/actions/residentAction';
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from "react-native-dropdown-picker";

const MaintenanceList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation(); // Access the navigation object
    const { maintenances, loading, error } = useSelector((state) => state.maintenances);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
  
  
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [img_path, setImgPath] = useState("")
    const [type, setType] = useState("")
    const [description, setDescription] = useState("")
    // const [maintenancelists, setMaintenanceList] = useState([])

    const getAuthToken = async () => {
        return AsyncStorage.getItem('token');
    };

    useEffect(() => {
      dispatch(fetchMaintenances());
      maintenancelist()
      
    }, [dispatch]);
    console.log(maintenances)
    const handleAdd = () => {
      setAddModalVisible(true);
    };

    const handleAddModalClose = () => {
      setAddModalVisible(false);
    };

    const renderItem = ({ item }) => {
      let itemStyle;
  
      switch (item.status) {
          case 'DONE':
              itemStyle = styles.doneBackground;
              break;
          case 'IN PROGRESS':
              itemStyle = styles.inProgressBackground;
              break;
          case 'PENDING':
              itemStyle = styles.pendingBackground;
              break;
          default:
              itemStyle = styles.defaultBackground;
              break;
      }
  
      return (
          
          <TouchableOpacity
              style={[styles.card, itemStyle]}
              onPress={() => navigateToMaintenanceDetails(item)}
          >
              <View style={styles.paymentInfo}>
                  <Text style={styles.receiptText}>#{item.type}</Text>
              </View>
              {/* <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>Amount: ₱{item.cost}</Text>
              </View> */}
              <View style={styles.paidDateContainer}>
                  <Text style={styles.paidDateText}>{item.request_date}</Text>
              </View>
          </TouchableOpacity>
      );
  };
  

    const navigateToMaintenanceDetails = (maintenances) => {
        navigation.navigate('Maintenance Status', { maintenances });
    };

    const pickImage = async () => {
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
        if (!result.cancelled) {
          // Access the URI from the first item in the assets array
          const selectedUri = result.assets.length > 0 ? result.assets[0].uri : null;
          if (selectedUri) {
            setImgPath(selectedUri);
            console.log('Selected image URI:', selectedUri);
          } else {
            console.log('No image URI found in result.assets');
          }
        }
      } catch (error) {
        console.error('Error picking image:', error);
      }
    };
    
    
        const resetForm = () => {
        setType("");
        setDescription("");
        setImgPath("");
      };

    const handleSaveAdd = async () => {
        try {
          const token = await getAuthToken();
      
          const formData = new FormData();
            formData.append('type', type);
            formData.append('description', description);
            formData.append('img_path', {
            uri: img_path,
            type: 'image/jpeg', // Adjust the type based on your image format
            name: 'maintenance_image.jpg', // Adjust the name as needed
          });
          console.log(formData)
      
          const response = await axios.post(`${baseURL}/resident/createMaintenance`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
      
          // console.log('Maintenance requested successfully:', response.data);
      
          // Close the add modal and refresh the list of announcements
          handleAddModalClose();
          dispatch(fetchMaintenances());
          resetForm();
          // Optionally, you can show a success toast message
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'Maintenance requested successfully',
          });
        } catch (error) {
          console.error('Error Requesting Maintenance:', error);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
      
          // Optionally, you can show an error toast message
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Error Requesting Maintenance',
            text2: 'Please try again later',
          });
        }
      };
  
  const maintenancelist = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getMaintenanceList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dropdownItems = response.data.map((maintenance) => ({
        label: maintenance.name,
        value: maintenance.name,
    }));
    setItems(dropdownItems);
    } catch (error) {
      console.error('Error Requesting Maintenance:', error);

    }
  };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Maintenances</Text>
            <ScrollView>
                {loading ? (
                    <Text>Loading...</Text>
                ) : error ? (
                    <Text>{error}</Text>
                ) : maintenances.length === 0 ? (
                    <Text>No Requested Maintenances</Text>
                ) : (
                    <FlatList
                        data={maintenances}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                )}
            </ScrollView>
            <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => handleAdd()} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+</Text>
        </TouchableOpacity>
      </View>

       {/* Add Modal */}
       <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleAddModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5, width:300 }}>
            <Text>Request</Text>
            <View style={styles.pickerContainer}>
              <DropDownPicker
                open={open}
                value={type}
                items={items}
                setOpen={setOpen}
                setValue={setType}
                setItems={setItems}
              />
            </View>
            <Input label="Description" value={description} onChangeText={setDescription} />
           
            <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: img_path || 'https://example.com/default-image.jpg' }}
                    />
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.imagePicker}
                    >
                        <Icon style={{ color: "black" }} name="camera" />
                    </TouchableOpacity>
                </View>
            <View>
              <Button title="Save" onPress={handleSaveAdd} color="green" />
              <Button title="Cancel" onPress={handleAddModalClose} color="red" />
            </View>
          </View>
        </View>
      </Modal>
           
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
    color:'white'
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        width: 320,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    doneBackground: {
      backgroundColor: 'green',
    },
    inProgressBackground: {
      backgroundColor: 'orange',
    },
    pendingBackground: {
      backgroundColor: 'yellow',
    },
    defaultBackground: {
      backgroundColor: 'lightgray',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paidDateContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'transparent',
    },
    paidDateText: {
        fontSize: 12,
        color: '#555',
    },
    receiptText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    amountText: {
        fontWeight: 'bold',
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 16, 
        left: 16, 
      },
    
      addButton: {
        backgroundColor: 'blue',
        borderRadius: 50, // Make it a circle by setting borderRadius to half of the width and height
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      addButtonLabel: {
        color: 'white',
        fontSize: 24, // Adjust the font size as needed
        fontWeight: 'bold',
      },
      image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ccc', // Add a background color for better visibility
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },

    imagePicker: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
    },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 5,
      width: 300,
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
  },
  modalButton: {
      marginTop: 10,
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
  },
  modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  });


export default MaintenanceList;
