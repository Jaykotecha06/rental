import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { toast } from 'react-toastify';

export const getLightBills = (userId) => async (dispatch) => {
  try {
    const lightBills = await firebaseService.getAll('lightbills', userId);
    dispatch({ type: types.GET_LIGHT_BILLS, payload: lightBills });
  } catch (error) {
    console.error('Error fetching light bills:', error);
    toast.error('Error fetching light bills');
  }
};

export const addLightBill = (billData, userId) => async (dispatch) => {
  try {
    // Calculate amount
    const units = parseFloat(billData.currentUnit) - parseFloat(billData.lastUnit);
    const amount = units * 9.5;
    
    const newBill = await firebaseService.add('lightbills', {
      ...billData,
      amount: amount.toFixed(2)
    }, userId);
    
    dispatch({ type: types.ADD_LIGHT_BILL, payload: newBill });
    toast.success('Light bill added successfully');
    return newBill;
  } catch (error) {
    console.error('Error adding light bill:', error);
    toast.error('Error adding light bill');
  }
};

export const updateLightBill = (id, billData) => async (dispatch) => {
  try {
    // Calculate amount
    const units = parseFloat(billData.currentUnit) - parseFloat(billData.lastUnit);
    const amount = units * 9.5;
    
    const updatedBill = await firebaseService.update('lightbills', id, {
      ...billData,
      amount: amount.toFixed(2)
    });
    
    dispatch({ type: types.UPDATE_LIGHT_BILL, payload: updatedBill });
    toast.success('Light bill updated successfully');
  } catch (error) {
    console.error('Error updating light bill:', error);
    toast.error('Error updating light bill');
  }
};

export const deleteLightBill = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('lightbills', id);
    dispatch({ type: types.DELETE_LIGHT_BILL, payload: id });
    toast.success('Light bill deleted successfully');
  } catch (error) {
    console.error('Error deleting light bill:', error);
    toast.error('Error deleting light bill');
  }
};