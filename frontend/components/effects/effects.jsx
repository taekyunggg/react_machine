import React from 'react';
import Tone from 'tone';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterCutoff: 22000
    };
    this.filter = new Tone.Filter(22000, "lowpass");
    Tone.Master.chain(this.filter);
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
    this.filter.frequency.value = mousePos.x * 40;
    if (this.filter.frequency.value === 0) {
      this.filter.frequency.value = 1;
    }
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }

  componentDidMount(){
    this.canvas = document.getElementById("fx-canvas");
    this.canvas.addEventListener('mousedown', () => {
      this.canvas.addEventListener(
        'mousemove',
        this.mouseMoveEvent,
        false);
    }, false);
    this.canvas.addEventListener('mouseup', () => {
      this.filter.frequency.value = 22000;
      this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
    }, false);
  }

  render() {
    return (
      <div className="fx-div">
        <canvas id="fx-canvas"></canvas>
      </div>
    );
  }
}

export default Effects;
