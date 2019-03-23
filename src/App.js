import React, { Component } from 'react';
import Navigation from './Components/navigation/Navigation'; 
import Logo from './Components/Logo/Logo'; 
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank'; 
import './App.css';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai'; 
import Signin from './Components/Signin/Signin'
import Register from './Components/Register/Register'
import tachyons from 'tachyons';

const app = new Clarifai.App({
  apiKey: 'faca6f1e93734d719da3ab8308b27aba'
})
const particleParams = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    }
  }
}


class App extends Component {
  constructor() {
    super(); 
    this.state = {
      input: '', 
      imageURL: '',
      box: {},
      route: 'signin', 
      isSignedIn: false, 
    }
  };

  calculateFaceLocation = (data) => {
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage'); 
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height, 
      rightCol: width - (boundingBox.right_col * width), 
      bottomRow: height - (boundingBox.bottom_row * height), 
    } 
  }

  displayBox = (box) => {
    this.setState({box: box}); 
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = (event) => {
    this.setState({imageURL: this.state.input}); 

    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({isSignedIn: false}) 
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route}); 
  }

  render() {
    return (
      <div className="App">
        <Particles
          className='particles' 
          params={particleParams}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/> 
      { this.state.route === 'home'   
        ? <div>
            <Logo />
            <Rank /> 
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
          </div>
        : this.state.route === 'register' 
        ? <Register onRouteChange={this.onRouteChange}/> 
        : <Signin onRouteChange={this.onRouteChange}/>
      }
      </div>
    );
  }
}

export default App;
