import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnnouncements } from '../../redux/actions/residentAction';
const Announcement = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { announcements, loading, error } = useSelector((state) => state.announcements);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, []);

  const handleAnnouncementPress = (announcement) => {
    navigation.navigate('AnnouncementDetails', { announcement });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Announcements</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Announcement;
