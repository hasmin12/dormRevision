import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
// import ModalDropdown from 'react-native-modal-dropdown'; // Import ModalDropdown library
import Input from '../../shared/Form/Input';
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {launchImageLibrary} from "react-native-image-picker";
import Toast from 'react-native-toast-message';
import url from '../../assets/common/url';
const LostItemList = () => {

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [lostItems, setLostItems] = useState([]);

  const [itemName, setItemName] = useState("");
  const [dateLost, setDateLost] = useState(new Date());
  const [locationLost, setLocationLost] = useState("");
  const [findersName, setFindersName] = useState("");
  const [img_path, setImgPath] = useState("");
  const [Id, setId] = useState("");



  
//   const [residents, setResidents] = useState([]);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchLostItems = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getLostitems`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLostItems(response.data.lostitems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lostItems:', error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const handleEdit = (LostItem) => {
   
    setItemName(LostItem.itemName);
    setDateLost(new Date(LostItem.dateLost));
    setLocationLost(LostItem.locationLost);
    setFindersName(LostItem.findersName);
    setImgPath(`${url}${LostItem.img_path}`);
    setId(LostItem.id);
    setEditModalVisible(true);
  };
  const resetForm = () => {
    setItemName("");
    setDateLost(new Date());
    setLocationLost("");
    setFindersName("");
    setImgPath("");

  };
  const handleAddItem = async () => {
    try {
        const token = await getAuthToken();
        const formData = new FormData();
        console.log(dateLost);
        const formatDateLost = format(dateLost, 'yyyy-MM-dd');
        console.log(formatDateLost);

        formData.append('itemName', itemName);
        formData.append('dateLost', formatDateLost);
        formData.append('locationLost', locationLost);
        formData.append('findersName', findersName);

        formData.append('img_path', {
          uri: img_path,
          type: 'image/jpeg', // Adjust the type based on your image format
          name: 'lostItem.jpg', // Adjust the name as needed
        });
        
    
        // Assuming your API endpoint for adding an lostItem is /lostItem
        const response = await axios.post(`${baseURL}/lostitem`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
    
        console.log('lostItem added successfully:', response.data);
    
        // Close the add modal and refresh the list of lostItems
        handleAddModalClose();
        fetchLostItems();
        resetForm();
        // Optionally, you can show a success toast message
        Toast.show({
          topOffset: 60,
          type: 'success',
          text1: 'lostItem added successfully',
        });
      } catch (error) {
        console.error('Error adding lostItem:', error);
        if (error.response) {
          console.error('Error details:', error.response.data);
        }
    
        // Optionally, you can show an error toast message
        Toast.show({
          topOffset: 60,
          type: 'error',
          text1: 'Error adding lostItem',
          text2: 'Please try again later',
        });
      }
    };
  
    const handleSaveEdit = async () => {
        try {
          const token = await getAuthToken();
          const formData = new FormData();
    
          // Append edited data to the formData
          formData.append('itemName', itemName);
          // formData.append('dateLost', format(dateLost, 'yyyy-MM-dd'));
          formData.append('locationLost', locationLost);
          formData.append('findersName', findersName);
    
          // Check if a new image is selected for editing
         
            formData.append('img_path', {
              uri: img_path,
              type: 'image/jpeg',
              name: 'lostItem.jpg',
            });
      
    
          // Assuming your API endpoint for updating a lostItem is /lostitem/:id
          const response = await axios.post(`${baseURL}/updateLostitem/${Id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('lostItem updated successfully:', response.data);
    
          // Close the edit modal and refresh the list of lostItems
          setEditModalVisible(false);
          fetchLostItems();
          resetForm();
    
          // Optionally, you can show a success toast message
          Toast.show({
            topOffset: 60,
            type: 'success',
            text1: 'lostItem updated successfully',
          });
        } catch (error) {
          console.error('Error updating lostItem:', error);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
    
          // Optionally, you can show an error toast message
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Error updating lostItem',
            text2: 'Please try again later',
          });
        }
      };

  const handleAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.card}>
          <Image style={styles.image}
            source={{ uri: `${url}${item.img_path}` || 'https://example.com/default-image.jpg' }}
            />
          <Text style={styles.bedTitle}> {item.itemName}</Text>
          <Text>{item.status}</Text>
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => handleEdit(item)}
          >
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
  );

  const pickImage = async () => {
      launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        setImgPath(response.uri);
      }
    });
  };

const handleAddModalClose = () => {
    // Close the add modal
    setModalVisible(false);
  };
  const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
            setDateLost(selectedDate);
        }
    };
  return (
    <View style={{ flex: 1 }}>
   
        <FlatList
          data={lostItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
        //   contentContainerStyle={styles.container}
        />
      

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonLabel}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleAddModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>Add lostItems</Text>
          
          {/* Your form components */}
        <Input label="Item Name" placeholder="Item Name" value={itemName} onChangeText={setItemName} />
        {/* <View>
                <Input
                    placeholder="Select Date"
                    value={format(dateLost, 'yyyy-MM-dd')} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={dateLost}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View> */}
        <Input label="Location Lost" placeholder="Location Lost" value={locationLost} onChangeText={setLocationLost} />
        <Input label="Finder's Name" placeholder="Finder's Name" value={findersName} onChangeText={setFindersName} />
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
          {/* Add similar Input components for other fields */}
          
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleAddItem}>
            <Text style={{ color: 'white' }}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={{ color: 'white' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
        </View>

      </Modal>

      {/* Edit Modal */}
    <Modal
    visible={editModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setEditModalVisible(false)}
  >
    {/* ... (your modal styling) */}
    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
      <Text>Edit LostItem</Text>
  
      <Input label="Item Name" placeholder="Item Name" value={itemName} onChangeText={setItemName} />
      <View>
                <Input
                    placeholder="Select Date"
                    value={format(dateLost, 'yyyy-MM-dd')} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={dateLost}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View>
                <Input label="Location Lost" placeholder="Location Lost" value={locationLost} onChangeText={setLocationLost} />
                <Input label="Finder's Name" placeholder="Finder's Name" value={findersName} onChangeText={setFindersName} />
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
      <TouchableOpacity style={styles.modalCloseButton} onPress={handleSaveEdit}>
        <Text style={{ color: 'white' }}>Update Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalCloseButton} onPress={() => setEditModalVisible(false)}>
        <Text style={{ color: 'white' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      card: {
        width: '48%',  // Adjust the width as needed
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        margin: 4,
        justifyContent: 'center',

      },
      LostItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
      },
      image: {
        width: 130,  // Adjust the width as needed
        height: 130, // Adjust the height as needed
        borderRadius: 75, // To make it a circular image
        backgroundColor: '#ccc', // Add a background color for better visibility
      },
      imagePicker: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
      },
  assignButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  residentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCloseButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
   
  },

  addButton: {
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 50,
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonLabel: {
    color: 'white',
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
  },
//   imageContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
// },
// image: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: '#ccc', // Add a background color for better visibility
// },
// imagePicker: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 20,
// },
itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default LostItemList;
