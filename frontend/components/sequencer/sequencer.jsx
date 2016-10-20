import React from 'react';
import Tone from 'tone';
import classNames from 'classnames';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.sampler1 = new Tone.Sampler(
      "https://s3.amazonaws.com/react-drummachine/BD.WAV"
    ).toMaster();
    this.sampler2 = new Tone.Sampler(
      "https://s3.amazonaws.com/react-drummachine/SD.WAV"
    ).toMaster();
    this.sampler3 = new Tone.Sampler(
      "https://s3.amazonaws.com/react-drummachine/CH.WAV"
    ).toMaster();

    this.state = {
      channel1: [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ],
      channel2: [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ],
      channel3: [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ]
    };

    this.triggerSample = this.triggerSample.bind(this);
    this.startStop = this.startStop.bind(this);
    this.updateSequence = this.updateSequence.bind(this);
    this.channel1 = new Tone.Sequence(
      this.triggerSample.bind(this, "sampler1"),
      this.state.channel1,
       "16n").start(0);
    this.channel2 = new Tone.Sequence(
      this.triggerSample.bind(this, "sampler2"),
      this.state.channel2,
       "16n").start(0);
    this.channel3 = new Tone.Sequence(
      this.triggerSample.bind(this, "sampler3"),
      this.state.channel3,
       "16n").start(0);
  }

  triggerSample(sampler) {
    this[sampler].triggerAttackRelease(0);
  }

  startStop() {
    if (this.props.playing) {
      Tone.Transport.stop();
      this.props.startStop(false);
    } else {
      Tone.Transport.start();
      this.props.startStop(true);
    }
  }

  channelButtons(channel) {
    const buttonIdx = [];
    for (let i = 0; i < 16; i++){
      buttonIdx.push(i);
    }
    const buttons = buttonIdx.map((idx) => {
      let stepClass;
      if (this.state[channel][idx]) {
        stepClass = classNames({
          "step-button": true,
          "step-on": true
        });
      } else {
        stepClass = classNames({
          "step-button": true,
          "step-on": false
        });
      }
      return (
        <div
          data-channel={channel}
          data-idx={idx}
          key={idx}
          className={stepClass}
          onClick={this.updateSequence}/>
      );
    });
    return buttons;
  }

  updateSequence(e) {
    const channel = e.currentTarget.dataset.channel;
    const idx = parseInt(e.currentTarget.dataset.idx);
    const oldSeq = this.state[channel];
    if (oldSeq[idx]){
      oldSeq[idx] = null;
      this[channel].remove(idx);
    } else {
      oldSeq[idx] = true;
      this[channel].add(idx, true);
    }
    this.setState({
      [channel]: oldSeq
    });
  }

  render() {
    return (
      <div>
        <div className="start-stop" onClick={this.startStop}>start/stop</div>
        <div className='channel-row'>
          { this.channelButtons("channel1") }
        </div>
        <div className='channel-row'>
          { this.channelButtons("channel2") }
        </div>
        <div className='channel-row'>
          { this.channelButtons("channel3") }
        </div>

      </div>
    );
  }
}

export default Sequencer;
