import React from 'react';
import Tone from 'tone';

class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.fftAnalyser = new Tone.Analyser('fft', 32);
    this.waveAnalyser = new Tone.Analyser('waveform', 1024);
    Tone.Master.fan(this.fftAnalyser, this.waveAnalyser);
    this.drawFft = this.drawFft.bind(this);
    this.drawWave = this.drawWave.bind(this);
    this.drawVisualizers = this.drawVisualizers.bind(this);
    this.toggleVisualizer = this.toggleVisualizer.bind(this);
  }

  drawFft(values) {
    this.fftCtx.clearRect(0, 0, this.fftWidth, this.fftHeight);
    const barWidth = this.fftWidth / this.fftAnalyser.size;
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const val = values[i] / 255;
      const x = this.fftWidth * (i / len);
      const y = val * this.fftHeight;
      this.fftCtx.fillStyle = "rgba(15, 140, 249, " + val + ")";
      this.fftCtx.fillRect(x, this.fftHeight - y, barWidth, this.fftHeight);
    }
  }

  drawWave(values) {
    this.waveformCtx.clearRect(0, 0, this.waveformWidth, this.waveformHeight);
    values = this.waveAnalyser.analyse();
    this.waveformCtx.beginPath();
    this.waveformCtx.lineJoin = "round";
    this.waveformCtx.lineWidth = 6;
    this.waveformCtx.strokeStyle = this.waveformGradient;
    this.waveformCtx.moveTo(0, (values[0] / 255) * this.waveformHeight);
    for (let i = 1, len = values.length; i < len; i++){
      let val = values[i] / 255;
      let x = this.waveformWidth * (i / len);
      let y = val * this.waveformHeight;
      this.waveformCtx.lineTo(x, y);
    }
    this.waveformCtx.stroke();
  }

  componentDidMount() {
    this.fftCanvas = document.getElementById('fft-canvas');
    this.fftCtx = this.fftCanvas.getContext('2d');
    this.fftWidth = this.fftCanvas.width;
    this.fftHeight = this.fftCanvas.height;
    this.waveformCanvas = document.getElementById('waveform-canvas');
    this.waveformCtx = this.waveformCanvas.getContext('2d');
    this.waveformWidth = this.waveformCanvas.width;
    this.waveformHeight = this.waveformCanvas.height;
    this.waveformGradient = this.waveformCtx.createLinearGradient(0, 0, this.waveformWidth, this.waveformHeight);
    this.waveformGradient.addColorStop(0, "rgb(15, 140, 249)");
    this.waveformGradient.addColorStop(1, "#000");
    this.drawVisualizers();
  }


  drawVisualizers() {
    requestAnimationFrame(this.drawVisualizers);
    const fftValues = this.fftAnalyser.analyse();
    const waveValues = this.waveAnalyser.analyse();
    this.drawFft(fftValues);
    this.drawWave(waveValues);
  }

  toggleVisualizer(e) {
    const fft = document.getElementById('fft-canvas');
    const wave = document.getElementById('waveform-canvas');
    fft.classList.toggle("hidden");
    wave.classList.toggle("hidden");
  }

  render() {
    return (
      <div className="visualizers">
        <div className="visualizer-labels">
          <div
            className="visualizer-label"
            id="fa-tab"
            onClick={this.toggleVisualizer}>
            Frequency/Amplitude
          </div>
          <div
            className="visualizer-label"
            id="wave-tab"
            onClick={this.toggleVisualizer}>
            Waveform
          </div>
        </div>
        <canvas className='fft' id="fft-canvas" height="229px"></canvas>
        <canvas className='waveform hidden' id="waveform-canvas" height="229px"></canvas>
      </div>
    );
  }
}

export default Visualizer;
