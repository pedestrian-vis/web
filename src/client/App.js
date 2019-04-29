import React, { Component } from 'react';
import './components/app.css';

// redux states management
import { connect } from 'react-redux';

import Simulation from './components/Simulation';
import FlowChart from './components/FlowChart';
import CrossingChart from './components/CrossingChart';
import HeatmapMain from './components/HeatmapMain';
import HeatmapBuffer from './components/HeatmapBuffer';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={this.props.loading ? 'loading_back' : ''} />
        <div className="left_simulation">
          <Simulation />
          <span className={this.props.loading ? 'loading_icon1' : ''} />
        </div>
        <div className="left_graph">
          <span className="title_area">Crossing Frequency<span className="current_flow">&nbsp;&nbsp;&nbsp;{this.props.flow_value} people/signal cycle</span></span>
          <div className="area_cross_time"><CrossingChart /></div>
          <span className="area_cross_anno annotation">Light turns green at 75s</span>
          <span className={this.props.loading ? 'loading_icon2' : ''} />
        </div>
        <div className="right_top_graph">
          <span className="title_uti">Space Utilization<span className="current_flow">&nbsp;&nbsp;&nbsp;{this.props.flow_value} people/signal cycle</span></span>
          <div className="heatmap_container">
            <div className="heatmap_main"><HeatmapMain /></div>
            <div className="heatmap_buf"><HeatmapBuffer /></div>
            <span className="heatmap_ori1 annotation">WEST</span>
            <span className="heatmap_ori2 annotation">EAST</span>
            <span className={this.props.loading ? 'loading_icon3' : ''} />
          </div>
          <div className="heatmap_legend" />
          <span className="heatmap_leg_text2 annotation">heavily used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;not used - buffer area</span>
          <span className="heatmap_leg_text1 annotation">heavily used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;not used - lane area</span>
        </div>
        <div className="right_bottom_graph">
          <span className="title_area">Illegal Percentage<span className="current_flow">&nbsp;&nbsp;&nbsp;select a flow rate!!!</span></span>
          <div className="area_illegal_flow"><FlowChart /></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);