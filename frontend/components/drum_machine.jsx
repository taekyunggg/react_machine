import React from 'react';
import Sequencer from './sequencer';

window.Sequencer = Sequencer;

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <Sequencer />
      </div>
    );
  }
}

export default DrumMachine;
