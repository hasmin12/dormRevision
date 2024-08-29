import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector, useDispatch } from 'react-redux';
import { fetchLaundryschedules } from '../../redux/actions/UserAction';

const Laundry = () => {
  const dispatch = useDispatch();
  const { laundryschedules } = useSelector((state) => state.laundryschedules);

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "7:00am - 9:00am", value: "7:00am - 9:00am", count: 0 },
    { label: "9:00am - 11:00am", value: "9:00am - 11:00am", count: 0 },
    { label: "1:00pm - 3:00pm", value: "1:00pm - 3:00pm", count: 0 },
    { label: "3:00pm - 5:00pm", value: "3:00pm - 5:00pm", count: 0 },
  ]);

  useEffect(() => {
    dispatch(fetchLaundryschedules());
  }, [dispatch]);

  useEffect(() => {
    countLaundryTimes(selectedDay);
  }, [laundryschedules, selectedDay]);

  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.dateString);
    setSelectedDay(selectedDate);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTime('');
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      const formattedDate = format(selectedDay, 'yyyy-MM-dd');

      formData.append('laundrydate', formattedDate);
      formData.append('laundrytime', selectedTime);

      const response = await axios.post(`${baseURL}/createLaundrySchedule`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Toast.show({
        topOffset: 60,
        type: 'success',
        text1: response.data.message,
      });

      setModalVisible(false);

    } catch (error) {
      console.error('Error submitting Schedule:', error);
      Toast.show({
        topOffset: 60,
        type: 'error',
        text1: 'Error submitting Schedule',
        text2: 'Please try again later',
      });
    }
  };

  const countLaundryTimes = (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const counts = items.map(item => {
      const count = laundryschedules.filter(schedule =>
        schedule.laundrytime === item.value &&
        schedule.laundrydate === formattedDate
      ).length;
      return { ...item, count };
    });
    setItems(counts);
  };

  const resetItems = () => {
    setItems([
      { label: "7:00am - 9:00am", value: "7:00am - 9:00am", count: 0 },
      { label: "9:00am - 11:00am", value: "9:00am - 11:00am", count: 0 },
      { label: "1:00pm - 3:00pm", value: "1:00pm - 3:00pm", count: 0 },
      { label: "3:00pm - 5:00pm", value: "3:00pm - 5:00pm", count: 0 },
    ]);
  };

  const CustomItem = ({ label, disabled }) => (
    <Text style={{ color: disabled ? 'gray' : 'black' }}>
      {disabled ? `${label} (Full Schedule)` : label}
    </Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        minDate={new Date()} // Set minDate to prevent selection of past dates
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Selected Day: {selectedDay.toDateString()}</Text>
            <View style={styles.tableContainer}>
              <Text>Selected Time</Text>
              <View style={styles.pickerContainer}>
                <DropDownPicker
                  open={open}
                  value={selectedTime}
                  items={items.map(item => ({
                    label: <CustomItem label={item.label} disabled={item.count >= 4} />,
                    value: item.value,
                    disabled: item.count >= 4
                  }))}
                  setOpen={setOpen}
                  setValue={setSelectedTime}
                  setItems={setItems}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    backgroundColor: 'lightblue',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 25,
    paddingBottom: 20,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
  eventTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
    padding: 20,
  },
  tableContainer: {
    marginTop: 20,
  },
  pickerContainer: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Laundry;
