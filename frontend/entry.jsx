import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import Tone from 'tone';
import Modal from 'react-modal';


window.Tone = Tone;

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  Modal.setAppElement(document.body);
  ReactDOM.render(<Root />, root);
});
