import axios from 'axios';

import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FETCH_NOTIFICATIONS_FAILURE,FETCH_NOTIFICATIONS_REQUEST,FETCH_NOTIFICATIONS_SUCCESS } from '../constants/UserConstants';

export const fetchNotificationRequest = () => ({
  type: FETCH_NOTIFICATIONS_REQUEST,
});

export const fetchNotificationSuccess = (Notifications) => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload: Notifications,
});

export const fetchNotificationFailure = (error) => ({
  type: FETCH_NOTIFICATIONS_FAILURE,
  payload: error,
});
const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

export const fetchNotifications = () => {
  return async (dispatch) => {
    dispatch(fetchNotificationRequest());
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getNotifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      dispatch(fetchNotificationSuccess(response.data.notifications));
    } catch (error) {
      console.error('Error fetching Notifications:', error);
      dispatch(fetchNotificationFailure('Error fetching Notifications'));
    }
  };
};


