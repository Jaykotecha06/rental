import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { toast } from 'react-toastify';

export const getRents = (userId) => async (dispatch) => {
  try {
    const rents = await firebaseService.getAll('rents', userId);
    dispatch({ type: types.GET_RENTS, payload: rents });
  } catch (error) {
    console.error('Error fetching rents:', error);
    toast.error('Error fetching rents');
  }
};

export const addRent = (rentData, userId) => async (dispatch) => {
  try {
    const newRent = await firebaseService.add('rents', rentData, userId);
    dispatch({ type: types.ADD_RENT, payload: newRent });
    toast.success('Rent added successfully');
    return newRent;
  } catch (error) {
    console.error('Error adding rent:', error);
    toast.error('Error adding rent');
  }
};

export const updateRent = (id, rentData) => async (dispatch) => {
  try {
    const updatedRent = await firebaseService.update('rents', id, rentData);
    dispatch({ type: types.UPDATE_RENT, payload: updatedRent });
    toast.success('Rent updated successfully');
  } catch (error) {
    console.error('Error updating rent:', error);
    toast.error('Error updating rent');
  }
};

export const deleteRent = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('rents', id);
    dispatch({ type: types.DELETE_RENT, payload: id });
    toast.success('Rent deleted successfully');
  } catch (error) {
    console.error('Error deleting rent:', error);
    toast.error('Error deleting rent');
  }
};