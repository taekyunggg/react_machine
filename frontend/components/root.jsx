import { Provider } from "react-redux";
import React from "react";
import merge from 'lodash/merge';
import configureStore from '../store/store';
import DrumMachine from './drum_machine';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = configureStore();

const Root = () => (
  <MuiThemeProvider>
    <Provider store={store}>
      <DrumMachine />
    </Provider>
  </MuiThemeProvider>
);

export default Root;
