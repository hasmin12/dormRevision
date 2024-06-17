import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import Input from '../../shared/Form/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import url from '../../assets/common/url';
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/actions/adminAction';
import { globalstyles } from '../styless';
const ResidentsList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, loading, error } = useSelector((state) => state.users);
  // console.log(users)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [residentType, setResidentType] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [id, setId] = useState('');
  const [Tuptnum, setTuptnum] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sex, setSex] = useState('');
  const [contacts, setContacts] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());

  // const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Both", value: "" },
    { label: "Dormitory", value: "Dormitory" },
    { label: "Hostel", value: "Hostel" },
  ]);
  
  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  useEffect(() => {
    dispatch(fetchUsers(searchQuery, residentType, selectedBranch)); 
  }, [searchQuery, residentType, selectedBranch, dispatch]); 
  const handleResidentTypeChange = (type) => {
    setResidentType(type);
  };

  

  const handleRowPress = async (resident) => {
    try {
      // navigation.navigate('PaymentHistory', { resident: resident });
      navigation.navigate('Resident Details',  resident );

    } catch (error) {
      console.error('Error navigating to Resident Details:', error);
    }
  };
  


  const handleDelete = async (userId) => {
    try {
      Alert.alert(
        'Confirm Archive',
        'Are you sure you want to archive this resident?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Archive',
            onPress: async () => {
              const token = await getAuthToken();
              await axios.delete(`${baseURL}/archiveResident/${userId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              fetchUsers();
              console.log('User archived successfully');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error archiving user:', error.response);
    }
  };


  const handleEdit = (user) => {
    setId(user.id);
    setTuptnum(user.Tuptnum);
    setName(user.name);
    setAddress(user.address);
    setSex(user.sex);
    setContacts(user.contacts);
    // setBirthdate(new Date(user.birthdate));
    setEditModalVisible(true);
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setAddModalVisible(false);
  };

  const handleSaveAdd = () => {
    // Implement logic for saving new user
    // Close the modal after saving
    setAddModalVisible(false);
    // Optionally, you can fetch users again to update the list
    fetchUsers();
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

  const handleSaveEdit = async () => {
    try {
      const token = await getAuthToken();

      const formattedBirthdate = format(birthdate, 'yyyy-MM-dd');
      const formData = new FormData();
      formData.append('Tuptnum', Tuptnum);
      formData.append('name', name);
      formData.append('address', address);
      formData.append('sex', sex);
      formData.append('contacts', contacts);
      formData.append('birthdate', formattedBirthdate);

      // Call the dispatch function to update the user
      // dispatch(updateResident(id, formData));

      handleEditModalClose();
      // Fetch users again to update the list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };

  const handleSendEmail = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(
        `${baseURL}/notifyResidents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: 'Emails sent successfully',
      });
      
    
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };
  const equipmentPress = async (resident) => {
    navigation.navigate('Equipment', resident);
  };


  const handleSearch = () => {
    setSearchQuery(searchInput);

  };
  return (
    <View style={styles.content}>
        <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={selectedBranch}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedBranch}
          setItems={setItems}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonGroup}>
        <Button
          title="All"
          onPress={() => handleResidentTypeChange('All')}
          style={styles.saveButton}
        />
        <Button
          title="Student"
          onPress={() => handleResidentTypeChange('Student')}
          style={styles.saveButton}
        />
        <Button
          title="Faculty"
          onPress={() => handleResidentTypeChange('Faculty')}
          style={styles.saveButton}
        />
        <Button
          title="Staff"
          onPress={() => handleResidentTypeChange('Staff')}
          style={styles.saveButton}
        />
      </View>
      <Button
          title="Send Email"
          onPress={() => handleSendEmail()}
          style={styles.saveButton}
        />

        <FlatList
          enableEmptySections={true}
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <View style={globalstyles.box}>
                <Image style={globalstyles.image} source={{ uri: `${url}${item.img_path}` }} />
                {/* <Image style={globalstyles.image} source={require("../../assets/datzzz.jpg")} /> */}

                <View style={globalstyles.boxContent}>
                  <Text style={globalstyles.title}>{item.name}</Text>
                  <Text style={globalstyles.description}>{item.email}</Text>
                  <View style={globalstyles.buttons}>
                    
                    <TouchableOpacity onPress={()=>handleRowPress(item)}
                
                      style={[globalstyles.button, globalstyles.view]}
                      >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/2x/search' }}
                      />
                    </TouchableOpacity>

                     <TouchableOpacity 

                      style={[globalstyles.button, globalstyles.profile]}
                   >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/cottage.png' }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>equipmentPress(item)}
                      style={[globalstyles.button, globalstyles.message]}
                      >
                      <Image
                        style={globalstyles.iconButton}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/plus.png' }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={globalstyles.description}>{item.status}</Text>

                </View>
              </View>
            )
          }}
        />
      <View style={styles.addButtonContainer}>
        <TouchableOpacity onPress={() => handleAdd()} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>+</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      onRequestClose={handleEditModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>Edit User</Text>
            <Input label="Tuptnum" value={Tuptnum} onChangeText={setTuptnum} />
            <Input label="Name" value={name} onChangeText={setName} />
            <Input label="Address" value={address} onChangeText={setAddress} />
            <Input label="Sex" value={sex} onChangeText={setSex} />
            <Input label="Contacts" value={contacts} onChangeText={setContacts} />
            <Input
              placeholder="Select Birthdate"
              value={birthdate ? format(birthdate, 'yyyy-MM-dd') : ''}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
              <DateTimePicker
                value={birthdate instanceof Date ? birthdate : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setBirthdate(selectedDate);
                  }
                }}
              />
            )}
            <View>
              <Button title="Save" onPress={handleSaveEdit} color="green" />
              <Button title="Cancel" onPress={handleEditModalClose} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    width: '95%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    marginRight: 10,
  },

  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 16, // Adjust the bottom distance as needed
    right: 16, // Adjust the right distance as needed
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

export default ResidentsList;
