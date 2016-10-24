import React from "react";
import merge from 'lodash/merge';
import DrumMachine from './drum_machine';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const Root = () => (
  <MuiThemeProvider>
    <DrumMachine />
  </MuiThemeProvider>
);

export default Root;
