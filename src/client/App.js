/* global window */
import React, { Component } from 'react';
import { StaticMap, MapGL } from 'react-map-gl';
import DeckGL, { PolygonLayer, ScatterplotLayer } from 'deck.gl';
import { TripsLayer } from '@deck.gl/experimental-layers';

import { MapboxLayer } from '@deck.gl/mapbox';
import mapboxgl from 'mapbox-gl';
// import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA';
mapboxgl.accessToken = MAPBOX_TOKEN;

// const Map = ReactMapboxGl({
//   accessToken: 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pudzRtaWloMDAzcTN2bzN1aXdxZHB5bSJ9.2bkj3IiRC8wj3jLThvDGdA'
// });

// const map = new mapboxgl.Map({
//   style: 'mapbox://styles/mapbox/light-v9',
//   center: [18.0616, 59.3343],
//   zoom: 14.5,
//   pitch: 45,
//   bearing: 0,
//   container: 'map'
// });

// map.on('load', () => {
//   map.addLayer({
//     id: '3d-buildings',
//     source: 'composite',
//     'source-layer': 'building',
//     filter: ['==', 'extrude', 'true'],
//     type: 'fill-extrusion',
//     minzoom: 15,
//     paint: {
//       'fill-extrusion-color': '#aaa',
//       // use an 'interpolate' expression to add a smooth transition effect to the
//       // buildings as the user zooms in
//       'fill-extrusion-height': [
//         'interpolate', ['linear'], ['zoom'],
//         15, 0,
//         15.05, ['get', 'height']
//       ],
//       'fill-extrusion-base': [
//         'interpolate', ['linear'], ['zoom'],
//         15, 0,
//         15.05, ['get', 'min_height']
//       ],
//       'fill-extrusion-opacity': 0.6
//     }
//   });
// });














const DATA_URL = {
  BUILDINGS:
    'https://raw.githubusercontent.com/Jessie1201/traffic_visualization/master/src/client/data/buildings.json', // eslint-disable-line
  TRIPS:
    'https://raw.githubusercontent.com/Jessie1201/traffic_visualization/master/src/client/data/trips.json' // eslint-disable-line
};

document.addEventListener('contextmenu', evt => evt.preventDefault());

/* To be customized */
const LIGHT_SETTINGS = {
  lightsPosition: [18.0616, 59.3343, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

/* Kungsgatan view */
export const INITIAL_VIEW_STATE = {
  longitude: 18.0616,
  latitude: 59.3343,
  zoom: 14.5,
  maxZoom: 17,
  pitch: 45,
  bearing: 0
};

/* New York view for uber example */
// export const INITIAL_VIEW_STATE = {
//   longitude: -74,
//   latitude: 40.72,
//   zoom: 14,
//   maxZoom: 16,
//   pitch: 45,
//   bearing: 0
// };

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







  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    map.addLayer(new MapboxLayer({ id: 'my-scatterplot', deck }));
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
      new ScatterplotLayer({
        id: 'my-scatterplot',
        data: [
          { position: [18.0616, 59.3343], size: 100 }
        ],
        getPosition: d => d.position,
        getRadius: d => d.size,
        getColor: [255, 0, 0]
      }),
      new TripsLayer({
        id: 'trips',
        data: DATA_URL.TRIPS,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        strokeWidth: 2,
        trailLength,
        currentTime: this.state.time
      }),
      new PolygonLayer({
        id: 'buildings',
        data: DATA_URL.BUILDINGS,
        extruded: true,
        wireframe: false,
        fp64: true,
        opacity: 0.5,
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
        ref={ref => {
          // save a reference to the Deck instance
          this._deck = ref && ref.deck;
        }}
        layers={this._renderLayers()}
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={controller}
      >
        {baseMap && (
          <StaticMap
            ref={ref => {
              // save a reference to the mapboxgl.Map instance
              this._map = ref && ref.getMap();
            }}
            reuseMaps
            mapStyle="mapbox://styles/mapbox/dark-v9"
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onLoad={this._onMapLoad}
          />
        )}
      </DeckGL>
    );
  }
}
