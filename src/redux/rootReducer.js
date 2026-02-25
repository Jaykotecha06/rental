import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import rentReducer from './reducers/rentReducer';
import lightBillReducer from './reducers/lightBillReducer';
import depositReducer from './reducers/depositReducer';
import expenseReducer from './reducers/expenseReducer';
import documentReducer from './reducers/documentReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  rent: rentReducer,
  lightBill: lightBillReducer,
  deposit: depositReducer,
  expense: expenseReducer,
  document: documentReducer
});

export default rootReducer;