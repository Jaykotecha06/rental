import * as types from '../types';

const initialState = {
  documents: [],
  loading: false,
  error: null
};

const documentReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload,
        loading: false
      };
    case types.ADD_DOCUMENT:
      return {
        ...state,
        documents: [action.payload, ...state.documents]
      };
    case types.UPDATE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.map(doc => 
          doc.id === action.payload.id ? action.payload : doc
        )
      };
    case types.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
    default:
      return state;
  }
};

export default documentReducer;