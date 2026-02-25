import * as types from '../types';

const initialState = {
  lightBills: [],
  loading: false,
  error: null
};

const lightBillReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_LIGHT_BILLS:
      return {
        ...state,
        lightBills: action.payload,
        loading: false
      };
    case types.ADD_LIGHT_BILL:
      return {
        ...state,
        lightBills: [action.payload, ...state.lightBills]
      };
    case types.UPDATE_LIGHT_BILL:
      return {
        ...state,
        lightBills: state.lightBills.map(bill => 
          bill.id === action.payload.id ? action.payload : bill
        )
      };
    case types.DELETE_LIGHT_BILL:
      return {
        ...state,
        lightBills: state.lightBills.filter(bill => bill.id !== action.payload)
      };
    default:
      return state;
  }
};

export default lightBillReducer;