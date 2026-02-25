import { toast } from 'react-toastify';
import authService from '../../services/authService';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const SET_LOADING = 'SET_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

// Direct action for auth state listener
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user
});

export const logout = () => ({
  type: LOGOUT
});

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const user = await authService.login(email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    toast.success('Login successful!');
    return { success: true };
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error });
    toast.error(error);
    return { success: false };
  } finally {
    dispatch({ type: STOP_LOADING });
  }
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING });
    const user = await authService.signup(name, email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    toast.success('Account created successfully!');
    return { success: true };
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error });
    toast.error(error);
    return { success: false };
  } finally {
    dispatch({ type: STOP_LOADING });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authService.logout();
    dispatch({ type: LOGOUT });
    toast.info('Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Error logging out');
  }
};