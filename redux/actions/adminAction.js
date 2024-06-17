import axios from 'axios';
import {
 UPDATE_RESIDENT_REQUEST,
 UPDATE_RESIDENT_SUCCESS,

 UPDATE_RESIDENT_RESET,

 UPDATE_RESIDENT_FAIL

} from '../constants';
import { ALL_USERS_REQUEST,ALL_USERS_SUCCESS, ALL_USERS_FAIL, ALL_APPLICANTS_REQUEST,ALL_APPLICANTS_SUCCESS, ALL_APPLICANTS_FAIL,ALL_ROOMS_REQUEST,ALL_ROOMS_SUCCESS, ALL_ROOMS_FAIL,

  ALL_PAYMENTS_FAILURE,
  ALL_PAYMENTS_REQUEST,
  ALL_PAYMENTS_SUCCESS,
  ALL_VISITORS_REQUEST,
  ALL_VISITORS_SUCCESS,
  ALL_VISITORS_FAIL, } from '../constants';
import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
    return AsyncStorage.getItem('token');
  };

export const updateResident = (id, residentData) => async (dispatch) => {
    try {
      const token = await getAuthToken();
      dispatch({ type: UPDATE_RESIDENT_REQUEST })
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
          'Authorization': `Bearer ${token}`,
        },
        // withCredentials: true
      }
  
      console.log("Request Data:", residentData);
  
      const { data } = await axios.post(`${baseURL}/user/${id}`, residentData, config)
      dispatch({
        type: UPDATE_RESIDENT_SUCCESS,
        payload: data.success
      })
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Resident Update Successful",
      });
    } catch (error) {
        console.log(error);
      dispatch({
        type: UPDATE_RESIDENT_FAIL,
        payload: error.response.data.message
      })
    }
  }

  
export const fetchUserRequest = () => ({
  type: ALL_USERS_REQUEST,
});

export const fetchUserSuccess = (users) => ({
  type: ALL_USERS_SUCCESS,
  payload: users,
});

export const fetchUserFailure = (error) => ({
  type: ALL_USERS_FAIL,
  payload: error,
});

export const fetchUsers = (searchQuery, residentType, selectedBranch)  => {
  return async (dispatch) => {
    dispatch(fetchUserRequest());
    try {
      const token = await getAuthToken();
      // console.log(residentType)
      const response = await axios.get(`${baseURL}/getResidents?resident_type=${residentType}&search_query=${searchQuery}&branch=${selectedBranch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchUserSuccess(response.data.residents));
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(fetchUserFailure('Error fetching users'));
    }
  };
};

export const fetchApplicantsRequest = () => ({
  type: ALL_APPLICANTS_REQUEST,
});

export const fetchApplicantsSuccess = (users) => ({
  type: ALL_APPLICANTS_SUCCESS,
  payload: users,
});

export const fetchApplicantsFailure = (error) => ({
  type: ALL_APPLICANTS_FAIL,
  payload: error,
});

export const fetchApplicants = ()  => {
  return async (dispatch) => {
    dispatch(fetchApplicantsRequest());
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/getApplicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchApplicantsSuccess(response.data.applicants));
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(fetchApplicantsFailure('Error fetching users'));
    }
  };
};

export const fetchRoomsRequest = () => ({
  type: ALL_ROOMS_REQUEST,
});

export const fetchRoomsSuccess = (rooms) => ({
  type: ALL_ROOMS_SUCCESS,
  payload: rooms,
});

export const fetchRoomsFailure = (error) => ({
  type: ALL_ROOMS_FAIL,
  payload: error,
});

export const fetchRooms = (selectedBranch)  => {
  return async (dispatch) => {
    dispatch(fetchRoomsRequest());
    try {
      const token = await getAuthToken();

      const response = await axios.get(`${baseURL}/getRooms?branch=${selectedBranch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchRoomsSuccess(response.data.rooms));
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching rooms:', error);
      dispatch(fetchRoomsFailure('Error fetching rooms'));
    }
  };
};

export const fetchPaymentsRequest = () => ({
  type: ALL_PAYMENTS_REQUEST,
});

export const fetchPaymentsSuccess = (payments) => ({
  type: ALL_PAYMENTS_SUCCESS,
  payload: payments,
});

export const fetchPaymentsFailure = (error) => ({
  type: ALL_PAYMENTS_FAILURE,
  payload: error,
});

export const fetchPayments = () => {
  return async (dispatch) => {
    dispatch(fetchPaymentsRequest());
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${baseURL}/getDormPayments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchPaymentsSuccess(response.data.payments));
    } catch (error) {
      console.error('Error fetching payments:', error);
      dispatch(fetchPaymentsFailure('Error fetching payments'));
    }
  };
};

export const fetchVisitorRequest = () => ({
  type: ALL_VISITORS_REQUEST,
});

export const fetchVisitorSuccess = (visitors) => ({
  type: ALL_VISITORS_SUCCESS,
  payload: visitors,
});

export const fetchVisitorFailure = (error) => ({
  type: ALL_VISITORS_FAIL,
  payload: error,
});

export const fetchVisitors = ()  => {
  return async (dispatch) => {
    dispatch(fetchVisitorRequest());
    try {
      const token = await getAuthToken();
      // console.log(residentType)
      const response = await axios.get(`${baseURL}/getVisitors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchVisitorSuccess(response.data.visitors));
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching visitors:', error);
      dispatch(fetchVisitorFailure('Error fetching visitors'));
    }
  };
};

  

  