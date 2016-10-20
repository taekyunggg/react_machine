import { Provider } from "react-redux";
import React from "react";
import merge from 'lodash/merge';
import configureStore from '../store/store';
import DrumMachine from './drum_machine';

const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <DrumMachine />
  </Provider>
);

export default Root;
