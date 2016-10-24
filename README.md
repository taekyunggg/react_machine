# React Machine

This is a step-sequencer written using React.js, Tone.js, HTML, and CSS.  It features 16 steps and 8 different samples and you can create patterns by activating and deactivating cells within the matrix.  There is also an effects pad which applies effects when the user clicks and drags over the pad.  The Tone.js library is used to handle audio synchronization and triggering of samples.

![machine](/assets/images/machine.png)

## Technical Features

The Tone.js library offers a Tone.Sequence object that allows several different samples to be triggered in time.  The 8 different samples are held in a Tone.Sampler object.  The Tone.Transport object handles the overall timing of all events.

![code1](/assets/images/code1.png)

The effects pad is implemented by using an HTML canvas element.  I created a custom event combining mousedown and mouseover to create the functionality of a mousehold event.  When this event is triggered, the canvas element calculates the mouse position relative to the bounds of the canvas and then uses this X/Y position to modify the parameters on the active effects on the pad and also to draw a circle that follows the mouse position.  

![code2](/assets/images/code2.png)

![code3](/assets/images/code3.png)

## Features to be added

* Additional sample packs to switch between
* Allow the user to switch the active FX on the pad
* Add a visualizer on the master audio output
* Add a demo track
