import React, { Component } from 'react';
import './App.css';

import MyMapComponent from './Map';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            latitude: "",
            longitude: ""
        }
    }

  setLatLong = (latitude, longitude) => {
      return this.setState({
          latitude,
          longitude
      })
  }

  render() {
    const { latitude, longitude } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Latitude: {latitude}</h1>
            <h1 className="App-title">Longitude: {longitude}</h1>
        </header>
          <MyMapComponent
              isMarkerShown
              setLatLong={this.setLatLong}
          />
      </div>
    );
  }
}

export default App;
