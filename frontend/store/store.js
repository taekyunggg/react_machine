import { createStore } from 'redux';
import RootReducer from '../reducers/root_reducer';

const configureStore = () => {
  return createStore(
    RootReducer,
    (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  );
};

export default configureStore;
