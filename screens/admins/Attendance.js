import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';

const Attendance = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };
  const fetchAttendanceData = async () => {
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/getAllSleepLogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceData(response.data.attendance);
  console.log(response.data.attendance);

      setSelectedMonth(response.data.currentMonth);
      setItems(response.data.months.map(month => ({ label: month, value: month })));
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const renderDayValue = (attendance) => {
    if (!attendance[selectedMonth]) return null; // Return null if data for selected month is not available
    return attendance[selectedMonth].map((value, index) => {
      const cellStyle = {
        ...styles.cell,
        backgroundColor: value === 'P' ? 'lightgreen' : value ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
      };
      return (
        <DataTable.Cell key={index} style={cellStyle}>
          <Text style={styles.headerText}>{value}</Text>
        </DataTable.Cell>
      );
    });
  };
  
  

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };
  const renderDayCells = (attendance) => {
    const daysInMonth = moment(selectedMonth, 'MMMM').daysInMonth();
    if (!attendance[selectedMonth] || daysInMonth <= 0) return null; // Return null if data for selected month is not available
    return [...Array(daysInMonth)].map((_, index) => (
      <DataTable.Cell key={index} style={[styles.headerCell, styles.headerText]}>{index + 1}</DataTable.Cell>
    ));
  };
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <DropDownPicker
          open={open}
          value={selectedMonth}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedMonth}
          setItems={setItems}
          onChangeValue={handleMonthChange}
        />
      </View>
      <ScrollView horizontal={true}>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell style={[styles.headerResidentCell]}>Resident</DataTable.Cell>
            {renderDayCells(attendanceData.length > 0 ? attendanceData[0].attendance : {})}
          </DataTable.Row>
          {attendanceData.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={[styles.residentCell]}>{item.resident}</DataTable.Cell>
              {renderDayValue(item.attendance)}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    width: 40,
    textAlign: 'center'
  },
  headerCell: {
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'lightblue',

    justifyContent: 'center',
    width: 40,
    textAlign: 'center'
  },
  residentCell: {
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    width: 100,
    textAlign: 'center'
  },
  headerResidentCell: {
    borderWidth: 1,
    borderColor: 'blue',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    width: 100,
    textAlign: 'center'
  },

});

export default Attendance;
