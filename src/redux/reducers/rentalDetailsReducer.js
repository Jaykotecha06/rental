import * as types from '../types';

const initialState = {
  rentalDetails: [],
  loading: false,
  error: null
};

const rentalDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_RENTAL_DETAILS:
      return {
        ...state,
        rentalDetails: action.payload,
        loading: false
      };
    case types.ADD_RENTAL_DETAIL:
      return {
        ...state,
        rentalDetails: [action.payload, ...state.rentalDetails]
      };
    case types.UPDATE_RENTAL_DETAIL:
      return {
        ...state,
        rentalDetails: state.rentalDetails.map(detail => 
          detail.id === action.payload.id ? action.payload : detail
        )
      };
    case types.DELETE_RENTAL_DETAIL:
      return {
        ...state,
        rentalDetails: state.rentalDetails.filter(detail => detail.id !== action.payload)
      };
    default:
      return state;
  }
};

export default rentalDetailsReducer;