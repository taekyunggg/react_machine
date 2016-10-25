import React from 'react';
import Tone from 'tone';
import classNames from 'classnames';
import { TRANSPORT_POS } from '../../util/transport_positions';
import * as samplePacks from '../../util/sample_packs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Slider from 'material-ui/Slider';
import { demoTrack, nullTrack } from '../../util/patterns';
import Knob from 'react-canvas-knob';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.triggerSample = this.triggerSample.bind(this);
    this.startStop = this.startStop.bind(this);
    this.updateSequence = this.updateSequence.bind(this);
    this.changeTempo = this.changeTempo.bind(this);
    this.positionHighlight = this.positionHighlight.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.clearPattern = this.clearPattern.bind(this);
    this.changeSVolume = this.changeSVolume.bind(this);
    this.samplePacks = samplePacks;

    this.state = {
      bpm: 106,
      position: 0,
      volume: -10,
      playing: false,

    };

    for (let i = 1; i < 9; i++) {
      this.state[`channel${i}`] = demoTrack[i - 1];
      this.state[`sampler${i}`] = new Tone.Sampler(samplePacks.eightZeroEight[i - 1]).toMaster();
      this.state[`s${i}Volume`] = -10;
      this.state[`sampler${i}`].volume.value = this.state[`s${i}Volume`];
      this[`channel${i}`] = new Tone.Sequence(
        this.triggerSample.bind(this, `sampler${i}`),
        this.state[`channel${i}`],
        "16n").start(0);
    }

    Tone.Transport.setLoopPoints(0, "1m");
    Tone.Transport.loop = true;
    Tone.Transport.scheduleRepeat(this.positionHighlight, "16n");
    Tone.Transport.bpm.value = this.state.bpm;
    Tone.Master.volume.value = this.state.volume;
  }

  triggerSample(sampler) {
    this.state[sampler].triggerAttackRelease(0);
  }

  positionHighlight() {
    this.setState({ position: TRANSPORT_POS[Tone.Transport.position.slice(0, 5)] });
  }

  startStop() {
    if (this.state.playing) {
      Tone.Transport.stop();
      this.setState({ playing: false });
    } else {
      Tone.Transport.start();
      this.setState({ playing: true });
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
          "step-on-active": idx === this.state.position,
          "downbeat": idx % 4 === 0
        });
      } else {
        stepClass = classNames({
          "step-button": true,
          "step-on": false,
          "step-off": true,
          "step-off-active": idx === this.state.position,
          "downbeat": idx % 4 === 0
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

  clearPattern() {
    for (let i = 1; i < 9; i++) {
      this.setState({
        [`channel${i}`]: [
          null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null
        ]
      });
      for (let j = 0; j < 16; j++) {
        this[`channel${i}`].remove(j);
      }
    }
  }

  changeTempo(e) {
    let newTempo = parseInt(e.currentTarget.value);
    if (isNaN(newTempo)) {
      newTempo = 1;
    }
    Tone.Transport.bpm.value = newTempo;
    this.setState({bpm: newTempo });
  }

  componentWillMount() {
    injectTapEventPlugin();
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => {
      const keyName = e.key;
      if (keyName === " ") {
        this.startStop();
      }
    });
  }

  changeVolume(e, value) {
    this.setState({volume: value });
    if (value < -39) {
      value = -10000;
    }
    Tone.Master.volume.value = value;
  }


  changeSVolume(sampler, e) {
    const stateVolume = sampler[0] + sampler[7] + 'Volume';
    this.setState({ [stateVolume]: e });
    if (e < -49) {
      e = -10000;
    }
    this.state[sampler].volume.value = e;
  }

  render() {
    let playPause;
    if (this.state.playing) {
      playPause = <i className="fa fa-pause" aria-hidden="true"></i>;
    } else {
      playPause = <i className="fa fa-play" aria-hidden="true"></i>;
    }
    let volumeIcon;
    if (this.state.volume > -20) {
      volumeIcon = <i className="fa fa-volume-up" aria-hidden="true"></i>;
    } else if (this.state.volume > -40) {
      volumeIcon = <i className="fa fa-volume-down" aria-hidden="true"></i>;
    } else {
      volumeIcon = <i className="fa fa-volume-off" aria-hidden="true"></i>;
    }

    let sequencerGrid = [];
    let volumeKnobs = [];
    for (let i = 1; i < 9; i++) {
      sequencerGrid.push(
        <div className="channel-row" key={i}>
          { this.channelButtons(`channel${i}`) }
        </div>
      );
      volumeKnobs.push(
        <div className='volume-knob' key={i}>
          <Knob
            value={this.state[`s${i}Volume`]}
            width={30}
            height={30}
            max={0}
            min={-50}
            thickness={0.30}
            displayInput={false}
            onChange={this.changeSVolume.bind(this, `sampler${i}`)} />
        </div>
      );
    }


    return (
      <div className="sequencer">
        <div className="sequencer-header">
          <div className="transport-controls">
            <div className="start-stop" onClick={this.startStop}>{playPause}</div>
            <input type="number" className="tempo-input" onChange={this.changeTempo} value={this.state.bpm}></input>
            <div className="volume-section">
              { volumeIcon }
              <Slider
                min={-40}
                max={0}
                value={this.state.volume}
                onChange={this.changeVolume}
                className="master-volume"/>
            </div>
            <div className="clear-pattern" onClick={this.clearPattern}>Clear</div>
          </div>
          <h2 className="sequencer-title">react machine</h2>
        </div>
        <div className="input-matrix">
          <div className="volume-knobs" >
            { volumeKnobs }
          </div>
          <div className="sequencer-grid">
            { sequencerGrid }
          </div>
        </div>
      </div>
    );
  }
}

export default Sequencer;
