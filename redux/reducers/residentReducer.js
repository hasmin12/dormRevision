import {  
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    
    REGISTER_RESIDENT_REQUEST,
    REGISTER_RESIDENT_SUCCESS,
    REGISTER_RESIDENT_FAIL,

    LOAD_RESIDENT_REQUEST,
    LOAD_RESIDENT_SUCCESS,
    LOAD_RESIDENT_FAIL,

    LOGOUT_SUCCESS,
    LOGOUT_FAIL,

    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_FAIL,

    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_RESET,
    UPDATE_PASSWORD_FAIL,

    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,

    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,

    ALL_RESIDENTS_REQUEST,
    ALL_RESIDENTS_SUCCESS,
    ALL_RESIDENTS_FAIL,

    UPDATE_RESIDENT_REQUEST,
    UPDATE_RESIDENT_SUCCESS,
    UPDATE_RESIDENT_RESET,
    UPDATE_RESIDENT_FAIL,

    RESIDENT_DETAILS_REQUEST,
    RESIDENT_DETAILS_SUCCESS,
    RESIDENT_DETAILS_FAIL,

    DELETE_RESIDENT_REQUEST,
    DELETE_RESIDENT_SUCCESS,
    DELETE_RESIDENT_RESET,

    DELETE_RESIDENT_FAIL,
    RESIDENT_SALES_REQUEST,
    RESIDENT_SALES_SUCCESS,
    RESIDENT_SALES_FAIL,

    CLEAR_ERRORS
} from '../constants';
  

export const residentReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case UPDATE_RESIDENT_REQUEST:
        case DELETE_RESIDENT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case UPDATE_RESIDENT_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_RESIDENT_RESET:

            return {
                ...state,
                isUpdated: false
            }
        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_RESIDENT_FAIL:
        case DELETE_RESIDENT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELETE_RESIDENT_SUCCESS:

            return {

                ...state,

                loading: false,

                isDeleted: action.payload

            }
        case DELETE_RESIDENT_RESET:

            return {

                ...state,

                isDeleted: false

            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}



  
export default residentReducer;
  