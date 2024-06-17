// Import necessary React and React Native components
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView,StyleSheet,TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLaundryschedules } from '../../redux/actions/UserAction';


const Laundry = () => {
  const dispatch = useDispatch();
  const { laundryschedules, loading, error } = useSelector((state) => state.laundryschedules);
  useEffect(() => {
    dispatch(fetchLaundryschedules());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    <Agenda
      items={
        laundryschedules
      }
   
      renderItem={(item, isFirst) => (
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>{item.laundry_time}</Text>
          <Text style={styles.eventTitle}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
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
    paddingBottom:20
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
  eventTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default Laundry;
