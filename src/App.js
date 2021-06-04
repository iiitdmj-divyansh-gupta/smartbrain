import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecoginition from './components/FaceRecoginition/FaceRecoginition';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import Rank from './components/Rank/Rank';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initState;
  }

  // life cycle hook that comes with react so 
  // we can use it without array functions
  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(resp => resp.json())
  //   .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    // console.log(event.target.value);
  }

  onButtonSubmit = (event) => {
    // console.log('click');
    this.setState({imageUrl: this.state.input});

    /*since we have moved api call to the backend*/

    // app.models
    // .predict(
    //   Clarifai.FACE_DETECT_MODEL,
    //   this.state.input)
    // .then(resp => {
    //   if(resp) {
    //     fetch('http://localhost:3000/image', {
    //       method: 'put',

    fetch('https://glacial-brook-72345.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
         input: this.state.input
      })
    })
    .then(resp => resp.json())
    .then(resp => {
      if(resp) {
        fetch('https://glacial-brook-72345.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
             id: this.state.user.id
          })
        })
        .then(resp => resp.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(resp))
    })
    .catch(err => console.log(err));
    //
    /*this.state.imageUrl in `predict` won't work here due to the way this.setState works */
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initState);
    }
    else if(route === 'home') {
      this.setState({isSignedIn: true});
    }
    console.log(this.state);
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, box, imageUrl, route} = this.state;
  return (
    <div className="App">
      <Particles className='particles'
        params={particlesOptions}
      />
      <Navigation 
        onRouteChange={this.onRouteChange} 
        isSignedIn={isSignedIn}
      />
      { route === 'home'
        ? <div>
            <Logo />
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} 
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecoginition box={box} imageUrl={imageUrl} />
          </div>
          /*we have to wrap above statements in a div as ternary cannot return more than 1 HTML element*/
        : (
            route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
      }
    </div>
    );
  }
}

export default App;
