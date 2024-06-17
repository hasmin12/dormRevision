import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import { fetchNotifications } from '../../redux/actions/notificationAction';
import { useDispatch, useSelector } from 'react-redux';
const NotificationsList = () => {
  const { notifications, loading, error } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
    useEffect(() => {
      dispatch(fetchNotifications());
    }, []);

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  const handleNotificationPress = async (notification) => {
    try {
      // Mark the notification as read on the server
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/notifSeen/${notification.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        // console.log("nice");
        setSelectedNotification(notification);
        setModalVisible(true);
        fetchNotifications();
      } else {
        console.error('Failed to mark notification as read:', response);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error.response);
    }
  };
  

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAccept = async () => {
    try {
      // Implement your logic for accepting the notification
      const token = await getAuthToken();
      // console.log(token);
      const response = await axios.get(`${baseURL}/acceptApplication/${selectedNotification.sender_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      closeModal();
      dispatch(fetchNotifications());
    } catch (error) {
      console.error('Error accepting notification:', error.response);
    }
  };

  const handleDecline = async () => {
    try {
      // Implement your logic for declining the notification
      const token = await getAuthToken();
      await axios.post(
        `${baseURL}/declineApplication`,
        { id: selectedNotification.sender_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeModal();
      fetchNotifications(); // Refresh the notification list
    } catch (error) {
      console.error('Error declining notification:', error.response);
    }
  };

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item)}>
        <View style={[styles.notificationItem, { backgroundColor: item.status === 'unread' ? '#add8e6' : '#fff' }]}>
          <View style={styles.notificationContent}>
            <Text style={styles.typeText}>{item.notification_type}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
        />
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Notification Details</Text>
                {selectedNotification && (
                  <>
                    <Text>{selectedNotification.notification_type}</Text>
                    <Text>{selectedNotification.message}</Text>
                    {/* Add more details if needed */}
                  </>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff', // Set a background color
      },
      notificationContent: {
        flex: 1,
        marginRight: 16,
      },
      senderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
      },
      typeText: {
        color: '#007bff', // Add a different color for the type
        marginBottom: 4,
      },
      messageText: {
        fontSize: 14,
        color: '#555',
      },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    color: 'blue',
    marginTop: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NotificationsList;
