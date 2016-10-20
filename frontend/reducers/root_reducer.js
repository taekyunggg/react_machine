import { combineReducers } from 'redux';
import TransportReducer from './transport_reducer';

const RootReducer = combineReducers({
  transport: TransportReducer
});

export default RootReducer;
