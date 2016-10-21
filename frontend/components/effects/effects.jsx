import React from 'react';
import Tone from 'tone';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.filter = new Tone.Filter(22000, "lowpass");
    this.panner = new Tone.Panner(0);
    Tone.Master.chain(this.filter, this.panner);
    this.getMousePos = this.getMousePos.bind(this);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);

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
    this.filter.frequency.value = mousePos.y * 30 + 100;
    this.panner.pan.value = (mousePos.x - 200) * 0.005;
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 4;
    let lastX, lastY;
    this.ctx.moveTo(lastX, lastY);
    this.ctx.lineTo(mousePos.x, mousePos.y);
    this.ctx.stroke();

    lastX = mousePos.x;
    lastY = mousePos.y;
  }

  componentDidMount(){
    this.canvas = document.getElementById("fx-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.addEventListener('mousedown', () => {
      this.canvas.addEventListener(
        'mousemove',
        this.mouseMoveEvent,
        false);
    }, false);
    document.getElementById('root').addEventListener('mouseup', () => {
      this.filter.frequency.value = 22000;
      this.panner.pan.value = 0;
      this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
    }, false);
  }

  render() {
    return (
      <div className="fx-div">
        <div>filter</div>
        <div>panner</div>
        <canvas id="fx-canvas"></canvas>
      </div>
    );
  }
}

export default Effects;
