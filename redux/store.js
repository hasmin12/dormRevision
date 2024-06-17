import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import reducers from their respective files
import { 
  authReducer, 
  allUsersReducer, 
  notificationsReducer, 
  reservationsReducer, 
  announcementsReducer, 
  laundryschedulesReducer,
  paymentHistoryReducer, 
  maintenancesReducer 
} from './reducers/UserReducers';

import { 
  applicantsReducer, 
  paymentsReducer, 
  roomsReducer, 
  usersReducer, 
  visitorsReducer 
} from './reducers/adminReducer';

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  paymentHistory: paymentHistoryReducer,
  maintenances: maintenancesReducer,
  notifications: notificationsReducer,
  reservations: reservationsReducer,
  users: usersReducer,
  applicants: applicantsReducer,
  rooms: roomsReducer,
  announcements: announcementsReducer,
  laundryschedules: laundryschedulesReducer,
  payments: paymentsReducer,
  visitors: visitorsReducer,
});

// Define the initial state for your Redux store
const initialState = {};

// Create the Redux store with middleware and devtools
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
