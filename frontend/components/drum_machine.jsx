import React from 'react';
import SequencerContainer from './sequencer/sequencer_container';
import EffectsContainer from './effects/effects_container';

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <SequencerContainer />
        <EffectsContainer />
      </div>
    );
  }
}

export default DrumMachine;
