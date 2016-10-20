import React from 'react';
import Tone from 'tone';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.channel1 = new Tone.Sampler(
      "https://s3.amazonaws.com/react-drummachine/BD.WAV"
    ).toMaster();
    this.triggerSample = this.triggerSample.bind(this);
  }

  triggerSample() {
    this.channel1.triggerAttackRelease(0);
  }

  render() {
    return (
      <div className='channel1' onClick={this.triggerSample}>kick drum</div>
    );
  }
}

export default Sequencer;
