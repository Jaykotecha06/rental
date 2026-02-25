import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { toast } from 'react-toastify';

export const getDeposits = (userId) => async (dispatch) => {
  try {
    const deposits = await firebaseService.getAll('deposits', userId);
    dispatch({ type: types.GET_DEPOSITS, payload: deposits });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    toast.error('Error fetching deposits');
  }
};

export const addDeposit = (depositData, userId) => async (dispatch) => {
  try {
    const newDeposit = await firebaseService.add('deposits', depositData, userId);
    dispatch({ type: types.ADD_DEPOSIT, payload: newDeposit });
    toast.success('Deposit added successfully');
    return newDeposit;
  } catch (error) {
    console.error('Error adding deposit:', error);
    toast.error('Error adding deposit');
  }
};

export const updateDeposit = (id, depositData) => async (dispatch) => {
  try {
    const updatedDeposit = await firebaseService.update('deposits', id, depositData);
    dispatch({ type: types.UPDATE_DEPOSIT, payload: updatedDeposit });
    toast.success('Deposit updated successfully');
  } catch (error) {
    console.error('Error updating deposit:', error);
    toast.error('Error updating deposit');
  }
};

export const deleteDeposit = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('deposits', id);
    dispatch({ type: types.DELETE_DEPOSIT, payload: id });
    toast.success('Deposit deleted successfully');
  } catch (error) {
    console.error('Error deleting deposit:', error);
    toast.error('Error deleting deposit');
  }
};