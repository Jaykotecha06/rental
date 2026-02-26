import * as types from '../types';

const initialState = {
  deposits: [],
  loading: false,
  error: null
};

const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DEPOSITS:
      return {
        ...state,
        deposits: action.payload,
        loading: false
      };
    case types.ADD_DEPOSIT:
      return {
        ...state,
        deposits: [action.payload, ...state.deposits]
      };
    case types.UPDATE_DEPOSIT:
      return {
        ...state,
        deposits: state.deposits.map(deposit =>
          deposit.id === action.payload.id ? action.payload : deposit
        )
      };
    case types.DELETE_DEPOSIT:
      return {
        ...state,
        deposits: state.deposits.filter(deposit => deposit.id !== action.payload)
      };
    default:
      return state;
  }
};

export default depositReducer;