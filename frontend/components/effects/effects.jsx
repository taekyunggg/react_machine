import React from 'react';
import Tone from 'tone';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterCutoff: 22000
    };
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
    console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  }

  componentDidMount(){
    this.canvas = document.getElementById("fx-canvas");
    this.canvas.addEventListener('mousedown', () => {
      this.canvas.addEventListener('mousemove', this.mouseMoveEvent
      , false);
    }, false);
    this.canvas.addEventListener('mouseup', () => {
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
