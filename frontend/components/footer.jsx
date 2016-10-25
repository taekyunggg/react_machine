import React from 'react';
import Modal from 'react-modal';
import { instructionStyle } from '../util/instruction_style';
import Instructions from './instructions';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { instructionOpen: false };
    this.toggleInstructions = this.toggleInstructions.bind(this);
  }

  toggleInstructions(bool){
    this.setState({ instructionOpen: bool });
  }



  render() {
    return (
      <footer className="footer">
        <div className="instructions-button footer-el">
          <div className="instructions-text" onClick={this.toggleInstructions.bind(this, true)}>
            Instructions
          </div>
        </div>
        <p className="footer-me-tag footer-el">
          Made with {"\u266A"} by&nbsp;<a href="http://richardkwan.io/" className="myname">Richard Kwan</a>
        </p>
        <a href="https://github.com/taekyunggg/drum_machine" className="footer-github footer-el">
          <i className="fa fa-github footer-icon" aria-hidden="true"></i>
        </a>
        <Modal
          isOpen={this.state.instructionOpen}
          onRequestClose={this.toggleInstructions.bind(this, false)}
          style={instructionStyle} >
          <Instructions />
        </Modal>

      </footer>
    );
  }
}


export default Footer;
