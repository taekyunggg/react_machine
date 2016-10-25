import React from 'react';
import Tone from 'tone';
import Circle from '../util/circle';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.filter = new Tone.Filter(22000, "lowpass");
    this.reverb = new Tone.Freeverb(0.8, 5000);
    this.reverb.wet.value = 0;
    Tone.Master.chain(this.filter, this.reverb);
    this.getMousePos = this.getMousePos.bind(this);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
    this.initializeCanvas = this.initializeCanvas.bind(this);
    this.canvasTrail = this.canvasTrail.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.animationLoop = this.animationLoop.bind(this);
    this.state = {};
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

    this.filter.frequency.value = mousePos.y * 28 + 50;
    this.reverb.wet.value = mousePos.x * 0.00015;
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
    this.filter.frequency.value = 22000;
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

  render() {
    return (
      <div className="fx-div">
        <p className="fx-name name1">filter</p>
        <p className="fx-name name2">reverb</p>
        <canvas id="fx-canvas" width="300" height="300"></canvas>
      </div>
    );
  }
}

export default Effects;
