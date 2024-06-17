import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  FETCH_PAYMENT_HISTORY_REQUEST,
  FETCH_PAYMENT_HISTORY_SUCCESS,
  FETCH_PAYMENT_HISTORY_FAILURE,
  FETCH_MAINTENANCES_REQUEST,
  FETCH_MAINTENANCES_SUCCESS,
  FETCH_MAINTENANCES_FAILURE,
  FETCH_NOTIFICATIONS_FAILURE,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_RESERVATIONS_FAILURE,
  FETCH_RESERVATIONS_SUCCESS,
  FETCH_RESERVATIONS_REQUEST,
  FETCH_ANNOUNCEMENTS_FAILURE,
  FETCH_ANNOUNCEMENTS_REQUEST,
  FETCH_ANNOUNCEMENTS_SUCCESS,
  FETCH_LAUNDRYSCHEDULES_REQUEST,
  FETCH_LAUNDRYSCHEDULES_SUCCESS,
  FETCH_LAUNDRYSCHEDULES_FAILURE,
  CLEAR_ERRORS,
} from "../constants/UserConstants";

export const authReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
    case LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      };
    case REGISTER_USER_SUCCESS:
    case LOGIN_SUCCESS:
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case REGISTER_USER_FAIL:
    case LOGIN_FAIL:
    case LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_SUCCESS:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

const initialState = {
  paymentHistory: [],
  loading: false,
  error: null,
};

export const paymentHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PAYMENT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PAYMENT_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentHistory: action.payload,
      };
    case FETCH_PAYMENT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialMaintenanceState = {
  maintenances: [],
  loading: false,
  error: null,
};

export const maintenancesReducer = (
  state = initialMaintenanceState,
  action
) => {
  switch (action.type) {
    case FETCH_MAINTENANCES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_MAINTENANCES_SUCCESS:
      return {
        ...state,
        loading: false,
        maintenances: action.payload,
      };
    case FETCH_MAINTENANCES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialNotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const notificationsReducer = (
  state = initialNotificationState,
  action
) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };
    case FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialReservationState = {
  reservations: [],
  loading: false,
  error: null,
};

export const reservationsReducer = (
  state = initialReservationState,
  action
) => {
  switch (action.type) {
    case FETCH_RESERVATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RESERVATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        reservations: action.payload,
      };
    case FETCH_RESERVATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialAnnouncementState = {
  announcements: [],
  loading: false,
  error: null,
};

export const announcementsReducer = (
  state = initialAnnouncementState,
  action
) => {
  switch (action.type) {
    case FETCH_ANNOUNCEMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ANNOUNCEMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        announcements: action.payload,
      };
    case FETCH_ANNOUNCEMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialLaundryscheduleState = {
  laundryschedules: [],
  loading: false,
  error: null,
};

export const laundryschedulesReducer = (
  state = initialLaundryscheduleState,
  action
) => {
  switch (action.type) {
    case FETCH_LAUNDRYSCHEDULES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_LAUNDRYSCHEDULES_SUCCESS:
      return {
        ...state,
        loading: false,
        laundryschedules: action.payload,
      };
    case FETCH_LAUNDRYSCHEDULES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
