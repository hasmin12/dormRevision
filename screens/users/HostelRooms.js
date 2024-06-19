import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Button, FlatList, TextInput } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import url from '../../assets/common/url';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const HostelRooms = () => {
  const navigation = useNavigation();
  const [hostelRooms, setHostelRooms] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const [startDisplayDate, setStartDisplayDate] = useState(null);
  const [endDisplayDate, setEndDisplayDate] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [wifi, setWifi] = useState(false);
  const [tvWithCable, setTvWithCable] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [refrigerator, setRefrigerator] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [hotShower, setHotShower] = useState(false);
  const [hairDryer, setHairDryer] = useState(false);
  const [kettle, setKettle] = useState(false);
  console.log(`${baseURL}/getHostelrooms`)

  const fetchHostelRooms = async () => {
    try {
      const response = await axios.get(`${baseURL}/getHostelrooms`);
      setHostelRooms(response.data);
    } catch (error) {
      console.error('Error fetching hostel rooms:', error);
    }
  };

  useEffect(() => {
    fetchHostelRooms();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredData = hostelRooms.filter((room) => {
    const conflictingReservation = room.reservations.find(reservation => {
      if (!startDate || !endDate) return false;
      return reservation.checkin_date <= endDate && reservation.checkout_date >= startDate;
    });
  
    const matchesAmenities = (
      (!wifi || room.wifi === 1) &&
      (!tvWithCable || room.tv_with_cable === 1) &&
      (!kitchen || room.kitchen === 1) &&
      (!refrigerator || room.refrigerator === 1) &&
      (!airConditioning || room.air_conditioning === 1) &&
      (!hotShower || room.hot_shower === 1) &&
      (!hairDryer || room.hair_dryer === 1) &&
      (!kettle || room.kettle === 1)
    );
  
    return (
      !conflictingReservation &&
      matchesAmenities &&
      room.bedtype.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const renderItem = ({ item }) => {
    const conflictingReservation = item.reservations.find(
      reservation =>
        reservation.checkin_date <= endDate &&
        reservation.checkout_date >= startDate
    );

    const status = conflictingReservation ? 'Reserved' : 'Available';

    return (
      <TouchableOpacity
        style={[styles.card, conflictingReservation && styles.reservedCard]}
        onPress={() => {
          if (!conflictingReservation) {
            navigateToRoomDetails(item);
          }
        }}
        disabled={!!conflictingReservation}
      >
        <Image source={{ uri: `${url}${item.img_path}` }} style={styles.image} />
        <View style={styles.cardBody}>
          <Text style={styles.price}>₱{item.price}/day</Text>
          <Text style={styles.address}>{item.name}</Text>
          <Text style={styles.address}>{item.pax} Pax</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.beds}>{item.bedtype} bed</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const navigateToRoomDetails = (room) => {
    navigation.navigate('HostelRoomDetails', { room });
  };

  const openCalendar = () => {
    setStartDate(null);
    setModalVisible(true);
  };

  const openFilter = () => {
    setFilterVisible(true);
  };

  const closeFilter = () => {
    setFilterVisible(false);
  };

  const getDatesInRange = (start, end) => {
    const dates = {};
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      dates[dateString] = { color: 'green' };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Button title="Open Calendar" onPress={openCalendar} />
      </View>
      <View style={styles.searchInputContainer}>
        <Button title="Filter" onPress={openFilter} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setStartDate(null);
        }}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
              <View style={styles.modalInfo}>
                <Calendar
                  markingType='period'
                  markedDates={{
                    [startDisplayDate]: { startingDay: true, color: 'green' },
                    [endDisplayDate]: { endingDay: true, color: 'green' },
                    ...getDatesInRange(new Date(startDisplayDate), new Date(endDisplayDate))
                  }}
                  onDayPress={(day) => {
                    if (!startDate || (endDate && new Date(day.dateString) < new Date(startDate))) {
                      setStartDate(day.dateString);
                      setStartDisplayDate(day.dateString);
                      setEndDate(null);
                      setEndDisplayDate(null);
                    } else if (!endDate && new Date(day.dateString) >= new Date(startDate)) {
                      setEndDate(day.dateString);
                      setEndDisplayDate(day.dateString);
                      setModalVisible(false);
                    }
                  }}
                />
              </View>
            </View>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={styles.btnClose}>
                <Text style={styles.txtClose}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          onChangeText={handleSearch}
          value={searchText}
        />
      </View>
      <Modal
                animationType="slide"
                transparent={true}
                visible={filterVisible}
                onRequestClose={() => {
                    setFilterVisible(false);
                }}
            >
              <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.popupContent}>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setWifi(!wifi)} style={[styles.checkbox, wifi && styles.checked]}>
            {wifi && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Wifi</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setTvWithCable(!tvWithCable)} style={[styles.checkbox, tvWithCable && styles.checked]}>
            {tvWithCable && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>TV with Cable</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setKitchen(!kitchen)} style={[styles.checkbox, kitchen && styles.checked]}>
            {kitchen && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Kitchen</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setRefrigerator(!refrigerator)} style={[styles.checkbox, refrigerator && styles.checked]}>
            {refrigerator && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Refrigerator</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setAirConditioning(!airConditioning)} style={[styles.checkbox, airConditioning && styles.checked]}>
            {airConditioning && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Air Conditioning</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setHotShower(!hotShower)} style={[styles.checkbox, hotShower && styles.checked]}>
            {hotShower && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Hot Shower</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setHairDryer(!hairDryer)} style={[styles.checkbox, hairDryer && styles.checked]}>
            {hairDryer && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Hair Dryer</Text>
        </View>
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setKettle(!kettle)} style={[styles.checkbox, kettle && styles.checked]}>
            {kettle && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Kettle</Text>
        </View>
      </View>
      <Button title="Close" onPress={closeFilter} />
      
      </View>
      </View>
            </Modal>
      
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.propertyListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f8f8f8'
  },
  searchInputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  checkboxContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#ffa500',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  propertyListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reservedCard: {
    backgroundColor: '#d3d3d3',
  },
  image: {
    height: 150,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardBody: {
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
  },
  beds: {
    fontSize: 14,
    color: '#ffa500',
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#ffa500',
    fontWeight: 'bold',
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 7,
    overflow: 'hidden',
  },
  popupContent: {
    padding: 20,
  },
  modalInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  btnClose: {
    flex: 1,
    height: 40,
    backgroundColor: '#20b2aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtClose: {
    color: 'white',
  },
});

export default HostelRooms;
