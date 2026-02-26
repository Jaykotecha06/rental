import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_LOADING,
  STOP_LOADING
} from '../actions/authActions';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with true to show loading while checking auth
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        loading: false
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true
      };

    case STOP_LOADING:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};

export default authReducer;