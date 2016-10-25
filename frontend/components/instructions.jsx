import React from 'react';

const Instructions = () => (
  <div className='instructions'>
    <p>
      Welcome to React Machine! <br />
      Headphones are recommended.
      <br />
      <br />
      To toggle playback, press the play button, or use the spacebar.  The number in the top right represents the tempo in beats per minute.
      <br />
      <br />
      Each row represents a different instrument, and you can toggle sounds by clicking on individual squares.  The
      yellow dials on the left control the volume of each instrument and can be controlled by clicking
      and dragging or by scrolling.
      <br />
      <br />
      In the bottom left, there is an FX-pad which houses 2 effects that can be controlled via the x and y axis.
      Click and drag over the pad to activate the effects.  You can change the active effect via the dropdown below the pad.
    </p>
  </div>
);

export default Instructions;
