import * as types from '../types';

const initialState = {
  expenses: [],
  loading: false,
  error: null
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_EXPENSES:
      return {
        ...state,
        expenses: action.payload,
        loading: false
      };
    case types.ADD_EXPENSE:
      return {
        ...state,
        expenses: [action.payload, ...state.expenses]
      };
    case types.UPDATE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case types.DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    default:
      return state;
  }
};

export default expenseReducer;