import React from 'react';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { instructionOpen: false };
    
  }


  render() {
    return (
      <footer className="footer">
        <div className="instructions-button footer-el">
          <div className="instructions-text">
            Instructions
          </div>
        </div>
        <p className="footer-me-tag footer-el">
          Made with {"\u266A"} by&nbsp;<a href="http://richardkwan.io/" className="myname">Richard Kwan</a>
        </p>
        <a href="https://github.com/taekyunggg/drum_machine" className="footer-github footer-el">
          <i className="fa fa-github footer-icon" aria-hidden="true"></i>
        </a>
      </footer>
    );
  }
}


export default Footer;
