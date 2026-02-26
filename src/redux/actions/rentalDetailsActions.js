import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { toast } from 'react-toastify';

export const getRentalDetails = (userId) => async (dispatch) => {
  try {
    const details = await firebaseService.getAll('rentalDetails', userId);
    dispatch({ type: types.GET_RENTAL_DETAILS, payload: details });
  } catch (error) {
    console.error('Error fetching rental details:', error);
    toast.error('Error fetching rental details');
  }
};

export const addRentalDetail = (detailData, userId) => async (dispatch) => {
  try {
    const newDetail = await firebaseService.add('rentalDetails', detailData, userId);
    dispatch({ type: types.ADD_RENTAL_DETAIL, payload: newDetail });
    toast.success('Rental detail added successfully');
    return newDetail;
  } catch (error) {
    console.error('Error adding rental detail:', error);
    toast.error('Error adding rental detail');
  }
};

export const updateRentalDetail = (id, detailData) => async (dispatch) => {
  try {
    const updatedDetail = await firebaseService.update('rentalDetails', id, detailData);
    dispatch({ type: types.UPDATE_RENTAL_DETAIL, payload: updatedDetail });
    toast.success('Rental detail updated successfully');
  } catch (error) {
    console.error('Error updating rental detail:', error);
    toast.error('Error updating rental detail');
  }
};

export const deleteRentalDetail = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('rentalDetails', id);
    dispatch({ type: types.DELETE_RENTAL_DETAIL, payload: id });
    toast.success('Rental detail deleted successfully');
  } catch (error) {
    console.error('Error deleting rental detail:', error);
    toast.error('Error deleting rental detail');
  }
};