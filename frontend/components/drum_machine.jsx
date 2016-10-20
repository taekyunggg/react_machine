import React from 'react';
import SequencerContainer from './sequencer/sequencer_container';

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <SequencerContainer />
      </div>
    );
  }
}

export default DrumMachine;
