import React from 'react';
import Tone from 'tone';
import classNames from 'classnames';
import { TRANSPORT_POS } from '../../util/transport_positions';
import * as samplePacks from '../../util/sample_packs';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.triggerSample = this.triggerSample.bind(this);
    this.startStop = this.startStop.bind(this);
    this.updateSequence = this.updateSequence.bind(this);
    this.changeTempo = this.changeTempo.bind(this);
    this.positionHighlight = this.positionHighlight.bind(this);
    this.samplePacks = samplePacks;

    this.state = {
      bpm: 120,
      position: 0
    };

    for (let i = 1; i < 9; i++) {
      this.state[`channel${i}`] = [
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null
      ];
      this.state[`sampler${i}`] = new Tone.Sampler(samplePacks.eightZeroEight[i - 1]).toMaster();
      this[`channel${i}`] = new Tone.Sequence(
        this.triggerSample.bind(this, `sampler${i}`),
        this.state[`channel${i}`],
        "16n").start(0);
    }

    Tone.Transport.setLoopPoints(0, "1m");
    Tone.Transport.loop = true;
    Tone.Transport.scheduleRepeat(this.positionHighlight, "16n");
  }

  triggerSample(sampler) {
    this.state[sampler].triggerAttackRelease(0);
  }

  positionHighlight() {
    this.setState({ position: TRANSPORT_POS[Tone.Transport.position.slice(0, 5)] });
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
          "step-on": true,
          "step-off": false,
          "step-on-active": idx === this.state.position
        });
      } else {
        stepClass = classNames({
          "step-button": true,
          "step-on": false,
          "step-off": true,
          "step-off-active": idx === this.state.position
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

  changeTempo(e) {
    let newTempo = parseInt(e.currentTarget.value);
    if (isNaN(newTempo)) {
      newTempo = 1;
    }
    Tone.Transport.bpm.value = newTempo;
    this.setState({bpm: newTempo });
  }

  render() {
    let playPause;
    if (this.props.playing) {
      playPause = <i className="fa fa-pause" aria-hidden="true"></i>;
    } else {
      playPause = <i className="fa fa-play" aria-hidden="true"></i>;
    }

    let grid = [];
    for (let i = 1; i < 9; i++) {
      grid.push(
        <div className="channel-row" key={i}>
          { this.channelButtons(`channel${i}`) }
        </div>
      );
    }

    return (
      <div className="sequencer">
        <div className="sequencer-header">
          <div className="transport-controls">
            <div className="start-stop" onClick={this.startStop}>{playPause}</div>
            <input type="number" className="tempo-input" onChange={this.changeTempo} value={this.state.bpm}></input>
          </div>
          <h2 className="sequencer-title">react machine</h2>
        </div>
        { grid }

      </div>
    );
  }
}

export default Sequencer;
