import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import Tone from 'tone';


window.Tone = Tone;

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  ReactDOM.render(<Root />, root);
});
