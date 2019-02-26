/* global window */
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL, { PolygonLayer, PathLayer, ScatterplotLayer } from 'deck.gl';
import { TripsLayer } from '@deck.gl/experimental-layers';

import DataBuildings from './data/buildings.json';
import DataPedestrians from './data/pedestrians.json';
import DataVehicles from './data/vehicles.json';
import DataZebras from './data/zebras.json';
import DataLanes from './data/env_lanes.json';
import DataRound from './data/env_round.json';

// // Not mine
// const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA';

// My token, enable when using my mapbox style
const MAPBOX_TOKEN = 'pk.eyJ1IjoiamVzc2llemgiLCJhIjoiY2pxeG5yNHhqMDBuZzN4cHA4ZGNwY2l3OCJ9.T2B6-B6EMW6u9XmjO4pNKw';
document.addEventListener('contextmenu', evt => evt.preventDefault());

/* To be customized */
const LIGHT_SETTINGS = {
  lightsPosition: [18.06363, 59.33553, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.2, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

/* Kungsgatan view */
export const INITIAL_VIEW_STATE = {
  longitude: 18.06363,
  latitude: 59.33553,
  zoom: 19,
  maxZoom: 22
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
      loopLength = 300, // unit corresponds to the timestamp in source data
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
    return [
      new ScatterplotLayer({
        id: 'pedestrians',
        data: DataPedestrians,
        opacity: 0.8,
        fp64: true,
        getPosition: (d) => {
          for (let i = 0; i < d.trajactory.length; i += 1) {
            if (d.trajactory[i][2] === Math.floor(this.state.time)) {
              return [d.trajactory[i][0], d.trajactory[i][1], 0];
            }
          }
        },
        getRadius: 0.27,
        getColor: [253, 128, 93],
        updateTriggers: {
          getPosition: this.state.time
        }
      }),
      new TripsLayer({
        id: 'pedestrian_path',
        data: DataPedestrians,
        getPath: d => d.nodes,
        getColor: d => (d.violation === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 1.0,
        trailLength: 30,
        currentTime: this.state.time
      }),
      new PolygonLayer({
        id: 'buildings',
        data: DataBuildings,
        extruded: true,
        opacity: 0.08,
        getPolygon: f => f.polygon,
        getElevation: f => f.height,
        getFillColor: [74, 80, 87],
        lightSettings: LIGHT_SETTINGS
      }),
      new PathLayer({
        id: 'zebras',
        data: DataZebras,
        getPath: f => f.line,
        positionFormat: `XY`,
        getColor: [255, 255, 255, 30],
        getWidth: 0.6
      }),
      new PathLayer({
        id: 'env_lanes',
        data: DataLanes,
        getPath: d => d.line,
        positionFormat: `XY`,
        getColor: [255, 255, 255, 20],
        getWidth: d => d.width
      }),
      new PolygonLayer({
        id: 'env_round',
        data: DataRound,
        stroked: false,
        getPolygon: f => f.contour,
        getFillColor: [255, 255, 255, 20]
      }),
      new PathLayer({
        id: 'vehicles',
        data: DataVehicles,
        fp64: false,
        getPath: (d) => {
          for (let i = 0; i < d.vertices.length; i += 1) {
            if (d.vertices[i][2] === Math.floor(this.state.time)) {
              return [d.vertices[i][0], d.vertices[i][1]];
            }
          }
        },
        opacity: 0.003,
        positionFormat: `XY`,
        getColor: [253, 128, 93],
        getWidth: 2.4,
        updateTriggers: {
          getPath: this.state.time
        }
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
            mapStyle="mapbox://styles/jessiezh/cjrq2mxcvd7ul2toc5dllfbyu"
            // mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        )}
      </DeckGL>
    );
  }
}
