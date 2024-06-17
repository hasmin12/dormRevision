import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import url from '../../assets/common/url';
import { fetchRooms } from '../../redux/actions/adminAction';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from "react-native-dropdown-picker";

const RoomsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { rooms, loading, error } = useSelector((state) => state.rooms);
  const [selectedBranch, setSelectedBranch] = useState('Dormitory');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Dormitory", value: "Dormitory" },
    { label: "Hostel", value: "Hostel" },
  ]);
  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  useEffect(() => {
    dispatch(fetchRooms(selectedBranch));
  }, [selectedBranch]); 

 
  
  console.log(rooms)
  const handleCheck = (beds) => {
    navigation.navigate('Room Details', { beds });
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
  console.log(rooms)
  const renderRoomCard = ({ item }) => (
    <View style={[styles.card]}>
      <Text style={[styles.cardTitle]}>{item.name}</Text>
      <View style={styles.cardDates}>
        <Text style={styles.cardDate}>{item.type}</Text>
        <Text style={styles.cardDate}> {item.category}</Text>
        <Text style={styles.cardDate}> {item.occupiedBeds}/{item.totalBeds}</Text>
        
      </View>
      <View style={styles.cardContent}>
        <View style={styles.attendeesContainer}>
          {item.beds.map((bed) => (
            <Image key={bed.id} source={{ uri: `${url}${bed.user_image}` }} style={styles.attendeeImage} />
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleCheck(item.beds)}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Config</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const searchFilter = (item) => {
    const query = searchQuery.toLowerCase();
    return (
        item.name.toLowerCase().includes(query) ||
        // item.category.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
    );
};


  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Rooms</Text> */}
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList 
        contentContainerStyle={styles.listContainer}
        data={rooms.filter(searchFilter)}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // paddingTop:60,
  },
  listContainer:{
    paddingHorizontal:10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius:5,
    borderColor:'#A9A9A9',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#bfdfdf',
      
  },
  cardTitle: {
    fontSize:18,
    fontWeight: 'bold',
    paddingVertical: 5,
    titleColor: '#008080',
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',

  },
  cardDate: {
    // color: '#888',
  },
  cardContent: {
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth:0.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginTop:15,
    backgroundColor: '#DCDCDC',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#00008B',
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

export default RoomsList;