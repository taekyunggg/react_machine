import React from 'react';
import Sequencer from './sequencer';
import Effects from './effects';
import Visualizer from './visualizer';
import Footer from './footer';

class DrumMachine extends React.Component {
  render() {
    return (
      <div className="drummachine">
        <Sequencer />
        <div className="fx-visualizer">
          <Effects />
          <Visualizer />
        </div>
        <Footer />
      </div>
    );
  }
}

export default DrumMachine;
