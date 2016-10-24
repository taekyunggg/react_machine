import React from 'react';
import Tone from 'tone';

class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.fftAnalyser = new Tone.Analyser('fft', 32);
    this.waveAnalyser = new Tone.Analyser('waveform', 1024);
    Tone.Master.fan(this.fftAnalyser, this.waveAnalyser);
    this.drawFft = this.drawFft.bind(this);
    this.drawVisualizers = this.drawVisualizers.bind(this);
  }

  componentDidMount() {
    this.fftCanvas = document.getElementById('fft-canvas');
    this.fftCtx = this.fftCanvas.getContext('2d');
    this.fftWidth = this.fftCanvas.width;
    this.fftHeight = this.fftCanvas.height;
    this.drawVisualizers();
  }

  drawFft(values) {
    this.fftCtx.clearRect(0, 0, this.fftWidth, this.fftHeight);
    const barWidth = this.fftWidth / this.fftAnalyser.size;
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const val = values[i] / 255;
      const x = this.fftWidth * (i / len);
      const y = val * this.fftHeight;
      this.fftCtx.fillStyle = "rgba(7, 132, 154, " + val + ")";
      this.fftCtx.fillRect(x, this.fftHeight - y, barWidth, this.fftHeight);
    }
  }

  drawVisualizers() {
    requestAnimationFrame(this.drawVisualizers);
    const fftValues = this.fftAnalyser.analyse();
    this.drawFft(fftValues);
  }

  render() {
    return (
      <canvas className='fft' id="fft-canvas" height="300px"></canvas>
    );
  }
}

export default Visualizer;
