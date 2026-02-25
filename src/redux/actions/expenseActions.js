import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { toast } from 'react-toastify';

export const getExpenses = (userId) => async (dispatch) => {
  try {
    const expenses = await firebaseService.getAll('expenses', userId);
    dispatch({ type: types.GET_EXPENSES, payload: expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    toast.error('Error fetching expenses');
  }
};

export const addExpense = (expenseData, userId) => async (dispatch) => {
  try {
    const newExpense = await firebaseService.add('expenses', expenseData, userId);
    dispatch({ type: types.ADD_EXPENSE, payload: newExpense });
    toast.success('Expense added successfully');
    return newExpense;
  } catch (error) {
    console.error('Error adding expense:', error);
    toast.error('Error adding expense');
  }
};

export const updateExpense = (id, expenseData) => async (dispatch) => {
  try {
    const updatedExpense = await firebaseService.update('expenses', id, expenseData);
    dispatch({ type: types.UPDATE_EXPENSE, payload: updatedExpense });
    toast.success('Expense updated successfully');
  } catch (error) {
    console.error('Error updating expense:', error);
    toast.error('Error updating expense');
  }
};

export const deleteExpense = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('expenses', id);
    dispatch({ type: types.DELETE_EXPENSE, payload: id });
    toast.success('Expense deleted successfully');
  } catch (error) {
    console.error('Error deleting expense:', error);
    toast.error('Error deleting expense');
  }
};