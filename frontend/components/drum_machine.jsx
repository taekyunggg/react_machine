import React from 'react';
import Sequencer from './sequencer/sequencer';
import Effects from './effects/effects';
import Visualizer from './visualizer/visualizer';

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <Sequencer />
        <div className="fx-visualizer">
          <Effects />
          <Visualizer />
        </div>
      </div>
    );
  }
}

export default DrumMachine;
