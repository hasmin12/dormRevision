import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
// import ModalDropdown from 'react-native-modal-dropdown'; // Import ModalDropdown library
import url from '../../assets/common/url';
import Input from '../../shared/Form/Input';
const BedList = ({ route }) => {
  const { beds } = route.params;
  // const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBed, setSelectedBed] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  
  const [residents, setResidents] = useState([]);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const fetchResidents = async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getResidents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResidents(response.data.residents);
      console.log(response.data.residents)
    } catch (error) {
      console.error('Error fetching Residents:', error.response);
    }
  };

  useEffect(() => {
    // fetchBeds();
    fetchResidents();
  }, []);

  const handleEdit = (bed) => {
    setSelectedBed(bed);
    // console.log(selectedBed);
    setEditModalVisible(true);
  };

  const handleAssignPress = (bedId) => {
    const selectedBed = beds.find((bed) => bed.id === bedId);
    setSelectedBed(selectedBed);
    setModalVisible(true);
  };

  const handleResidentSelect = async (residentId) => {
    try {
      const token = await getAuthToken();
      const response = await axios.post(`${baseURL}/assignResident`,{bedId: selectedBed.id,residentId: residentId,},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      
      if (response.status === 200) {
        console.log(`Successfully assigned Resident ${residentId} to Bed ${selectedBed.name}`);
      } else {
        console.error('Error assigning resident:', response.data);
      }
      fetchBeds();
      fetchResidents();
      setModalVisible(false);
    } catch (error) {
      console.error('Error assigning resident:', error);
    }
  };

  const handleSaveEdit = async (residentId) => {
    try {
      const token = await getAuthToken();
    //   console.log(selectedBed.id);
      const response = await axios.post(`${baseURL}/removeAssign`,{bedId: selectedBed.id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      
      if (response.status === 200) {
        console.log(`Successfully Remove assigned Resident to Bed ${selectedBed.name}`);
      } else {
        console.error('Error assigning resident:', response.data);
      }
      fetchBeds();
      fetchResidents();
      setModalVisible(false);
    } catch (error) {
      console.error('Error assigning resident:', error);
    }
  };

  const renderResidentItem = ({ item }) => {
    // Check if the item is a resident and is not assigned
    if (item.role === 'Resident' && item.status==='Applicant') {
      return (
        <TouchableOpacity
          style={styles.residentItem}
          onPress={() => handleResidentSelect(item.id)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    // // Return null if the item is not a resident or is already assigned
    // return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    {beds.map((bed) => (
  <View key={bed.id} style={styles.card}>
    <FontAwesome name="bed" size={100} color="black" style={styles.icon} />
    <Text style={styles.bedTitle}>Bed {bed.name}</Text>

    {/* Displaying user's name if the status is 'Occupied' */}
    <Text>{bed.status === 'Occupied' ? bed.resident_name : ''}</Text>

    <Text>{bed.status}</Text>

    {bed.status !== 'Occupied' && (
      <TouchableOpacity
        style={styles.assignButton}
        onPress={() => handleAssignPress(bed.id)}
      >
        <Text>Assign</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      style={styles.assignButton}
      onPress={() => handleEdit(bed)}
    >
      <Text>Edit</Text>
    </TouchableOpacity>
  </View>
))}


      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Resident</Text>
          <FlatList
            data={residents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderResidentItem}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Bed {selectedBed ? selectedBed.name : ''} </Text>
            {/* <Input value={selectedBed.name } /> */}
            <Input value={selectedBed ? selectedBed.details : ''}  />
            <Input value={selectedBed ? selectedBed.status : ''}   />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setEditModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  bedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  icon: {
    marginBottom: 8,
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
});

export default BedList;
