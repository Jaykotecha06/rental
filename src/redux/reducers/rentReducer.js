import * as types from '../types';

const initialState = {
  rents: [],
  loading: false,
  error: null
};

const rentReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_RENTS:
      return {
        ...state,
        rents: action.payload,
        loading: false
      };
    case types.ADD_RENT:
      return {
        ...state,
        rents: [action.payload, ...state.rents]
      };
    case types.UPDATE_RENT:
      return {
        ...state,
        rents: state.rents.map(rent =>
          rent.id === action.payload.id ? action.payload : rent
        )
      };
    case types.DELETE_RENT:
      return {
        ...state,
        rents: state.rents.filter(rent => rent.id !== action.payload)
      };
    default:
      return state;
  }
};

export default rentReducer;