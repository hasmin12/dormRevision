import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import url from '../../assets/common/url';

const BedList = ({ route }) => {
  const { beds } = route.params;
  const [selectedBed, setSelectedBed] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [residents, setResidents] = useState([]);
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
  // console.log(beds)
  const [searchQuery, setSearchQuery] = useState('');
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
  }
  useEffect(() => {
    // fetchBeds();
    fetchResidents();
  }, []);
  const renderAppointmentCard = ({ item }) => (
    <View style={[styles.card]}>
      <Text style={[styles.cardTitle]}>Bed {item.name}</Text>
      <View style={styles.cardDates}>
        <Text style={styles.cardDate}>{item.status}</Text>
      </View>
      <View style={styles.cardContent}>
      <View style={styles.attendeesContainer}>
        <View style={styles.attendeeInfoContainer}>
          <Image source={{ uri: `${url}${item.user_image}` }} style={styles.attendeeImage} />
          {item.resident ? (
            <Text style={styles.residentName}>{item.resident.name}</Text>
          ) : (
            <Text style={styles.residentName}>No resident</Text>
          )}
        </View>
      </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleAssignPress(item.id)}>
            <Text style={styles.buttonText}>Assign</Text>
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
    return item.name.toLowerCase().includes(query);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Details</Text>
      {/* <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      /> */}
      <FlatList 
        contentContainerStyle={styles.listContainer}
        data={beds.filter(searchFilter)}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />

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
    paddingHorizontal:5
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
    flex:1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    marginHorizontal:5,
    backgroundColor: '#c7e3ff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    
  },
  cardTitle: {
    fontSize:18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  cardDate: {
    color: '#888',
  },
  cardContent: {
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  attendeesContainer: {
    // flex: 1,
    // flexWrap:'wrap',
    // flexDirection: 'row',
    
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    // marginLeft: -10,
    borderWidth:0.5,
    // marginTop:3,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginTop:15,
    backgroundColor: '#DCDCDC',
    padding:8,
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#00008B',
    marginRight: 10,
  },
  buttonText: {
    color: '#00008B',
  },
  attendeeInfoContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
  },
  residentName: {
    marginLeft: 10,
    fontSize: 16,
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
