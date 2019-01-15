import React, { Component } from 'react';
import MapGL from 'react-map-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamVzc2llemgiLCJhIjoiY2pxeG5yNHhqMDBuZzN4cHA4ZGNwY2l3OCJ9.T2B6-B6EMW6u9XmjO4pNKw';

export default class App extends Component {
  state = {
    style: 'mapbox://styles/mapbox/dark-v9',
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      longitude: 18.0686,
      latitude: 59.3293,
      zoom: 12,
      maxZoom: 16
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  onStyleChange = (style) => {
    this.setState({ style });
  }

  _onViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  _resize = () => {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return (
      <div>
        <MapGL
          {...this.state.viewport}
          mapStyle={this.state.style}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange={viewport => this._onViewportChange(viewport)}
        />
      </div>
    );
  }
}