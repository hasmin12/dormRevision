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
import { updateAnnouncement } from '../../redux/actions/adminAction';
import { useDispatch, useSelector } from 'react-redux';

// import url from '../../assets/common/url';
import Icon from "react-native-vector-icons/FontAwesome";
import url from '../../assets/common/url';
import { fetchAnnouncements } from '../../redux/actions/residentAction';
import { useNavigation } from '@react-navigation/native';
const AnnouncementsList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [img_path, setImgPath] = useState("")
  const [receiver, setReceiver] = useState("")

  const [Id, setId] = useState("");
  const { announcements, loading, error } = useSelector((state) => state.announcements);
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); 
  const [addModalVisible, setAddModalVisible] = useState(false);
  // const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, []);
  const resetForm = () => {
    setTitle("");
    setContent("");
    setImgPath("");
  };
  const handleEdit = (announcement) => {
    console.log(announcement.id)

    setTitle(announcement.title);
    setContent(announcement.content);
    setImgPath(`${url}${announcement.img_path}`);
    setId(announcement.id);
    console.log(`${url}${announcement.img_path}`)
    setEditModalVisible(true);
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setAddModalVisible(false);
  };
  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const handleSaveAdd = async () => {
    try {
      const token = await getAuthToken();
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('receiver', receiver);
      formData.append('img_path', {
        uri: img_path,
        type: 'image/jpeg', // Adjust the type based on your image format
        name: 'announcement_image.jpg', // Adjust the name as needed
      });
      
  
      // Assuming your API endpoint for adding an announcement is /announcement
      const response = await axios.post(`${baseURL}/announcement`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Announcement added successfully:', response.data);
      handleAddModalClose();
      dispatch(fetchAnnouncements());
      resetForm();
      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: 'Announcement added successfully',
      });
    } catch (error) {
      console.error('Error adding Announcement:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
  
      // Optionally, you can show an error toast message
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Error adding Announcement',
        text2: 'Please try again later',
      });
    }
  };
 


  const handleEditModalClose = () => {
    setSelectedAnnouncement(null);
    setEditModalVisible(false);
  };
  

  const handleSaveEdit = async () => {
    try {
      const token = await getAuthToken();
        console.log(img_path)
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('receiver', receiver);

      formData.append('img_path', {
        uri: img_path,
        type: 'image/jpeg', // Adjust the type based on your image format
        name: 'announcement_image.jpg', // Adjust the name as needed
      });
  
      // Assuming you have the selected announcement object with an 'id' property
      // formData.append('id', selectedAnnouncement.id);
  
      // Dispatch the updateAnnouncement action with the formData
      // dispatch(updateAnnouncement(formData, token));
      const response = await axios.post(`${baseURL}/updateAnnouncement/${Id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log(response.data);
      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: 'Edit Announcement Success',
      });
      // Close the edit modal and refresh the list of announcements
      handleEditModalClose();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error updating Announcements:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };
  
  
  




  const renderAnnouncementItem = ({ item }) => {
    console.log(item)
    const handleAnnouncementPress = (announcement) => {
      navigation.navigate('AnnouncementDetails', { announcement });
    };
    return (
      <TouchableOpacity onPress={() => handleAnnouncementPress(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5, borderBottomWidth: 1, borderColor: '#ccc' }}>
  
      <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 5 }}>
        <Image source={{ uri: `${url}${item.img_path}` }} style={{ width: 50, height: 50, borderRadius: 25 }} />
      </View>

      <View style={{ flexDirection: 'column', marginRight: 12, width:160  }}>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ fontSize: 12 }}> {item.content}</Text>
      </View>
 
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <View style={{ marginLeft: 10 }}>
          <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
        </View>
      </View>

    </View>
    </TouchableOpacity>
    );
  };

  const handleDelete = async (announcementId) => {
    try {
        // Show a confirmation alert before proceeding with deletion
        Alert.alert(
          'Confirm Deletion',
          'Are you sure you want to delete this resident?',
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
                await axios.delete(`${baseURL}/deleteAnnouncement/${announcementId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                fetchAnnouncements();
                console.log('Announcement deleted successfully');
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Announcement deleted successfully",
                
                  });
      
                
              },
            },
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error deleting Announcement:', error.response);
      }
  };
  const TableHeader = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc',justifyContent:'space-between' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 30 }}>
          <Text style={{ fontWeight: 'bold' }}>Announcements</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', marginRight: 30 }}>Actions</Text>
        </View>
      </View>
    );
  };
  const handleAnnouncementPress = (announcement) => {
    navigation.navigate('AnnouncementDetails', { announcement });
  };
  const pickImage = async () => {
    try {
        const options = {
            title: 'Select Image',
            mediaType: 'mixed',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        };
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled picking image');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                const selectedAsset = response.assets[0];
                setImgPath(selectedAsset.uri);
            }
        });
    } catch (error) {
        console.error('Error picking image:', error);
    }
};


  return (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
        data={announcements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          key={item}
          onPress={() => handleAnnouncementPress(item)}
        >
          <View style={styles.announcementItem}>
            <Text style={styles.announcementTitle}>{item.title}</Text>
            <Text style={styles.postedBy}>Posted by: {item.postedBy}</Text>
            {item.img_path && (
              <Image
                source={{ uri: `http://192.168.100.18:8000${item.img_path}` }}
                style={styles.announcementImage}
                onError={(error) => console.error('Image load error:', error)}
              />
            )}
            <Text style={styles.announcementContent}>{item.content}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
      )}
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
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text>Add Announcements</Text>
            <Input label="Title" placeholder="Title" value={title} onChangeText={setTitle} />
            <Input label="Content" placeholder="Content"  value={content} onChangeText={setContent} />
            <Input label="Receiver" placeholder="Receiver"  value={receiver} onChangeText={setReceiver} />

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
            <Text>Edit Announcement</Text>
            <Input label="Title" value={title} onChangeText={setTitle} />
            <Input label="Content" value={content} onChangeText={setContent} />
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
        width: 200,
        height: 200,
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
      padding: 16, // Set your desired margin here
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
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    announcementItem: {
      marginBottom: 16,
    },
    announcementTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    postedBy: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 8,
    },
    announcementImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 8,
    },
    announcementContent: {
      fontSize: 16,
    },

    
});
export default AnnouncementsList;
