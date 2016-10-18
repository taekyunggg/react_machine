# Drum Machine with Visualizer

## Background
I will be building a 16-step drum sequencer, inspired by the Roland 808 and other classic drum machines.  You will be able to trigger sounds by adding them to the sequencer and you will be able to add basic effects to the overall mix.  The overall mix will be outputted to a visualizer which will create a graphical representation of the sound.

## Functionality and MVP

With this drum machine, users will be able to:

* Trigger drum sounds by adding them to the looping step sequencer
* Control the volume of individual sounds and the overall mix
* Add basic effects to the overall mix (reverb/filters/distortion)
* View a visualization of the overall mix

In addition, this project will include:

* An about modal, describing how to use the sequencer
* A production README

## Wireframes

The drum machine will consist of a single screen as the interface.  There will be a mixer section to control the volume of individual sounds at the top-right.  There will be a tab on the mixer section and when clicked, it will reveal an effects panel to adjust the overall mix.  The 16-step sequencer will live at the bottom-right of the interface.  Controls to start/stop and adjust tempo will be on the top-left of the interface.  The visualizer will live in a box in the bottom-left, under the controls.

![Wireframe](/assets/wireframe.png?raw=true "Wireframe")

## Architecture and Technologies

This project will be implemented with the following technologies:

* Vanilla JavaScript with React.js/Redux for structuring the app and for sequencer logic
* Easel.js with HTML5 Canvas to handle the rendering
* Web Audio API to handle all audio aspects
* Webpack to bundle all scripts

The app's logic will be spread across 4 scripts:

`interface.js`: This script will handle the creation and updating of the drum machine interface via Easel.js.

`instrument.js`: This script will include the constructor for individual instruments.  It will be responsible for generating the different sounds for the different instruments.  

`sequencer.js`: This script will use the Web Audio API to handle the summing of individual instruments.  It will handle the looping and timing of the playback.  

`visualizer.js`: This script will take input from the sequencer, and will create a visualization utilizing Easel.js and HTML5 Canvas.

## Implementation Timeline

#### Phase 1
* Setup all Node modules with webpack.  
* Learn basics of Easel.js and Web Audio API
* Create a basic structure for the mixer

#### Phase 2
* Create sequencer sounds in `instrument.js` using Web Audio API
* Add looping functionality
* Connect the individual instruments with `sequencer.js` and sum them to create the mix
* Create mixer interface to allow users to control volume of individual instruments
* Add effects to the overall mix

#### Phase 3
* Add modal with instructions on how to use the drum machine
* Style the sequencer to give it a finished look
* Add the visualizer with ideally 2-3 modes

## Bonus Features

Potential future features include:
* A synthesizer that can be crossfaded with the drum machine output
* Pattern saving and persistence
* Allow users to upload samples
