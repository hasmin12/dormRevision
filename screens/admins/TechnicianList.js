import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, Alert, Modal, TextInput,StyleSheet, Image,ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import Input from '../../shared/Form/Input';
import {launchImageLibrary} from 'react-native-image-picker';

import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { updateMaintenanceMan } from '../../redux/actions/adminAction';
import { useDispatch } from 'react-redux';
import url from '../../assets/common/url';
import Icon from "react-native-vector-icons/FontAwesome";
const TechnicianList = () => {
  const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
    
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
    };
    const [Id, setId] = useState('');

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [sex, setSex] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [img_path, setImgPath] = useState(''); 
    const [contacts, setContacts] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());

  const [repairMan, setMaintenanceMan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMaintenanceMan, setSelectedMaintenanceMan] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  // const itemsPerPage = 10;

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };
  const fetchMaintenancemen = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getTechnician`, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setMaintenanceMan(response.data); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Maintenance Man:', error.response); 
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMaintenancemen();
  }, []);


  const handleEdit = (repairMan) => {
 
    setId(repairMan.id);
    setEmail(repairMan.email);
    setPassword(repairMan.password);
    setName(repairMan.name);
    setAddress(repairMan.address);
    setSex(repairMan.sex);
    setContacts(repairMan.contacts);
    setBirthdate(new Date(repairMan.birthdate));
    setImgPath(`${url}${repairMan.img_path}`);
// console.log(`${url}${repairMan.img_path}`);
    setEditModalVisible(true);
  };

  const handleAdd = () => {
    
    setAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    // Close the add modal
    setAddModalVisible(false);
  };
  const resetForm = () => {
    setName("")
    setEmail("");
    setPassword("");
    setAddress("");
    setSex("");
    setBirthdate(new Date());
    setContacts("");
    setImgPath("");
 
};
  const handleSaveAdd = async () => {
    try {
      const token = await getAuthToken();
      const formattedBirthdate = format(birthdate, 'yyyy-MM-dd');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('sex', sex);
      formData.append('contacts', contacts);
      formData.append('birthdate', formattedBirthdate);
      formData.append('img_path', {
        uri: img_path,
        type: 'image/jpeg',
        name: 'repairman.jpg', 
      });
      
  

      const response = await axios.post(`${baseURL}/createMaintenanceMan`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Maintenance Man added successfully:', response.data);
  

      handleAddModalClose();
      fetchMaintenancemen();
      resetForm();
      // Optionally, you can show a success toast message
      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: 'Maintenance Man added successfully',
      });
    } catch (error) {
      console.error('Error adding repairMan:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
  
      // Optionally, you can show an error toast message
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Error adding repairMan',
        text2: 'Please try again later',
      });
    }
  };
  

  const handleEditModalClose = () => {
  
    setSelectedMaintenanceMan(null);
    setEditModalVisible(false);
  };

  const handleSaveEdit = async () => {
    try {
      const token = await getAuthToken();

      const formattedBirthdate = format(birthdate, 'yyyy-MM-dd');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('sex', sex);
      formData.append('contacts', contacts);
      formData.append('birthdate', formattedBirthdate);
      formData.append('img_path', {
        uri: img_path,
        type: 'image/jpeg',
        name: 'repairman.jpg', 
      });

      const response = await axios.post(`${baseURL}/updateMaintenanceMan/${Id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      handleEditModalClose();
      fetchMaintenancemen();
      resetForm();
    } catch (error) {
      console.error('Error updating repair man:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };
  
  
  


  const renderMaintenanceManItem = ({ item }) => {
    

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomWidth: 1, borderColor: '#ccc' }}>
      {/* Image List Column */}
      <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 5 }}>
        <Image source={{ uri: `${url}${item.img_path}` }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      </View>

      {/* Name and Tuptnum Column */}
      <View style={{ flexDirection: 'column', marginRight: 12, width:160  }}>
        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 12 }}> {item.email}</Text>
        {/* <Text>{url}{item.img_path}</Text> */}

        {/* <Text>Role: {item.role}</Text> */}
      </View>

      {/* Edit and Delete Buttons Column */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <View style={{ marginLeft: 10 }}>
          <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
        </View>
      </View>
    </View>
    );
  };

  const handleDelete = async (repairManId) => {
    try {
        // Show a confirmation alert before proceeding with deletion
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete this Maintenance Man?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: async () => {
                const token = await getAuthToken();
                // Implement your delete logic here using axios
                await axios.delete(`${baseURL}/user/${repairManId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                fetchMaintenancemen();
                console.log('Maintenance Man deleted successfully');
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Maintenance Man deleted successfully",
                
                  });
          
                
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error deleting Maintenance Man:', error.response);
      }
  };
  const TableHeader = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc',justifyContent:'space-between' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 30 }}>
          <Text style={{ fontWeight: 'bold' }}>Maintenance Men</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginRight: 30 }}>Actions</Text>
        </View>
      </View>
    );
  };

  const pickImage = () => {
    const options = {
        title: 'Select Image',
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            // Update the state with the selected image URI
            setImgPath(response.uri);
        }
    });
};

  return (
    <View style={styles.content}>
   
      <TableHeader />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={repairMan}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMaintenanceManItem}
        />
      )}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => handleAdd()} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+</Text>
        </TouchableOpacity>
      </View>

       {/* Add Modal */}
        {/* Add Modal */}
        <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleAddModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>Add Maintenance Man</Text>
            <Input label="Name" placeholder="Name" value={name} onChangeText={setName} />
            <Input label="Email" placeholder="Email"  value={email} onChangeText={setEmail} />
            <Input label="Password" placeholder="Password"  value={password} onChangeText={setPassword} />
            <Input label="Address" placeholder="Address"  value={address} onChangeText={setAddress} />
            <Input label="Sex" placeholder="Sex"  value={sex} onChangeText={setSex} />
            <Input
                    placeholder={"Contacts"}
                    name={"contacts"}
                    id={"contacts"}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setContacts(text)}
                />
                <View>
                <Input
                    placeholder="Select Birthdate"
                    value={format(birthdate, 'yyyy-MM-dd')} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={birthdate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View>




            {/* <Input label="Image" placeholder="Image" value={img_path} onChangeText={setImgPath} /> */}
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

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleEditModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
          <Text>Edit Maintenance Man</Text>
            <Input label="Name" placeholder="Name" value={name} onChangeText={setName} />
            {/* <Input label="Email" placeholder="Email"  value={email} onChangeText={setEmail} />
            <Input label="Password" placeholder="Password"  value={password} onChangeText={setPassword} /> */}
            <Input label="Address" placeholder="Address"  value={address} onChangeText={setAddress} />
            <Input label="Sex" placeholder="Sex"  value={sex} onChangeText={setSex} />
            <Input
                    placeholder={"Contacts"}
                    name={"contacts"}
                    id={"contacts"}
                    value={contacts} 
                    keyboardType={"numeric"}
                    onChangeText={(text) => setContacts(text)}
                />
                <View>
                <Input
                    placeholder="Select Birthdate"
                    value={format(birthdate, 'yyyy-MM-dd')} 
                    onFocus={() => setShowDatePicker(true)}
                />

                {showDatePicker && (
                    <DateTimePicker
                    value={birthdate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    />
                )}
                </View>




            {/* <Input label="Image" placeholder="Image" value={img_path} onChangeText={setImgPath} /> */}
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
                  <Button title="Save" onPress={handleSaveEdit} color="green"/> 
                  <Button title="Cancel" onPress={handleEditModalClose} color="red"/>
                 
              </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
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
    content: {
      flex: 1,
      marginBottom: 16, // Set your desired margin here
    },
    saveButton: {
      backgroundColor: 'green',  // Change background color for the Save button
      marginRight: 10,  // Add margin to create a gap
    },

    cancelButton: {
        backgroundColor: 'red',  // Change background color for the Cancel button
    },

    addButtonContainer: {
      position: 'absolute',
      bottom: 16, // Adjust the bottom distance as needed
      left: 16, // Adjust the right distance as needed
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

    
});
export default TechnicianList;
