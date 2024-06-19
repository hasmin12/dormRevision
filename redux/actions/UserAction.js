import axios from 'axios';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_RESIDENT_REQUEST,
    REGISTER_RESIDENT_SUCCESS,
    REGISTER_RESIDENT_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    FETCH_LAUNDRYSCHEDULES_REQUEST,
    FETCH_LAUNDRYSCHEDULES_SUCCESS,
    FETCH_LAUNDRYSCHEDULES_FAILURE,

} from '../constants/UserConstants';
import baseURL from '../../assets/common/baseUrl';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../assets/common/url';
export const loginHostel = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const config = {
          headers: {
              'Content-Type': 'application/json',
          },
          withCredentials: true,
      };

        const response = await axios.post(`${baseURL}/signinHostel`, { email, password }, config);
        console.log(response.data.data);


        await AsyncStorage.setItem('token', response.data.data.token);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                user: response.data.data.token,
            },
        });
  

        Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Login Successful",
            // text2: "Please Login into your account",
          });
    } catch (error) {
        console.log(error.response);
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Wrong Username or Password",
          });

        dispatch({
            type: LOGIN_FAIL,
            payload: error.response ? error.response.data.message : 'An error occurred.',
        });
    }
};

export const googleLogin = (email) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const response1 = await axios.get(`${url}/csrf-token`);
    const csrfToken = response1.data.csrf_token;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
    };

      const response = await axios.post(`${baseURL}/googleSigninMobile`, { email }, config);
      console.log(response.data.token);


      await AsyncStorage.setItem('token', response.data.token);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: {
              user: response.data.user,
          },
      });


      Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Login Successful",
        });
  } catch (error) {
      console.log(error.response);
      Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Email has no access",
        });

      dispatch({
          type: LOGIN_FAIL,
          payload: error.response ? error.response.data.message : 'An error occurred.',
      });
  }
};
export const loginDorm = (email, password) => async (dispatch) => {
  try {
      dispatch({ type: LOGIN_REQUEST });
      const response1 = await axios.get(`${url}/csrf-token`);
      const csrfToken = response1.data.csrf_token;
      const config = {
          headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
          },
          withCredentials: true,
      };

      const response = await axios.post(`${url}/signin`, { email, password }, config);
      console.log(`${url}/signin`);
      console.log(response.data.user);

      await AsyncStorage.setItem('token', response.data.token);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: {
              user: response.data.user,
          },
      });

      Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Login Successful",
          visibilityTime: 800,
      });
  } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
      }
      const errorMessage = error.response ? error.response.data.message : 'An error occurred.';
      Toast.show({
          topOffset: 60,
          type: "error",
          text1: errorMessage,
      });

      dispatch({
          type: LOGIN_FAIL,
          payload: errorMessage,
      });
  }
};

export const registerDorm= (formData) => async (dispatch) => {
    try {
      dispatch({ type: REGISTER_RESIDENT_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      };
  
      const response = await axios.post(`${baseURL}/createRegistration`, formData, config);
  
      if (response.status === 200) {
        dispatch({
          type: REGISTER_RESIDENT_SUCCESS,
          payload: response.data.resident,
        });
  
        // Handle success action like showing a Toast and navigating
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Application Submitted",
          // text2: "Please Wait for Confirmation",
        });
        
      } else {
        console.error('Unexpected response status:', response.status);
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
  
  export const registerHostel= (formData, navigation) => async (dispatch) => {
    try {
      dispatch({ type: REGISTER_RESIDENT_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      };
  
      const response = await axios.post(`${baseURL}/registerHostel`, formData, config);
  
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

  export const fetchResidents = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_USERS_REQUEST });
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      dispatch(updateAllUsers(response.data.users));
    } catch (error) {
      dispatch({
        type: ALL_USERS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

  
export const fetchLaundryscheduleRequest = () => ({
  type: FETCH_LAUNDRYSCHEDULES_REQUEST,
});

export const fetchLaundryscheduleSuccess = (laundryschedules) => ({
  type: FETCH_LAUNDRYSCHEDULES_SUCCESS,
  payload: laundryschedules,
});

export const fetchLaundryscheduleFailure = (error) => ({
  type: FETCH_LAUNDRYSCHEDULES_FAILURE,
  payload: error,
});

export const fetchLaundryschedules = () => {
  return async (dispatch) => {
    dispatch(fetchLaundryscheduleRequest());
    try {
      const token = await AsyncStorage.getItem('token');
      

      const response = await axios.get(`${baseURL}/getLaundry`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(fetchLaundryscheduleSuccess(response.data));

    } catch (error) {
      console.error('Error fetching myLaundryschedules:', error);
      dispatch(fetchLaundryscheduleFailure('Error fetching myLaundryschedules'));
    }
  };
};