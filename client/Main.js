import React, { createRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Webcam from 'react-webcam';
import { drawFace } from './faceDrawing';
import { drawOutline } from './drawOutline';
import NavBar from './Navbar';
import Footer from './Footer';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      color: 'Red',
      chosenModel: 'None',
      loadedModel: null,
      connected: false,
      clearInt: null,
      running: false,
      webCamStatus: false,
    };

    this.webcam = createRef();
    this.canvas = createRef();
    this.loadModel = this.loadModel.bind(this);
    this.detect = this.detect.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.changeModel = this.changeModel.bind(this);
  }

  async loadModel(selectedOption) {
    let neuralNetwork;

    if (selectedOption === 'Face') {
      neuralNetwork = await facemesh.load({});
    }

    if (selectedOption === 'Objects') {
      neuralNetwork = await cocoSsd.load();
    }

    return neuralNetwork;
  }

  async detect(
    neuralNetwork,
    webcam,
    canvas,
    selectedOption,
    color,
    connected
  ) {
    if (
      typeof webcam.current !== 'undefined' &&
      webcam.current !== null &&
      // check to ensure that we are receiving data
      webcam.current.video.readyState === 4
    ) {
      const { video } = webcam.current;
      const { videoHeight, videoWidth } = video;

      // force the video size - will make it easier to run detections
      webcam.current.video.width = videoWidth;
      webcam.current.video.height = videoHeight;

      // resize canvas to video size
      canvas.current.width = videoWidth;
      canvas.current.height = videoHeight;

      // make detections using neuralNetwork from tensorflow, and pass them to be drawn onto the canvas
      let detectedInput;
      const canvasContext = canvas.current.getContext('2d');

      if (selectedOption === 'Face') {
        detectedInput = await neuralNetwork.estimateFaces(video);
        drawFace(detectedInput, canvasContext, color, connected);
      }

      if (selectedOption === 'Objects') {
        detectedInput = await neuralNetwork.detect(video);
        drawOutline(detectedInput, canvasContext, color);
      }
    }
  }

  changeColor(color) {
    this.setState({ color });
  }

  changeModel(chosenModel) {
    this.setState({ chosenModel });
  }

  render() {
    const {
      chosenModel,
      color,
      connected,
      clearInt,
      webCamStatus,
      running,
    } = this.state;

    return (
      <div className='App'>
        <div id='main-wrapper'>
          <div id='model-header'>
            <div>Webcam Status: </div>
            <span>Off</span>
            <label className='switch'>
              <input
                onClick={() => {
                  this.setState({ webCamStatus: !this.state.webCamStatus });
                }}
                type='checkbox'
              ></input>
              <span className='slider round'></span>
            </label>
            <span>On</span>
            <div id='model-text'>
              <b></b>Current Model: {chosenModel} <br />
              Model Options:{' '}
            </div>
            <button
              className='model-button button-css'
              onClick={() => this.changeModel('Face')}
            >
              FACE
            </button>
            <button
              className='model-button button-css'
              onClick={() => {
                this.changeModel('Objects');
              }}
            >
              OBJECTS
            </button>
            <button
              className={`start-button button-css ${
                running || chosenModel === 'None' ? 'disabled' : ''
              }`}
              disabled={running === true}
              onClick={async () => {
                const loadedModel = await this.loadModel(chosenModel);
                this.setState({ loadedModel });

                const executedModel = setInterval(() => {
                  this.detect(
                    loadedModel,
                    this.webcam,
                    this.canvas,
                    chosenModel,
                    color,
                    connected
                  );
                }, 100);

                this.setState({ clearInt: executedModel, running: true });
              }}
            >
              DETECT
            </button>
            <button
              className={`stop-button button-css ${!running ? 'disabled' : ''}`}
              disabled={!running ? true : false}
              onClick={() => {
                clearInterval(clearInt);
                const canvasContext = this.canvas.current.getContext('2d');
                canvasContext.clearRect(0, 0, 640, 480);
                this.changeModel('None');
                this.setState({ running: false });
              }}
            >
              STOP
            </button>
            <div className='mesh-text'>
              Use Connected Mesh
              <br /> (Face Model Only - Requires Restarting Model)
            </div>
            <div className='slider-container'>
              <span>No</span>
              <label className='switch'>
                <input
                  onClick={() => {
                    this.setState({ connected: !this.state.connected });
                  }}
                  type='checkbox'
                ></input>
                <span className='slider round'></span>
              </label>
              <span>Yes</span>
            </div>
            <div id='color-options'>
              <div id='color-option-text'>
                Current Color: {color}
                <br />
                Color Options:{' '}
              </div>
              <button
                className='button-css red'
                onClick={() => this.changeColor('Red')}
              >
                Red
              </button>
              <button
                className='button-css yellow'
                onClick={() => this.changeColor('Yellow')}
              >
                Yellow
              </button>
              <button
                className='button-css blue'
                onClick={() => this.changeColor('Blue')}
              >
                Blue
              </button>
              <button
                className='button-css cyan'
                onClick={() => this.changeColor('Cyan')}
              >
                Cyan
              </button>
            </div>
          </div>
          <div id='webcam-border'>
            {/* render our webcam */}

            {webCamStatus ? (
              <Webcam ref={this.webcam} id='webcam' />
            ) : (
              <div className='warning'>TURN ON WEBCAM TO USE FEATURES</div>
            )}
            {/* render a canvas over the webcam to draw on */}
            <canvas
              ref={this.canvas}
              width='640'
              height='480'
              id='canvas'
            ></canvas>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
