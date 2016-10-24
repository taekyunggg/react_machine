import React from 'react';
import Sequencer from './sequencer/sequencer';
import Effects from './effects/effects';

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <Sequencer />
        <Effects />
      </div>
    );
  }
}

export default DrumMachine;
