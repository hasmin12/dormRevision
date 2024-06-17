
import { 
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    ALL_APPLICANTS_REQUEST,
    ALL_APPLICANTS_SUCCESS,
    ALL_APPLICANTS_FAIL,
    ALL_ROOMS_REQUEST,
    ALL_ROOMS_SUCCESS,
    ALL_ROOMS_FAIL,
    
  ALL_PAYMENTS_FAILURE,
  ALL_PAYMENTS_REQUEST,
  ALL_PAYMENTS_SUCCESS,
  ALL_VISITORS_REQUEST,
    ALL_VISITORS_SUCCESS,
    ALL_VISITORS_FAIL,
 } from "../constants";
const initialUsersState = {
    users: [],
    loading: false,
    error: null,
};

  export const usersReducer = (state = initialUsersState, action) => {
    switch (action.type) {
      case ALL_USERS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ALL_USERS_SUCCESS:
        return {
          ...state,
          loading: false,
          users: action.payload,
        };
      case ALL_USERS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  const initialApplicantsState = {
    applicants: [],
    loading: false,
    error: null,
};

  export const applicantsReducer = (state = initialApplicantsState, action) => {
    switch (action.type) {
      case ALL_APPLICANTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ALL_APPLICANTS_SUCCESS:
        return {
          ...state,
          loading: false,
          applicants: action.payload,
        };
      case ALL_APPLICANTS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  const initialRoomsState = {
    rooms: [],
    loading: false,
    error: null,
};

  export const roomsReducer = (state = initialRoomsState, action) => {
    switch (action.type) {
      case ALL_ROOMS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ALL_ROOMS_SUCCESS:
        return {
          ...state,
          loading: false,
          rooms: action.payload,
        };
      case ALL_ROOMS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  const initialPaymentsState = {
    payments: [],
    loading: false,
    error: null,
};
  export const paymentsReducer = (state = initialPaymentsState, action) => {
    switch (action.type) {
      case ALL_PAYMENTS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case ALL_PAYMENTS_SUCCESS:
        return {
          ...state,
          loading: false,
          payments: action.payload,
        };
      case ALL_PAYMENTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  
const initialVisitorsState = {
  visitors: [],
  loading: false,
  error: null,
};

export const visitorsReducer = (state = initialVisitorsState, action) => {
  switch (action.type) {
    case ALL_VISITORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ALL_VISITORS_SUCCESS:
      return {
        ...state,
        loading: false,
        visitors: action.payload,
      };
    case ALL_VISITORS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
