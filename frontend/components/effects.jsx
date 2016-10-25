import React from 'react';
import Tone from 'tone';
import Circle from '../util/circle';
import FxParams from '../util/fxParams';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.lpFilter = new Tone.Filter(22000, "lowpass");
    this.hpFilter = new Tone.Filter(0, "highpass");
    this.reverb = new Tone.Freeverb(0.9, 5000);
    this.phaser = new Tone.Phaser(5, 5);
    this.phaser.wet.value = 0;
    this.reverb.wet.value = 0;

    this.fx1 = this.lpFilter;
    this.fx2 = this.reverb;
    this.state = {
      fx1Active: 'lpFilter',
      fx2Active: 'reverb'
    };
    Tone.Master.chain(this.fx1, this.fx2);

    this.getMousePos = this.getMousePos.bind(this);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
    this.initializeCanvas = this.initializeCanvas.bind(this);
    this.canvasTrail = this.canvasTrail.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.animationLoop = this.animationLoop.bind(this);
    this.isActiveFx = this.isActiveFx.bind(this);
    this.changeFx = this.changeFx.bind(this);
  }

  getMousePos(e) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  mouseMoveEvent(e) {
    let mousePos = this.getMousePos(e);
    if (this.fx1 === this.lpFilter) {
      this.fx1[FxParams['lpFilter']].value = mousePos.y * 28 + 50;
    } else if (this.fx1 === this.hpFilter) {
      this.fx1[FxParams['hpFilter']].value = mousePos.y * 40;
    }
    if (this.fx2 === this.reverb) {
      this.fx2[FxParams['reverb']].value = mousePos.x * 0.0002;
    } else if (this.fx2 === this.phaser) {
      this.fx2[FxParams['phaser']].value = mousePos.x * 0.0033;
    }
    const canvasPos = this.getPosition(this.canvas);

    this.animationLoop(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
  }

  getPosition(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }

  componentDidMount(){
    this.canvas = document.getElementById("fx-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.circle = new Circle(this.ctx);
    this.canvas.addEventListener('mousedown', () => {
      this.canvas.addEventListener(
        'mousemove',
        this.mouseMoveEvent,
        false);
    }, false);
    document.getElementById('root').addEventListener('mouseup',
    this.removeListeners, false);
  }

  removeListeners() {
    this.lpFilter.frequency.value = 22000;
    this.hpFilter.frequency.value = 0;
    this.phaser.wet.value = 0;
    this.reverb.wet.value = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
  }

  initializeCanvas() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, 300, 300);
  	this.ctx.fillStyle = "black";
  	this.ctx.fillRect(0, 0, 300, 300);
  }

  canvasTrail(xPos, yPos) {
    this.initializeCanvas();
    this.circle.x = xPos;
    this.circle.y = yPos;
    this.circle.draw();
  }

  animationLoop(xPos, yPos) {
    this.canvasTrail(xPos, yPos);
    this.animationId = window.requestAnimationFrame(
      this.animationLoop.bind(this, xPos, yPos)
    );
  }

  isActiveFx(fx, fxNum) {
    return this.state[fxNum] === this[fx];
  }

  changeFx(fxNum, e) {
    e.preventDefault();
    const effect = e.currentTarget.value;
    this.setState({
      [`${fxNum}Active`]: effect
    });
    this[fxNum] = this[effect];
    Tone.Master.chain(this.fx1, this.fx2);
  }

  render() {
    return (
      <div className="fx-container" >
        <div className="fx-div">
          <p className="fx-name name1">{this.state.fx1Active}</p>
          <p className="fx-name name2">{this.state.fx2Active}</p>
          <canvas id="fx-canvas" width="300" height="300"></canvas>
        </div>
        <div className="fx-selectors">
          <select
            onChange={this.changeFx.bind(this, 'fx1')}
            value={this.state.fx1Active}
            className="fx-selector">
            <option value="lpFilter">
              lowpass filter
            </option>
            <option value="hpFilter">
              highpass filter
            </option>
          </select>
          <select
            onChange={this.changeFx.bind(this, 'fx2')}
            value={this.state.fx2Active}
            className="fx-selector">
            <option value="reverb">
              reverb
            </option>
            <option value="phaser">
              phaser
            </option>
          </select>
        </div>
      </div>
    );
  }
}

export default Effects;
