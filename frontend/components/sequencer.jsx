import React from 'react';
import Tone from 'tone';
import classNames from 'classnames';
import { TRANSPORT_POS } from '../util/transport_positions';
import * as samplePacks from '../util/sample_packs';
import { demoTrack, nullTrack } from '../util/patterns';
import SamplerList from '../util/sampler_list';
import Slider from 'material-ui/Slider';
import injectTapEventPlugin from 'react-tap-event-plugin';
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
    this.soloMuteButtons = this.soloMuteButtons.bind(this);
    this.soloSampler = this.soloSampler.bind(this);
    this.muteSampler = this.muteSampler.bind(this);
    this.samplePacks = samplePacks;
    this.preMuteVol = {};
    this.preSoloVol = {};

    this.state = {
      bpm: 106,
      position: 0,
      volume: 0,
      playing: false,
      key: 0
    };

    for (let i = 1; i < 9; i++) {
      this[`channel${i}`] = demoTrack[i - 1];
      this[`sampler${i}`] = new Tone.Sampler(samplePacks.eightZeroEight[i - 1]).toMaster();
      this.state[`s${i}Volume`] = -5;
      this.state[`sampler${i}Solo`] = false;
      this.state[`sampler${i}Disable`] = false;
      this[`sampler${i}`].volume.value = this.state[`s${i}Volume`];
      this[`channelSequence${i}`] = new Tone.Sequence(
        this.triggerSample.bind(this, `sampler${i}`),
        this[`channel${i}`],
        "16n").start(0);
    }

    Tone.Transport.setLoopPoints(0, "1m");
    Tone.Transport.loop = true;
    Tone.Transport.scheduleRepeat(this.positionHighlight, "16n");
    Tone.Transport.bpm.value = this.state.bpm;
    Tone.Master.volume.value = this.state.volume;
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

  triggerSample(sampler) {
    this[sampler].triggerAttackRelease(0);
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
      if (this[channel][idx]) {
        stepClass = classNames({
          "step-button": true,
          "step-on": true,
          "step-off": false,
          "step-on-active": idx === this.state.position,
          "downbeat": idx % 4 === 0,
          "muted-on": this.state[`s${channel[7]}Volume`] < -49
        });
      } else {
        stepClass = classNames({
          "step-button": true,
          "step-on": false,
          "step-off": true,
          "step-off-active": idx === this.state.position,
          "downbeat": idx % 4 === 0,
          "muted-off": this.state[`s${channel[7]}Volume`] < -49
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

  soloMuteButtons() {
    const volButtons = [];
    for (let i = 1; i < 9; i++) {
      const muteClass = classNames({
        "mute": true,
        "mute-active": this.state[`s${i}Volume`] < -49
      });
      const soloClass = classNames({
        "solo": true,
        "solo-active": this.state[`sampler${i}Solo`]
      });
      volButtons.push(
        <div className="solo-mute" key={i}>
          <button className={soloClass} onClick={this.soloSampler.bind(this, `sampler${i}`)} disabled={this.state[`sampler${i}Disable`]}>S</button>
          <button className={muteClass} onClick={this.muteSampler.bind(this, `sampler${i}`)}>M</button>
        </div>
      );
    }
    return volButtons;
  }

  soloSampler(sampler, e) {
    e.currentTarget.blur();
    if (this.state[`${sampler}Solo`]) {
      for (let i = 0; i < 8; i++) {
        if (sampler === SamplerList[i]) {
          this.setState({
            [`${sampler}Solo`]: false
          });
        } else {
          const preVolume = this.preSoloVol[`sampler${i + 1}`];
          this.setState({
            [`s${i + 1}Volume`]: preVolume,
            [`sampler${i + 1}Disable`]: false
          });
          this[`sampler${i + 1}`].volume.value = preVolume;
        }
      }
    } else {
      for (let i = 0; i < 8; i++) {
        if (sampler === SamplerList[i]) {
          this.setState({
            [`${sampler}Solo`]: true
          });
        } else {
          this.setState({
            [`sampler${i + 1}Solo`]: false,
            [`sampler${i + 1}Disable`]: true
          });
          this.preSoloVol[`sampler${i + 1}`] = this.state[`s${i + 1}Volume`];
          if (this.state[`s${i + 1}Volume`] > -50) {
            this.muteSampler(`sampler${i + 1}`, e);
          }
        }
      }
    }
  }

  muteSampler(sampler, e) {
    e.currentTarget.focus();
    e.currentTarget.blur();
    if (this.state[`s${sampler[7]}Volume`] > -50) {
      this.preMuteVol[sampler] = this.state[`s${sampler[7]}Volume`];
      this.setState({
        [`s${sampler[7]}Volume`]: -50
      });
      this[sampler].volume.value = -10000;
    } else {
      const preVolume = this.preMuteVol[sampler];
      this.setState({
        [`s${sampler[7]}Volume`]: preVolume
      });
      this[sampler].volume.value = preVolume;
    }
  }

  updateSequence(e) {
    const channel = e.currentTarget.dataset.channel;
    const idx = parseInt(e.currentTarget.dataset.idx);
    const oldSeq = this[channel];
    if (oldSeq[idx]){
      oldSeq[idx] = null;
      this[`channelSequence${channel[7]}`].remove(idx);
    } else {
      oldSeq[idx] = true;
      this[`channelSequence${channel[7]}`].add(idx, true);
    }
    this[channel] = oldSeq;
    this.setState({ key: Math.random() });
  }

  clearPattern() {
    for (let i = 1; i < 9; i++) {
      this[`channel${i}`] = [
          null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null
        ];
      for (let j = 0; j < 16; j++) {
        this[`channelSequence${i}`].remove(j);
      }
    }
    this.forceUpdate();
  }

  changeTempo(e) {
    let newTempo = parseInt(e.currentTarget.value);
    if (isNaN(newTempo)) {
      newTempo = 1;
    }
    if (newTempo > 300) {
      newTempo = 300;
    }
    Tone.Transport.bpm.value = newTempo;
    this.setState({ bpm: newTempo });
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
    this[sampler].volume.value = e;
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
          <div className="solo-mute-buttons">
            { this.soloMuteButtons() }
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
