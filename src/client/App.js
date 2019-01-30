/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, { PolygonLayer } from 'deck.gl';
import { TripsLayer } from '@deck.gl/experimental-layers';

import DataBuildings from './data/buildings.json';
import DataTrips from './data/trips.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA';
document.addEventListener('contextmenu', evt => evt.preventDefault());

/* To be customized */
const LIGHT_SETTINGS = {
  lightsPosition: [18.0585, 59.3044, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.2, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

/* Kungsgatan view */
export const INITIAL_VIEW_STATE = {
  longitude: 18.0599,
  latitude: 59.3352,
  zoom: 16.5,
  maxZoom: 20,
  pitch: 45,
  bearing: -60
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  componentDidMount() {
    this._animate();
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate() {
    const {
      loopLength = 1800, // unit corresponds to the timestamp in source data
      animationSpeed = 30 // unit time per second
    } = this.props;
    const timestamp = Date.now() / 1000;
    const loopTime = loopLength / animationSpeed;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _renderLayers() {
    const {trailLength = 180} = this.props;

    return [
      new TripsLayer({
        id: 'trips',
        data: DataTrips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        strokeWidth: 2,
        trailLength,
        currentTime: this.state.time
      }),
      new PolygonLayer({
        id: 'buildings',
        data: DataBuildings,
        extruded: true,
        wireframe: false,
        fp64: true,
        opacity: 0.08,
        getPolygon: f => f.polygon,
        getElevation: f => f.height,
        getFillColor: [74, 80, 87],
        lightSettings: LIGHT_SETTINGS
      })
    ];
  }

  render() {
    const {viewState, controller = true, baseMap = true} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
        {baseMap && (
          <StaticMap
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}
      </DeckGL>
    );
  }
}
