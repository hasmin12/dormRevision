import axios from 'axios';
import {
  REGISTER_RESIDENT_REQUEST,
  REGISTER_RESIDENT_SUCCESS,
  REGISTER_RESIDENT_FAIL,
} from '../constants';
import { 
  FETCH_PAYMENT_HISTORY_FAILURE,
  FETCH_PAYMENT_HISTORY_REQUEST,
  FETCH_PAYMENT_HISTORY_SUCCESS,
  FETCH_MAINTENANCES_FAILURE,
  FETCH_MAINTENANCES_SUCCESS,
  FETCH_MAINTENANCES_REQUEST,
  FETCH_RESERVATIONS_FAILURE,
  FETCH_RESERVATIONS_REQUEST,
  FETCH_RESERVATIONS_SUCCESS,
  FETCH_ANNOUNCEMENTS_FAILURE,
  FETCH_ANNOUNCEMENTS_REQUEST,
  FETCH_ANNOUNCEMENTS_SUCCESS
} from '../constants/UserConstants';
import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchPaymentHistoryRequest = () => ({
  type: FETCH_PAYMENT_HISTORY_REQUEST,
});

export const fetchPaymentHistorySuccess = (paymentHistory) => ({
  type: FETCH_PAYMENT_HISTORY_SUCCESS,
  payload: paymentHistory,
});

export const fetchPaymentHistoryFailure = (error) => ({
  type: FETCH_PAYMENT_HISTORY_FAILURE,
  payload: error,
});
const getAuthToken = async () => {
  return AsyncStorage.getItem('token');
};
export const fetchPaymentHistory = () => {
  return async (dispatch) => {
    dispatch(fetchPaymentHistoryRequest());
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/myPaymentHistory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchPaymentHistorySuccess(response.data));
    } catch (error) {
      console.error('Error fetching payment history:', error);
      dispatch(fetchPaymentHistoryFailure('Error fetching payment history'));
    }
  };
};

export const registerResident= (formData, navigation) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_RESIDENT_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    };

    const response = await axios.post(`${baseURL}/register`, formData, config);

    if (response.status === 200) {
      dispatch({
        type: REGISTER_RESIDENT_SUCCESS,
        payload: response.data.resident,
      });

      // Handle success action like showing a Toast and navigating
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Registration Succeeded",
        text2: "Please Login into your account",
      });
      setTimeout(() => {
        navigation.navigate("DormXtend");
      }, 500);
    } else {
      // Handle unexpected response status here
      console.error('Unexpected response status:', response.status);
      // You may want to dispatch an error action or show an error message
    }
  } catch (error) {
    dispatch({
      type: REGISTER_RESIDENT_FAIL,
      payload: error.response ? error.response.data.message : 'An error occurred',
    });

    // Handle error action like showing an error Toast
    console.error('Error in registration:', error);
    Toast.show({
      position: 'bottom',
      bottomOffset: 20,
      type: "error",
      text1: "Something went wrong",
      text2: "Please try again",
    });
  }
};

// Action Types
export const UPDATE_PAYMENT_HISTORY = 'UPDATE_PAYMENT_HISTORY';

// Action Creators
export const updatePaymentHistory = (paymentHistory) => ({
  type: UPDATE_PAYMENT_HISTORY,
  payload: paymentHistory,
});


export const fetchMaintenanceRequest = () => ({
  type: FETCH_MAINTENANCES_REQUEST,
});

export const fetchMaintenanceSuccess = (maintenances) => ({
  type: FETCH_MAINTENANCES_SUCCESS,
  payload: maintenances,
});

export const fetchMaintenanceFailure = (error) => ({
  type: FETCH_MAINTENANCES_FAILURE,
  payload: error,
});

export const fetchMaintenances = () => {
  return async (dispatch) => {
    dispatch(fetchMaintenanceRequest());
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/getMaintenances`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(response.data)
  
      dispatch(fetchMaintenanceSuccess(response.data));
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      dispatch(fetchMaintenanceFailure('Error fetching maintenances'));
    }
  };
};

export const fetchReservationRequest = () => ({
  type: FETCH_RESERVATIONS_REQUEST,
});

export const fetchReservationSuccess = (reservations) => ({
  type: FETCH_RESERVATIONS_SUCCESS,
  payload: reservations,
});

export const fetchReservationFailure = (error) => ({
  type: FETCH_RESERVATIONS_FAILURE,
  payload: error,
});

export const fetchReservations = () => {
  return async (dispatch) => {
    dispatch(fetchReservationRequest());
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/myReservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  // console.log(response.data)
      dispatch(fetchReservationSuccess(response.data));
    } catch (error) {
      console.error('Error fetching myReservations:', error);
      dispatch(fetchReservationFailure('Error fetching myReservations'));
    }
  };
};

export const fetchAnnouncementRequest = () => ({
  type: FETCH_ANNOUNCEMENTS_REQUEST,
});

export const fetchAnnouncementSuccess = (announcements) => ({
  type: FETCH_ANNOUNCEMENTS_SUCCESS,
  payload: announcements,
});

export const fetchAnnouncementFailure = (error) => ({
  type: FETCH_ANNOUNCEMENTS_FAILURE,
  payload: error,
});

export const fetchAnnouncements = () => {
  return async (dispatch) => {
    dispatch(fetchAnnouncementRequest());
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/getAnnouncements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  // console.log(response.data)
      dispatch(fetchAnnouncementSuccess(response.data.announcements));
    } catch (error) {
      console.error('Error fetching myAnnouncements:', error);
      dispatch(fetchAnnouncementFailure('Error fetching myAnnouncements'));
    }
  };
};